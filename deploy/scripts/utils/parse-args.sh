#!/bin/bash

parse_arguments() {
    # Default values for flags
    INSTALL_DEPS=false
    KEEP_ENV=false
    RUN_MIGRATIONS=false
    RELOAD_ENV=false
    BUILD_CLIENT=false
    while getopts "ikmbeh" opt; do  # Added 'h' for help
        case $opt in
            i)
                INSTALL_DEPS=true
                ;;
            k)
                KEEP_ENV=true
                ;;
            m)
                RUN_MIGRATIONS=true
                ;;
            e)
                RELOAD_ENV=true
                ;;
            b)
                BUILD_CLIENT=true
                ;;
            h)  # Help option
                echo "Usage: $0 [-i] [-k] [-m] [-e] [-b] [-h] [--help]" >&2
                echo "  -i    Install dependencies" >&2
                echo "  -k    Keep .env files" >&2
                echo "  -m    Run database migrations" >&2
                echo "  -e    Reload .env files" >&2
                echo "  -b    Build client" >&2
                echo "  -h    Display this help message" >&2
                echo "  --help Display this help message" >&2
                echo ""
                exit 0
                ;;
            \?)
                echo "Invalid option: -$OPTARG" >&2
                echo "Use -h or --help for usage information." >&2  # Added failure message
                exit 1
                ;;
        esac
    done

    # Export the variables so they're available in the parent script
    export INSTALL_DEPS
    export KEEP_ENV
    export RUN_MIGRATIONS
    export RELOAD_ENV
    export BUILD_CLIENT
} 
