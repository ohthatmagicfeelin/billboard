#!/bin/bash


perform_db_migration() {
    START_TIME=$(date +%s)
    # Validate environment variables
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT is not set"; return 1; }
    [ -z "$SERVER_ENV_PATH" ] && { echo "Error: SERVER_ENV_PATH is not set"; return 1; }
    [ ! -f "$SERVER_ENV_PATH" ] && { echo "Error: Environment file not found at $SERVER_ENV_PATH"; return 1; }
    [ ! -d "$REMOTE_ROOT/server" ] && { echo "Error: Server directory not found at $REMOTE_ROOT/server"; return 1; }
    [ ! -f "$REMOTE_ROOT/server/prisma/schema.prisma" ] && { echo "Error: Prisma schema not found at $REMOTE_ROOT/server/prisma/schema.prisma"; return 1; }
    
    echo "Starting database migration..."
    echo "Env file: $SERVER_ENV_PATH"
    
    # Change to server directory
    cd "$REMOTE_ROOT/server" || exit
    echo "Current directory: $(pwd)"
    
    # Load environment variables
    source "$SERVER_ENV_PATH"
    export DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}"
    echo "DATABASE_URL constructed: $DATABASE_URL"
    
    # Generate Prisma Client
    echo "Generating Prisma Client..."
    npx prisma generate
    
    # Run migrations
    echo "Running database migrations..."
    npx prisma migrate deploy --schema=./prisma/schema.prisma
    
    # Check migration status
    echo "Checking migration status..."
    npx prisma migrate status
    
    if [ $? -eq 0 ]; then
        echo "Migration completed successfully"
        END_TIME=$(date +%s)
        echo "✓ Database migration completed successfully in $((END_TIME - START_TIME)) seconds"
        return 0
    else
        echo "Migration failed"
        return 1
    fi
} 