#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source "$SCRIPT_DIR/utils/logging.sh"
source "$SCRIPT_DIR/backup-credentials.conf"

get_backup_path() {
    local filename="$1"
    
    # Extract backup type (daily, manual, monthly, weekly) from filename
    local backup_type=$(echo "$filename" | grep -o '_\(daily\|manual\|monthly\|weekly\)_' | tr -d '_')
    
    if [ -z "$backup_type" ]; then
        log_message "Error: Invalid backup filename format"
        return 1
    fi
    
    echo "${BACKUP_DIR}/${backup_type}/${filename}"
}

validate_backup_file() {
    local backup_file="$1"
    
    # Check if file exists and is readable
    if [ ! -f "$backup_file" ] || [ ! -r "$backup_file" ]; then
        log_message "Error: Backup file not found or not readable: $backup_file"
        return 1
    fi

    # Check if file is not empty
    if [ ! -s "$backup_file" ]; then
        log_message "Error: Backup file is empty: $backup_file"
        return 1
    fi

    # For gzipped files, check if they're valid
    if [[ "$backup_file" == *.gz ]]; then
        if ! gzip -t "$backup_file" 2>/dev/null; then
            log_message "Error: Backup file is corrupted: $backup_file"
            return 1
        fi
    fi

    return 0
}


restore_backup() {
    local filename="$1"
    local backup_file
    
    # Get and validate backup path
    if ! backup_file=$(get_backup_path "$filename"); then
        log_message "Error: Failed to determine backup path for $filename"
        return 1
    fi
    
    # Validate backup file
    if ! validate_backup_file "$backup_file"; then
        return 1
    fi
    
    log_message "Starting restore of database '$DB_NAME'"
    log_message "Starting restore from backup: $backup_file"
    
    # Create temporary restore log
    local restore_log=$(mktemp)
    
    export PGPASSWORD="$DB_BACKUP_PASS"
    
    # Drop existing connections
    sudo -u postgres psql -c "
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = '$DB_NAME' 
        AND pid <> pg_backend_pid();" 2>> "$restore_log"
    
    # Drop and recreate database
    sudo -u postgres dropdb "$DB_NAME" 2>> "$restore_log" || true
    if ! sudo -u postgres createdb "$DB_NAME" 2>> "$restore_log"; then
        log_message "Error: Failed to create database. Check $restore_log for details"
        unset PGPASSWORD
        return 1
    fi
    
    # Restore from backup
    local restore_success=false
    if [[ "$backup_file" == *.gz ]]; then
        if gunzip -c "$backup_file" | sudo -u postgres psql -q "$DB_NAME" 2>> "$restore_log"; then
            restore_success=true
        fi
    else
        if sudo -u postgres psql -q "$DB_NAME" < "$backup_file" 2>> "$restore_log"; then
            restore_success=true
        fi
    fi
    
    unset PGPASSWORD
    
    if [ "$restore_success" = true ]; then
        log_message "Database restore completed successfully"
        rm -f "$restore_log"
        return 0
    else
        log_message "Error: Database restore failed. Check $restore_log for details"
        return 1
    fi
}

main() {
    if [ -z "$1" ]; then
        echo "Usage: $0 <backup_filename>"
        echo "Example: $0 billboard_db_manual_20241105_042226.sql.gz"
        exit 1
    fi
    restore_backup "$1"
}

main "$@"