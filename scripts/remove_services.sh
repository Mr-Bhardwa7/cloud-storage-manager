#!/bin/bash

# Define microservices
services=("auth-service" "cloudLink-service" "fileNest-service" "nginx-proxy" "auth-db" "cloudlink-db" "filenest-db" "adminer" "mongo-express")

show_help() {
    echo "🗑️ Usage:"
    echo "  ./remove_services.sh [service-name]   # Remove specific service container"
    echo "  ./remove_services.sh --all            # Remove all service containers"
    echo "  ./remove_services.sh --help           # Show usage instructions"
}

remove_service() {
    local service_name=$1
    echo "🗑️ Removing container for $service_name..."
    docker rm -f $service_name 2>/dev/null && echo "✅ Removed $service_name" || echo "❌ Failed to remove $service_name or not found"
}

# Main logic
if [ "$1" ]; then
    case "$1" in
        --all)
            echo "🗑️ Removing all service containers..."
            for service in "${services[@]}"; do
                remove_service $service
            done
            ;;
        --help)
            show_help
            ;;
        *)
            if [[ " ${services[@]} " =~ " $1 " ]]; then
                remove_service $1
            else
                echo "❌ Service '$1' not recognized."
                show_help
            fi
            ;;
    esac
else
    show_help
fi
