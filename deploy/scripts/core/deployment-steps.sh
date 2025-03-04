#!/bin/bash

if [ -z "$DEPLOY_DIR" ]; then
    echo "Error: DEPLOY_DIR is not set"
    exit 1
fi

source "$DEPLOY_DIR/setup/init-backup.sh"
source "$DEPLOY_DIR/scripts/core/backup.sh"
source "$DEPLOY_DIR/scripts/core/env.sh"
source "$DEPLOY_DIR/scripts/core/dependencies.sh"
source "$DEPLOY_DIR/scripts/core/build.sh"
source "$DEPLOY_DIR/scripts/core/health-check.sh"
source "$DEPLOY_DIR/scripts/core/pm2.sh"
source "$DEPLOY_DIR/scripts/db/migrate.sh"



initialize_database_backup_system() {
    if [ ! -d "$BACKUP_DIR" ]; then
        setup_database_backup_system 
    fi
}

perform_pre_deployment_steps() {
    setup_env_files
}

perform_deployment_steps() {
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
        echo "Error: Missing required parameters in perform_deployment_steps"
        echo "Usage: perform_deployment_steps <install_deps> <run_migrations> <reload_env> <build_client>"
        return 1
    fi
    
    local install_deps="$1"
    local run_migrations="$2"
    local reload_env="$3"
    local build_client="$4"

    if [ "$install_deps" = true ]; then
        install_dependencies
    fi
    
    if [ "$run_migrations" = true ]; then
        echo "Running database migrations..."
        if ! perform_db_migration; then
            return 1
        fi
    fi

    if [ "$build_client" = true ]; then
        build_client
    fi

    manage_pm2_process "$reload_env"
    
    return 0
}

perform_post_deployment_steps() {
    # Validate input parameter
    [ -z "$1" ] && { echo "Error: keep_env parameter is required"; return 1; }
    
    local keep_env="$1"
    
    # Validate keep_env is boolean
    if [ "$keep_env" != "true" ] && [ "$keep_env" != "false" ]; then
        echo "Error: keep_env must be true or false"
        return 1
    fi
    
    if ! check_health; then
        return 1
    fi
    
    if [ "$keep_env" = false ]; then
        rm -f "$REMOTE_ROOT/server/.env" "$REMOTE_ROOT/client/.env"
    fi
    
    if [ "$keep_env" = false ]; then
        rm -rf "$REMOTE_ROOT/deploy" 
    fi

    
    
    return 0
} 