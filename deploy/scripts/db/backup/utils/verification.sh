#!/bin/bash

verify_backup() {
    local backup_file="$1"
    
    # Validate backup file exists
    [ ! -f "$backup_file" ] && { log_message "Error: Backup file does not exist: $backup_file"; return 1; }
    
    local temp_db="verify_${DB_NAME}_${RANDOM}"
    
    log_message "Verifying backup: $backup_file"
    
    export PGPASSWORD="$DB_BACKUP_PASS"
    
    # Create temporary database
    if ! createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db"; then
        log_message "Error: Failed to create temporary database for verification"
        unset PGPASSWORD
        return 1
    fi
    
    # Restore backup to temporary database
    if gunzip -c "$backup_file" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db" > /dev/null 2>&1; then
        log_message "Backup verification successful"
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db"
        unset PGPASSWORD
        return 0
    else
        log_message "Error: Backup verification failed!"
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db"
        unset PGPASSWORD
        return 1
    fi
} 