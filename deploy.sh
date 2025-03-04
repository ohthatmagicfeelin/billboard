#!/bin/bash
START_TIME=$(date +%s)

# Get the root directory of the project
LOCAL_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Source required files
source "$LOCAL_ROOT/deploy/config/deploy-config.sh"
source "$LOCAL_ROOT/deploy/scripts/utils/parse-args.sh"
source "$LOCAL_ROOT/deploy/scripts/utils/utils.sh"
source "$LOCAL_ROOT/deploy/local/backup.sh"
source "$LOCAL_ROOT/deploy/local/rsync.sh"

# Parse command line arguments
parse_arguments "$@"

# create a backup of the current app on the vps
echo "=== Starting Remote Backup ==="
echo "Backup Directory: $BACKUP_ROOT"
create_backup "$LOCAL_ROOT"

# Deploy the project with exclusions
message "Deploying project files..."
deploy_project_files "$LOCAL_ROOT"

# Deploy the deploy directory
message "Deploying deploy directory..."
deploy_deploy_files "$LOCAL_ROOT"

# Deploy the database backup scripts
message "Deploying database backup scripts..."
deploy_backup_scripts "$LOCAL_ROOT"

# Create and execute the remote deployment script
message "Starting remote deployment..."
ssh "$VPS_ALIAS" \
    "cd $REMOTE_ROOT && \
    ./deploy/remote-deploy.sh $INSTALL_DEPS $KEEP_ENV $RUN_MIGRATIONS $RELOAD_ENV $BUILD_CLIENT"

echo "✓ Deployment completed successfully!"
echo "Deployment completed at $(date)"
echo "Deployment took $(($(date +%s) - $START_TIME)) seconds"
