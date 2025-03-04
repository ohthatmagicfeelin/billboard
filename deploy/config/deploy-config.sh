#!/bin/bash

# Configuration
APP_NAME="billboard"
PORT=5013
VPS_ALIAS="vps"


PM2_SERVICE_NAME="$APP_NAME"
REMOTE_ROOT="/var/www/$APP_NAME"
BACKUP_ROOT="/var/backups/$APP_NAME"
SERVER_ENV_PATH="$REMOTE_ROOT/server/.env"
DEPLOY_DIR="$REMOTE_ROOT/deploy"

# Health check configuration
HEALTH_CHECK_URL="http://localhost:$PORT/api/health"
MAX_RETRIES=5
RETRY_INTERVAL=5