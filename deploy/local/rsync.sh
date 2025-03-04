deploy_project_files() {
    START_TIME=$(date +%s)
    [ -z "$1" ] && { echo "Error: LOCAL_ROOT is not set"; return 1; }
    [ -z "$VPS_ALIAS" ] && { echo "Error: VPS_ALIAS is not set"; exit 1; }
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT is not set"; exit 1; }

    local LOCAL_ROOT="$1"

    rsync -avz --delete \
           --exclude '**/node_modules' \
           --exclude '**/node_modules/**' \
           --exclude '**/package-lock.json' \
           --exclude '.git' \
           --exclude '.git*' \
           --exclude '**/dist' \
           --exclude '**/build' \
           --exclude 'deploy' \
           --exclude 'deploy/**' \
           "$LOCAL_ROOT/" \
           "$VPS_ALIAS:$REMOTE_ROOT/"

    END_TIME=$(date +%s)
    echo "✓ Project files deployed successfully in $((END_TIME - START_TIME)) seconds"

}

deploy_deploy_files() {
    START_TIME=$(date +%s)
    [ -z "$1" ] && { echo "Error: LOCAL_ROOT is not set"; return 1; }
    [ -z "$VPS_ALIAS" ] && { echo "Error: VPS_ALIAS is not set"; exit 1; }
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT is not set"; exit 1; }

    local LOCAL_ROOT="$1"
    local source_deploy="$LOCAL_ROOT/deploy"
    local target_deploy="$VPS_ALIAS:$REMOTE_ROOT/deploy"

    echo "=== Deploying Deploy Directory ==="
    rsync -az --delete \
           --exclude '**/node_modules' \
           --exclude '**/node_modules/**' \
           --exclude '**/package-lock.json' \
           "$source_deploy/" \
           "$target_deploy/"
    END_TIME=$(date +%s)
    echo "✓ Deploy files deployed successfully in $((END_TIME - START_TIME)) seconds"
}

deploy_backup_scripts() {
    START_TIME=$(date +%s)
    [ -z "$1" ] && { echo "Error: LOCAL_ROOT is not set"; return 1; }

    local LOCAL_ROOT="$1"
    local source_scripts="$LOCAL_ROOT/deploy/scripts/db/backup/"
    local source_config="$LOCAL_ROOT/deploy/config/backup-credentials.conf"
    local target_dir="$VPS_ALIAS:/opt/system-scripts/backup/$APP_NAME"

    echo "=== Deploying Database Backup Scripts ==="
    rsync -avz --delete "$source_scripts" "$target_dir" || { echo "Failed to deploy backup scripts"; return 1; }
    rsync -avz --delete "$source_config" "$target_dir" || { echo "Failed to deploy backup credentials"; return 1; }
    END_TIME=$(date +%s)
    echo "✓ Backup scripts deployed successfully in $((END_TIME - START_TIME)) seconds"
}
