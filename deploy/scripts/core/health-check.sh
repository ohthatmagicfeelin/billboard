#!/bin/bash

check_health() {
    echo
    echo "=== Health Check ==="
    
    if [ -z "$HEALTH_CHECK_URL" ] || [ -z "$MAX_RETRIES" ] || [ -z "$RETRY_INTERVAL" ]; then
        echo "Error: HEALTH_CHECK_URL, MAX_RETRIES, and RETRY_INTERVAL are required"
        return 1
    fi
    
    echo "  • URL: $HEALTH_CHECK_URL"
    echo "  • Max Retries: $MAX_RETRIES" 
    echo "  • Retry Interval: $RETRY_INTERVAL seconds"

    local retry_count=0

    while [ $retry_count -lt "$MAX_RETRIES" ]; do
        sleep 1
        echo "=== Health Check: Attempt $((retry_count + 1))/$MAX_RETRIES ==="
        echo "Health check attempt $((retry_count + 1)) of $MAX_RETRIES..."
        
        response_code=$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_CHECK_URL")
        
        if [ "$response_code" = "200" ]; then
            echo "✓ Health check passed!"
            return 0
        fi
        
        echo "✗ Health check failed (Status: $response_code). Retrying in ${RETRY_INTERVAL}s..."
        sleep "$RETRY_INTERVAL"
        retry_count=$((retry_count + 1))
    done
    
    echo "✗ Health check failed after $MAX_RETRIES attempts. Deployment unsuccessful."
    return 1
}