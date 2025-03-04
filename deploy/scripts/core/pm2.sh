#!/bin/bash

source "$DEPLOY_DIR/scripts/utils/utils.sh"

manage_pm2_process() {
    echo
    echo "=== Configuring PM2 ==="
    [ -z "$1" ] && { echo "Error: reload_env parameter is required"; return 1; }
    [ -z "$PM2_SERVICE_NAME" ] || [ -z "$REMOTE_ROOT" ] && { echo "Error: PM2_SERVICE_NAME is required"; exit 1; }

    local reload_env="$1"


    if ! pm2 describe "$PM2_SERVICE_NAME" > /dev/null; then
        # Only start if app doesn't exist
        pm2 start "$REMOTE_ROOT/server/src/index.js" --name "$PM2_SERVICE_NAME"
        echo 'Server started for the first time.'
    fi

    if [ "$reload_env" = true ]; then
        set_pm2_env_vars 
    fi

    echo
    echo "=== Restarting PM2 Service ==="
    pm2 restart "$PM2_SERVICE_NAME"  # Restart to ensure envs are applied
    echo "✓ Service restarted"
    pm2 save 
}



set_pm2_env_vars() {
    START_TIME=$(date +%s)
    # Check if parameters are provided
    [ -z "$PM2_SERVICE_NAME" ] || [ -z "$SERVER_ENV_PATH" ] && { echo "Error: PM2_SERVICE_NAME and SERVER_ENV_PATH path are required"; return 1; }
    [ ! -f "$SERVER_ENV_PATH" ] && { echo "Error: .env file not found at $SERVER_ENV_PATH"; return 1; }

    echo "Setting environment variables from $SERVER_ENV_PATH"

    # Read all variables first
    declare -A env_vars
    while IFS='=' read -r key value; do
        # Skip empty lines and comments
        if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
            # Remove any quotes and trailing whitespace from the value
            value=$(echo "$value" | tr -d '"' | tr -d "'" | xargs)
            env_vars["$key"]="$value"
        fi
    done < "$SERVER_ENV_PATH"

    # Set all variables at once
    for key in "${!env_vars[@]}"; do
        echo "Setting $key"
        pm2 set "$PM2_SERVICE_NAME:$key" "${env_vars[$key]}" >/dev/null 2>&1
    done

    END_TIME=$(date +%s)
    echo "✓ Environment variables updated in $((END_TIME - START_TIME)) seconds"
}
