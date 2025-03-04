#!/bin/bash

perform_backup() {
    if ! validate_inputs; then
        log_message "Error: Input validation failed"
        return 1
    fi

    local type="$1"
    local backup_path="$BACKUP_DIR/$type"

    log_message "-------- Type: $type --------"
    
    mkdir -p "$backup_path"
    if [ ! -d "$backup_path" ] || [ ! -w "$backup_path" ]; then
        log_message "Error: Cannot create or write to backup path: $backup_path"
        return 1
    fi

    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_path/${DB_NAME}_${type}_${timestamp}.sql"
    
    log_message "Attempting backup to: $backup_file"
    log_message "Starting $type backup of database: $DB_NAME"
    
    if ! create_backup "$backup_file"; then
        return 1
    fi
    
    if ! compress_and_verify_backup "$backup_file"; then
        return 1
    fi
    
    # Get the retention value from the variable name
    local retention="${type^^}_RETENTION"
    cleanup_old_backups "$type" "${!retention}"
    log_message "------------------------------"
}

create_backup() {
    local backup_file="$1"
    export PGPASSWORD="$DB_BACKUP_PASS"
    
    if ! pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$DB_NAME" > "$backup_file" 2> /tmp/pg_dump_error.log; then
        log_message "Error: Backup failed! Error output:"
        cat /tmp/pg_dump_error.log
        unset PGPASSWORD
        return 1
    fi
    
    unset PGPASSWORD
    return 0
}

compress_and_verify_backup() {
    local backup_file="$1"
    
    gzip "$backup_file"
    backup_file="${backup_file}.gz"
    
    if ! verify_backup "$backup_file"; then
        log_message "Error: Backup verification failed, removing invalid backup"
        rm "$backup_file"
        return 1
    fi
    
    log_message "Backup completed and verified successfully: "
    log_message "$backup_file"
    return 0
} 