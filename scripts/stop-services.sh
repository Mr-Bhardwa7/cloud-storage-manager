#!/bin/bash

# Define available services
services=("auth" "cloudlink" "filenest" "nginx" "auth-db" "cloudlink-db" "filenest-db" "adminer" "mongo-express")

# Function to stop a specific service
stop_service() {
    local service_name=$1
    echo "🛑 Stopping $service_name service..."
    docker-compose stop $service_name
}

# Function to stop all services
stop_all() {
    echo "🛑 Stopping all services..."
    docker-compose stop
}

# Function to show usage instructions
show_usage() {
    echo "🛑 Usage:"
    echo "  ./stop_services.sh                   # Stop all services"
    echo "  ./stop_services.sh [service]         # Stop only a specific service"
    echo "  ./stop_services.sh --help            # Show this help message"
    echo ""
    echo "  Available services: ${services[*]}"
}

# Main script logic
if [[ "$1" == "--help" ]]; then
    show_usage
    exit 0
fi

if [ "$1" ]; then
    if [[ " ${services[@]} " =~ " $1 " ]]; then
        stop_service $1
    else
        echo "❌ Service '$1' not found. Available services: ${services[*]}"
        show_usage
    fi
else
    stop_all
fi
