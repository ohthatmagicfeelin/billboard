#!/bin/bash

perform_rollback() {
    
    echo 'Performing rollback...'
    BACKUP_PATH="${BACKUP_ROOT}/${APP_NAME}.backup"

    if [ -d "$BACKUP_PATH" ]; then
        rm -rf "$REMOTE_ROOT"/*
        cp -r "${BACKUP_PATH}"/* "$REMOTE_ROOT"/
        
        pm2 restart "$PM2_SERVICE_NAME"
        
        echo 'Rollback completed'
        return 0
    else
        echo 'No backup found for rollback'
        return 1
    fi
}