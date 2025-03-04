#!/bin/bash

create_backup() {
    local remote_root="$1"
    local backup_root="$2"

    
    if [ -z "$remote_root" ]; then
        echo "Error: VPS_PATH is required"
        return 1
    fi

    if [ -z "$backup_root" ]; then
        echo "Error: BACKUP_ROOT is required"
        return 1
    fi

    local app_name=$(basename "$remote_root")
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local temp_backup="${backup_root}/.${app_name}.backup.${timestamp}.tmp"
    local final_backup="${backup_root}/${app_name}.backup"
    
    echo "Creating Backup: $app_name"
    
    # Change to parent directory safely
    if ! cd "$parent_dir"; then
        echo "Error: Could not change to directory: $parent_dir"
        return 1
    fi
    
    # create backup directory
    if ! mkdir -p "$backup_root"; then
        echo "Error: Failed to create backup directory"
        return 1
    fi
    
    # Verify source directory exists
    if [ ! -d "$app_name" ]; then
        echo "Error: Source directory does not exist: $app_name"
        return 1
    fi

    
    # Create backup in temporary location first
    if ! cp -r "$app_name" "$temp_backup"; then
        echo "Error: Failed to create temporary backup"
        rm -rf "$temp_backup"  # Clean up if failed
        return 1
    fi
    
    # Verify the backup was successful
    if ! diff -r "$app_name" "$temp_backup" > /dev/null; then
        echo "Error: Backup verification failed"
        rm -rf "$temp_backup"  # Clean up failed backup
        return 1
    fi
    
    # Remove old backup if it exists
    if [ -d "$final_backup" ]; then
        if ! rm -rf "$final_backup"; then
            echo "Error: Could not remove old backup"
            rm -rf "$temp_backup"  # Clean up temp backup
            return 1
        fi
    fi
    
    # Move temporary backup to final location (atomic operation)
    if ! mv "$temp_backup" "$final_backup"; then
        echo "Error: Could not move backup to final location"
        rm -rf "$temp_backup"  # Clean up temp backup
        return 1
    fi
    
    echo "Backup created successfully at: $final_backup"
    return 0
}

# Run only if executed directly
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: $0 <remote_root> <backup_root>"
        exit 1
    fi
    
    create_backup "$1" "$2"
fi
