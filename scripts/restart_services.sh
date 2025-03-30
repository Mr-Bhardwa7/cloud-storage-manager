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

# Function to rebuild and restart a service with dependencies
rebuild_service() {
    local service_name=$1
    local deps=${services_with_deps[$service_name]}
    
    if [ -n "$deps" ]; then
        echo "🛑 Stopping and removing dependencies for $service_name: $deps..."
        docker-compose rm -sf $deps
    fi
    
    echo "🛑 Stopping and removing $service_name service..."
    docker-compose rm -sf $service_name

    echo "🚮 Removing old images for $service_name..."
    docker rmi $(docker images "your_project_name_${service_name}" -q) 2>/dev/null

    echo "🔄 Rebuilding $service_name service..."
    docker-compose build $service_name

    if [ -n "$deps" ]; then
        echo "🚀 Starting dependencies for $service_name: $deps..."
        docker-compose up $deps --build
    fi

    echo "🚀 Starting $service_name service..."
    docker-compose up -d $service_name
}

# Function to rebuild and restart all services
rebuild_all() {
    echo "🛑 Stopping and removing all services..."
    docker-compose down

    echo "🚮 Removing all old images..."
    docker rmi $(docker images "your_project_name_" -q) 2>/dev/null

    echo "🔄 Rebuilding all services..."
    docker-compose build

    echo "🚀 Starting all services..."
    docker-compose up --build
}

# Function to show usage instructions
show_usage() {
    echo "🔄 Usage:"
    echo "  ./restart_services.sh                   # Rebuild and restart all services"
    echo "  ./restart_services.sh [service]         # Rebuild and restart a specific service"
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
                rebuild_service $1
            else
                echo "❌ Service '$1' not found. Available services: ${services[*]}"
                show_usage
            fi
            ;;
    esac
else
    rebuild_all
fi
