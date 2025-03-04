#!/bin/bash

cleanup_old_backups() {
    local type="$1"
    local retention="$2"
    
    # Validate retention is a positive number
    [[ ! "$retention" =~ ^[0-9]+$ ]] && { log_message "Error: Retention period must be a positive number"; return 1; }
    
    # Validate backup directory exists
    [ ! -d "$BACKUP_DIR" ] && { log_message "Error: Backup directory $BACKUP_DIR does not exist"; return 1; }
    
    # Validate backup type directory exists
    [ ! -d "$BACKUP_DIR/$type" ] && { log_message "Error: Backup type directory $BACKUP_DIR/$type does not exist"; return 1; }
    
    find "$BACKUP_DIR/$type" -name "${DB_NAME}_${type}_*.sql.gz" -mtime +"$retention" -delete
    log_message "Cleaned up $type backups older than $retention days"
} 