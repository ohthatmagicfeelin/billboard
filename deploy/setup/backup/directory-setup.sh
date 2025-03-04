#!/bin/bash

setup_backup_directories() {
    local user="$1"
    
    echo "Creating backup directories..."
    if ! mkdir -p "$BACKUP_DIR"/{daily,weekly,monthly,logs,debug,manual}; then
        echo "Error: Failed to create backup directories"
        return 1
    fi
    
    echo "Setting directory permissions..."
    if ! chown -R "$user:$user" "$BACKUP_DIR"; then
        echo "Error: Failed to set directory ownership"
        return 1
    fi
    if ! chmod -R 750 "$BACKUP_DIR"; then
        echo "Error: Failed to set directory permissions"
        return 1
    fi

    echo "Setting backup scripts permissions..."
    sudo chown -R "$user:$user" "$DB_BACKUP_SCRIPTS"
    sudo chmod -R 750 "$DB_BACKUP_SCRIPTS"
    sudo chmod +x "$DB_BACKUP_SCRIPTS"/*.sh

    return 0
} 