#!/bin/bash

validate_inputs() {
    # Check required env vars
    [ -z "$DB_HOST" ] && { log_message "Error: DB_HOST not set"; return 1; }
    [ -z "$DB_PORT" ] && { log_message "Error: DB_PORT not set"; return 1; }
    [ -z "$DB_NAME" ] && { log_message "Error: DB_NAME not set"; return 1; }
    [ -z "$DB_BACKUP_USER" ] && { log_message "Error: DB_BACKUP_USER not set"; return 1; }
    [ -z "$DB_BACKUP_PASS" ] && { log_message "Error: DB_BACKUP_PASS not set"; return 1; }
    [ -z "$BACKUP_DIR" ] && { log_message "Error: BACKUP_DIR not set"; return 1; }
    
    validate_directories
    validate_retention_periods
    return 0
}

validate_directories() {
    # Check backup directory
    [ ! -d "$BACKUP_DIR" ] && { log_message "Error: Backup directory $BACKUP_DIR does not exist"; return 1; }
    [ ! -w "$BACKUP_DIR" ] && { log_message "Error: Backup directory $BACKUP_DIR is not writable"; return 1; }
    return 0
}

validate_retention_periods() {
    # Check retention periods
    [ -z "$DAILY_RETENTION" ] && { log_message "Error: DAILY_RETENTION not set"; return 1; }
    [ -z "$WEEKLY_RETENTION" ] && { log_message "Error: WEEKLY_RETENTION not set"; return 1; }
    [ -z "$MONTHLY_RETENTION" ] && { log_message "Error: MONTHLY_RETENTION not set"; return 1; }
    [ -z "$DEBUG_RETENTION" ] && { log_message "Error: DEBUG_RETENTION not set"; return 1; }

    [[ ! "$DAILY_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: DAILY_RETENTION must be a number"; return 1; }
    [[ ! "$WEEKLY_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: WEEKLY_RETENTION must be a number"; return 1; }
    [[ ! "$MONTHLY_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: MONTHLY_RETENTION must be a number"; return 1; }
    [[ ! "$DEBUG_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: DEBUG_RETENTION must be a number"; return 1; }
    return 0
} 