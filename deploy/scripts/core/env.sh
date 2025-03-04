#!/bin/bash

setup_env_files() {
    if [ ! -f "$REMOTE_ROOT/server/.env.prod" ]; then echo "Error: .env.prod file not found in $REMOTE_ROOT/server"; exit 1; fi
    if [ ! -f "$REMOTE_ROOT/client/.env.prod" ]; then echo "Error: .env.prod file not found in $REMOTE_ROOT/client"; exit 1; fi
    
    mv "$REMOTE_ROOT/server/.env.prod" "$REMOTE_ROOT/server/.env"
    mv "$REMOTE_ROOT/client/.env.prod" "$REMOTE_ROOT/client/.env"
}

cleanup_env_files() {
    rm "$REMOTE_ROOT/server/.env"
    rm "$REMOTE_ROOT/client/.env"
    echo '.env files deleted.'
} 