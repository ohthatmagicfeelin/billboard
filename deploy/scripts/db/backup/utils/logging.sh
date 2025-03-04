#!/bin/bash

log_message() {
    local message="$1"
    local log_file="$BACKUP_DIR/logs/backup_$(date +%Y%m%d).log"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $message" | tee -a "$log_file"
} 