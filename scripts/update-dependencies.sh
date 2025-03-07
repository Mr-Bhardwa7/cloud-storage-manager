#!/bin/bash

# Define microservices
services=("auth" "cloud_link" "file_nest")

# Function to update dependencies for a specific service
update_service() {
    local service_name=$1
    local service_path="services/$service_name"

    if [ -d "$service_path" ]; then
        echo "📦 Updating dependencies for $service_name..."
        cd "$service_path" || exit
        rm -rf node_modules package-lock.json
        npm install
        echo "✅ Done with $service_name."
        cd - > /dev/null || exit
    else
        echo "❌ Directory $service_path not found, skipping $service_name!"
    fi
}

# Function to update all services
update_all() {
    echo "🚀 Updating dependencies for all services..."
    for service in "${services[@]}"; do
        update_service "$service"
    done
    echo "🎉 All dependencies updated successfully!"
}

# Function to show usage instructions
show_usage() {
    echo "🔄 Usage:"
    echo "  ./update_dependencies.sh               # Update all services"
    echo "  ./update_dependencies.sh [service]     # Update a specific service"
    echo "  ./update_dependencies.sh --help        # Show this help message"
    echo ""
    echo "Available services: ${services[*]}"
}

# Main script logic
if [ "$1" ]; then
    case $1 in
        --help)
            show_usage
            ;;
        *)
            if [[ " ${services[@]} " =~ " $1 " ]]; then
                update_service $1
            else
                echo "❌ Service '$1' not found. Available services: ${services[*]}"
                show_usage
            fi
            ;;
    esac
else
    update_all
fi
