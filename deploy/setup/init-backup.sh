#!/bin/bash

# Define paths
DB_BACKUP_SCRIPTS="${BACKUP_SCRIPTS_DIR}/${APP_NAME}"

# Source required files
source "$REMOTE_ROOT/deploy/setup/backup/utils.sh"
source "$REMOTE_ROOT/deploy/setup/backup/directory-setup.sh"
source "$REMOTE_ROOT/deploy/setup/backup/cron-setup.sh"
source "$REMOTE_ROOT/deploy/setup/backup/debug-cron.sh"
setup_database_backup_system() {
    START_TIME=$(date +%s)
    # Validate environment first
    ! validate_environment && { echo "Environment validation failed. Aborting setup."; return 1; }

    local user=$(whoami)
    local script_path="${DB_BACKUP_SCRIPTS}/backup.sh"
    
    echo "=== Starting Backup System Setup ==="
    
    # Setup directories
    ! setup_backup_directories "$user" && { echo "Directory setup failed"; return 1; }
    
    # Setup cron jobs
    ! setup_cron_jobs "$script_path" && { echo "Cron setup failed"; return 1; }
    
    END_TIME=$(date +%s)
    echo "✓ Backup system setup completed successfully in $((END_TIME - START_TIME)) seconds"
    return 0
}

# Run only if executed directly
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
    if ! setup_database_backup_system; then
        exit 1
    fi
fi
