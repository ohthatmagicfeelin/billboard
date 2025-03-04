#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "script dir: $SCRIPT_DIR"

# Source all required files
source "$SCRIPT_DIR/backup-credentials.conf"
source "$SCRIPT_DIR/utils/logging.sh"
source "$SCRIPT_DIR/utils/validation.sh"
source "$SCRIPT_DIR/utils/verification.sh"
source "$SCRIPT_DIR/core/backup-core.sh"
source "$SCRIPT_DIR/core/cleanup-core.sh"

main() {
    case "$1" in
        "daily"|"weekly"|"monthly"|"debug"|"manual")
            perform_backup "$1"
            ;;
        *)
            echo "Usage: $0 {daily|weekly|monthly|debug|manual}"
            exit 1
            ;;
    esac
}

main "$@" 