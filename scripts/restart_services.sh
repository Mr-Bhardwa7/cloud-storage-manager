#!/bin/bash

# Define services and their dependencies
declare -A services_with_deps=(
    ["auth"]="nginx"
    ["cloudlink"]="nginx"
    ["filenest"]="nginx"
    ["nginx"]=""
    ["auth-db"]=""
    ["cloudlink-db"]=""
    ["filenest-db"]=""
    ["adminer"]=""          # Added Adminer for PostgreSQL
    ["mongo-express"]=""    # Added Mongo Express for MongoDB
)

# Extract service names
services=("auth" "cloudlink" "filenest" "nginx" "auth-db" "cloudlink-db" "filenest-db" "adminer" "mongo-express")

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
    echo "  ./restart_services.sh                   # Restart all services"
    echo "  ./restart_services.sh [service]         # Restart a specific service"
    echo "  ./restart_services.sh --help            # Show this help message"
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
                restart_service $1
            else
                echo "❌ Service '$1' not found. Available services: ${services[*]}"
                show_usage
            fi
            ;;
    esac
else
    restart_all
fi
