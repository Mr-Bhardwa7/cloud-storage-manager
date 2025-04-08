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

# List of all services
services=("auth" "cloudlink" "filenest" "nginx" "auth-db" "cloudlink-db" "filenest-db" "adminer" "mongo-express")

# List of required Docker images
declare -A required_images=(
    ["nginx"]="nginx:latest"
    ["auth-db"]="postgres:15-alpine"
    ["cloudlink-db"]="postgres:15-alpine"
    ["filenest-db"]="mongo:6"
    ["adminer"]="adminer:latest"
    ["mongo-express"]="mongo-express:latest"
)

# Flags
remove_flag=false
clean_flag=false

# Function to check and pull missing images
check_and_pull_images() {
    echo "🔍 Checking required Docker images..."
    for service in "${!required_images[@]}"; do
        image=${required_images[$service]}
        if [[ "$(docker images -q $image 2>/dev/null)" == "" ]]; then
            echo "📥 Pulling missing image: $image..."
            docker pull $image
        else
            echo "✅ Image $image already exists. Skipping pull."
        fi
    done
}

# Function to start a service with dependencies
start_service() {
    local service_name=$1
    local deps=${services_with_deps[$service_name]}

    check_and_pull_images  # Ensure required images are available

    if [ -n "$deps" ]; then
        echo "🔄 Starting dependencies for $service_name: $deps..."
        docker-compose up -d --pull never $deps
    fi

    if $remove_flag; then
        echo "🗑️ Removing old container for $service_name (if exists)..."
        docker-compose rm -f $service_name
    fi

    echo "🚀 Starting $service_name service..."
    docker-compose up -d --pull never $service_name --build
}

# Function to start all services
start_all() {
    echo "🚀 Checking for missing images..."
    check_and_pull_images

    echo "🚀 Starting all services..."
    docker-compose up -d --pull never --build

    if $remove_flag; then
        echo "🗑️ Removing old containers for auth, cloudlink, and filenest only..."
        docker-compose rm -f auth cloudlink filenest

        echo "🚀 Restarting auth, cloudlink, and filenest services..."
        docker-compose up -d --pull never auth cloudlink filenest --build
    fi
}

# Function to clean Docker system
clean_docker() {
    echo "🧹 Cleaning Docker system... (This may take a few seconds)"
    docker compose down -v
    docker system prune -af --volumes
    docker builder prune --all --force
}

# Function to show usage
show_usage() {
    echo "🚀 Usage:"
    echo "  ./start_services.sh                   # Start all services"
    echo "  ./start_services.sh [service]         # Start only a specific service"
    echo "  ./start_services.sh --remove          # Remove old containers before starting"
    echo "  ./start_services.sh --clean           # Clean up all Docker cache/data before starting fresh"
    echo "  ./start_services.sh --help            # Show this help message"
    echo ""
    echo "  Available services: ${services[*]}"
}

# Main script logic
if [[ "$1" == "--help" ]]; then
    show_usage
    exit 0
fi

# Flags
if [[ "$1" == "--remove" ]]; then
    remove_flag=true
    shift
fi

if [[ "$1" == "--clean" ]]; then
    clean_flag=true
    shift
    clean_docker
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
