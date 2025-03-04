#!/bin/bash

handle_debug_cron() {
    local temp_cron="$1"
    local script_path="$2"

    # validate DEBUG_BACKUP is set
    [ -z "$DEBUG_BACKUP" ] && { echo "Error: DEBUG_BACKUP is not set"; return 1; }
    

    # Handle debug job based on DEBUG_BACKUP environment variable
    if [ "$DEBUG_BACKUP" != "false" ]; then
        local debug_schedule="*/1 * * * *"  # Every 1 minute
        local debug_job=$(create_cron_job "$debug_schedule" "debug" "$script_path")
        
        # Add debug job if it doesn't exist
        if ! grep -Fq "$script_path debug" "$temp_cron"; then
            echo "$debug_job" >> "$temp_cron"
            echo "✓ Added debug backup cron job"
        fi
    else
        if grep -Fq "$script_path debug" "$temp_cron"; then
            # Remove debug job if it exists
            sed -i "/backup.sh debug/d" "$temp_cron"
            echo "✓ Removed debug backup cron job (DEBUG_BACKUP not set)"
        fi
    fi

    return 0
} 