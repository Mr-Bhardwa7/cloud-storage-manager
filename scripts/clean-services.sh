#!/bin/bash

# Define services
services=("auth" "cloudlink" "filenest" "nginx" "auth-db" "cloudlink-db" "filenest-db" "adminer" "mongo-express")

show_help() {
    echo "🗑️ Usage:"
    echo "  ./clear_services.sh                # Remove all containers, images, volumes, and networks"
    echo "  ./clear_services.sh <service>      # Remove specific service (containers, images, volumes)"
    echo "  ./clear_services.sh --help         # Show usage instructions"
    echo ""
    echo "📦 Available services: ${services[*]}"
}

# Check for --help flag
if [ "$1" == "--help" ]; then
    show_help
    exit 0
fi

clear_all() {
    echo "🚨 WARNING: This will remove all containers, images, volumes, and networks created by Docker Compose!"
    read -p "Are you sure you want to proceed? (y/N): " confirm

    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo "🛑 Stopping all running containers..."
        docker-compose down

        echo "🗑️ Removing all containers..."
        docker rm -f $(docker ps -aq) 2>/dev/null

        echo "🗑️ Removing all images..."
        docker rmi -f $(docker images -q) 2>/dev/null

        echo "🗑️ Removing all volumes..."
        docker volume rm $(docker volume ls -q) 2>/dev/null

        echo "🗑️ Removing all networks..."
        docker network rm $(docker network ls -q) 2>/dev/null

        echo "✅ All resources cleared successfully!"
    else
        echo "❌ Cleanup canceled!"
    fi
}

clear_individual() {
    local service_name=$1

    echo "🚨 WARNING: This will remove containers, images, and volumes for the $service_name service!"
    read -p "Are you sure you want to proceed? (y/N): " confirm

    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo "🛑 Stopping $service_name container..."
        docker-compose stop $service_name

        echo "🗑️ Removing $service_name container..."
        docker-compose rm -f $service_name

        echo "🗑️ Removing $service_name image..."
        docker rmi -f $(docker images | grep $service_name | awk '{print $3}') 2>/dev/null

        echo "🗑️ Removing $service_name volumes..."
        docker volume rm $(docker volume ls | grep $service_name | awk '{print $2}') 2>/dev/null

        echo "✅ $service_name cleared successfully!"
    else
        echo "❌ Cleanup for $service_name canceled!"
    fi
}

# Main script logic
if [ -z "$1" ]; then
    clear_all
elif [[ " ${services[*]} " =~ " $1 " ]]; then
    clear_individual $1
else
    echo "❌ Invalid option or service name!"
    show_help
fi
