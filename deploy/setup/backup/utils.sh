#!/bin/bash

validate_environment() {
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT not set"; return 1; }
    [ -z "$BACKUP_DIR" ] && { echo "Error: BACKUP_DIR not set"; return 1; }
    [ -z "$DB_BACKUP_SCRIPTS" ] && { echo "Error: DB_BACKUP_SCRIPTS not set"; return 1; }

    local script_path="${REMOTE_ROOT}/deploy/scripts/db/backup/backup.sh"
    [ ! -f "$script_path" ] && { echo "Error: Backup script not found at: $script_path"; return 1; }

    local utils_path="${REMOTE_ROOT}/deploy/scripts/db/backup/utils/logging.sh"
    [ ! -f "$utils_path" ] && { echo "Error: Utils script not found at: $utils_path"; return 1; }
    source "$utils_path"

    return 0
}

create_cron_job() {
    local schedule="$1"
    local backup_type="$2"
    local script_path="$3"
    local log_file="${BACKUP_DIR}/logs/cron_${backup_type}.log"
    
    echo "${schedule} if [ -f ${script_path} ]; then cd ${REMOTE_ROOT} && ${script_path} ${backup_type}; else echo \"Backup script not found at ${script_path}\"; fi >> ${log_file} 2>&1"
} 