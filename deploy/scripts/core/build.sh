#!/bin/bash

build_client() {
    START_TIME=$(date +%s)
    echo
    echo "=== Building Client ==="
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT is not set"; exit 1; }
    
    cd "$REMOTE_ROOT/client" || exit
    npm run build
    END_TIME=$(date +%s)
    echo "✓ Client build completed successfully in $((END_TIME - START_TIME)) seconds"
} 
