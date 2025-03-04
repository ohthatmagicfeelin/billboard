#!/bin/bash

setup_cron_jobs() {
    local script_path="$1"


    # Create temporary file for crontab
    local temp_cron
    temp_cron=$(mktemp) || {
        echo "Error: Failed to create temporary crontab file"
        return 1
    }
    
    # Backup existing crontab
    crontab -l > "$temp_cron" 2>/dev/null || echo "" > "$temp_cron"
    
    # Define schedules
    local daily_schedule="0 1 * * *"
    local weekly_schedule="0 2 * * 0"
    local monthly_schedule="0 3 1 * *"

    # Create standard cron jobs
    local daily_job=$(create_cron_job "$daily_schedule" "daily" "$script_path")
    local weekly_job=$(create_cron_job "$weekly_schedule" "weekly" "$script_path")
    local monthly_job=$(create_cron_job "$monthly_schedule" "monthly" "$script_path")
    
    # Handle debug cron job
    handle_debug_cron "$temp_cron" "$script_path"

    # Add standard cron jobs if they don't exist
    if ! grep -Fq "$script_path daily" "$temp_cron"; then
        echo "$daily_job" >> "$temp_cron"
        echo "✓ Added daily backup cron job"
    fi
    
    if ! grep -Fq "$script_path weekly" "$temp_cron"; then
        echo "$weekly_job" >> "$temp_cron"
        echo "✓ Added weekly backup cron job"
    fi
    
    if ! grep -Fq "$script_path monthly" "$temp_cron"; then
        echo "$monthly_job" >> "$temp_cron"
        echo "✓ Added monthly backup cron job"
    fi


    # Install new crontab
    if ! crontab "$temp_cron"; then
        echo "Error: Failed to install new crontab"
        rm -f "$temp_cron"
        return 1
    fi
    
    # Clean up
    rm -f "$temp_cron"
    
    # Print summary
    echo "Cron jobs installed:"
    [ "$DEBUG_BACKUP" != "false" ] && echo "  • Debug backup: $debug_job"
    echo "  • Daily backup: $daily_job"
    echo "  • Weekly backup: $weekly_job"
    echo "  • Monthly backup: $monthly_job"
    
    return 0
} 