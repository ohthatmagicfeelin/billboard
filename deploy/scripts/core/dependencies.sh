#!/bin/bash

install_dependencies() {
    START_TIME=$(date +%s)
    if [ -z "$REMOTE_ROOT" ]; then
        echo "Error: REMOTE_ROOT is not set"
        exit 1
    fi

    cd "$REMOTE_ROOT" || exit
    npm run install-all
    END_TIME=$(date +%s)
    echo "✓ Dependencies installed successfully in $((END_TIME - START_TIME)) seconds"
} 
