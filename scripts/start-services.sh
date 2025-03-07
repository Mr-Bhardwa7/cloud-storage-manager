#!/bin/bash

# Define services and their dependencies
declare -A services_with_deps=(
    ["auth"]="nginx auth-db"
    ["cloudlink"]="nginx cloudlink-db"
    ["filenest"]="nginx filenest-db"
    ["nginx"]=""
    ["auth-db"]=""
    ["cloudlink-db"]=""
    ["filenest-db"]=""
    ["adminer"]=""          # Adminer for PostgreSQL
    ["mongo-express"]=""    # Mongo Express for MongoDB
)

# Extract service names
services=("auth" "cloudlink" "filenest" "nginx" "auth-db" "cloudlink-db" "filenest-db" "adminer" "mongo-express")

# Flags
remove_flag=false

# Function to start a service with dependencies
start_service() {
    local service_name=$1
    local deps=${services_with_deps[$service_name]}
    
    if [ -n "$deps" ]; then
        echo "🔄 Starting dependencies for $service_name: $deps..."
        docker-compose up --pull never -d $deps  # No pull if exists
    fi

    if $remove_flag; then
        echo "🚀 Removing old container for $service_name (if exists)..."
        docker-compose rm -f $service_name
    fi
    
    echo "🚀 Starting $service_name service..."
    docker-compose up --pull never -d $service_name  # No pull if exists
}

# Function to start all services
start_all() {
    echo "🚀 Starting nginx, databases, and admin tools..."
    docker-compose up --pull never -d nginx auth-db cloudlink-db filenest-db adminer mongo-express  # No pull if exists
    
    if $remove_flag; then
        echo "🚀 Removing old containers for auth, cloudlink, and filenest only..."
        docker-compose rm -f auth cloudlink filenest
    fi
    
    echo "🚀 Starting auth, cloudlink, and filenest services..."
    docker-compose up --pull never -d auth cloudlink filenest  # No pull if exists
}

# Function to show usage instructions
show_usage() {
    echo "🚀 Usage:"
    echo "  ./start_services.sh                   # Start all services without pulling images if they exist"
    echo "  ./start_services.sh [service]         # Start only a specific service without pulling images if they exist"
    echo "  ./start_services.sh --remove          # Remove old containers for auth, cloudlink, and filenest before starting"
    echo "  ./start_services.sh --help            # Show this help message"
    echo ""
    echo "  Available services: ${services[*]}"
}

# Main script logic
if [[ "$1" == "--help" ]]; then
    show_usage
    exit 0
fi

# Check for --remove flag
if [[ "$1" == "--remove" ]]; then
    remove_flag=true
    shift  # Remove the --remove flag from arguments
fi

if [ "$1" ]; then
    if [[ " ${services[@]} " =~ " $1 " ]]; then
        start_service $1
    else
        echo "❌ Service '$1' not found. Available services: ${services[*]}"
        show_usage
    fi
else
    start_all
fi
