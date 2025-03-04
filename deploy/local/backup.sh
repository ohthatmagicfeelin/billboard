#!/bin/bash

create_backup() {
    START_TIME=$(date +%s)
    local local_root="$1"

    # First ensure the remote backup script directory exists
    ssh "$VPS_ALIAS" "mkdir -p $(dirname "$REMOTE_ROOT")/deploy/scripts/core"
    
    # Copy only the backup script, not the entire directory structure
    rsync -az \
        "$local_root/deploy/scripts/core/backup.sh" \
        "$VPS_ALIAS:$(dirname "$REMOTE_ROOT")/deploy/scripts/core/"

    # Execute the backup on remote
    echo "Executing backup on remote server..."
    if ! ssh "$VPS_ALIAS" "cd $(dirname "$REMOTE_ROOT") && bash deploy/scripts/core/backup.sh '$REMOTE_ROOT' '$BACKUP_ROOT'"; then
        echo "Remote backup failed"
        return 1
    fi
    
    END_TIME=$(date +%s)
    echo "Backup completed in $((END_TIME - START_TIME)) seconds"
    return 0
}

# Run only if executed directly
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
    if [ -z "$1" ]; then
        echo "Usage: $0 <local_root>"
        exit 1  
    fi
    create_backup "$1" 
fi
