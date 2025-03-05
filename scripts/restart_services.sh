#!/bin/bash

# Define services and their dependencies
declare -A services_with_deps=(
    ["auth"]="nginx gateway"
    ["oauth"]="nginx gateway"
    ["files"]="nginx gateway"
    ["gateway"]="nginx"
    ["nginx"]=""
)

# Extract service names
services=("auth" "oauth" "files" "gateway" "nginx")

# Function to restart a service with dependencies
restart_service() {
    local service_name=$1
    local deps=${services_with_deps[$service_name]}
    
    if [ -n "$deps" ]; then
        echo "🔄 Restarting dependencies for $service_name: $deps..."
        docker-compose restart $deps
    fi
    
    echo "🔄 Restarting $service_name service..."
    docker-compose restart $service_name
}

# Function to restart all services
restart_all() {
    echo "🔄 Restarting all services..."
    docker-compose restart
}

# Function to show usage instructions
show_usage() {
    echo "🔄 Usage:"
    echo "  ./restart_services.sh                # Restart all services"
    echo "  ./restart_services.sh auth           # Restart only auth service with dependencies"
    echo "  ./restart_services.sh oauth          # Restart only oauth service with dependencies"
    echo "  ./restart_services.sh files          # Restart only files service with dependencies"
    echo "  ./restart_services.sh gateway        # Restart only gateway service with dependencies"
    echo "  ./restart_services.sh nginx          # Restart only nginx service"
}

# Main script logic
if [ "$1" ]; then
    if [[ " ${services[@]} " =~ " $1 " ]]; then
        restart_service $1
    else
        echo "❌ Service '$1' not found. Available services: ${services[*]}"
        show_usage
    fi
else
    restart_all
fi
