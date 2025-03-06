#!/bin/bash

# Define services and their dependencies
declare -A services_with_deps=(
    ["auth"]="nginx gateway"
    ["cloudLink"]="nginx gateway"
    ["fileNest"]="nginx gateway"
    ["gateway"]="nginx"
    ["nginx"]=""
)

# Extract service names
services=("auth" "cloudLink" "fileNest" "gateway" "nginx")

# Function to start a service with dependencies
start_service() {
    local service_name=$1
    local deps=${services_with_deps[$service_name]}
    
    if [ -n "$deps" ]; then
        echo "🔄 Starting dependencies for $service_name: $deps..."
        docker-compose up -d --build $deps
    fi
    
    echo "🚀 Starting $service_name service..."
    docker-compose up --build $service_name
}

# Function to start all services
start_all() {
    echo "🚀 Removing all services old containers..."
    docker-compose down
    echo "🚀 Starting all services..."
    docker-compose up --build
}

# Function to show usage instructions
show_usage() {
    echo "🚀 Usage:"
    echo "  ./start_services.sh                # Start all services"
    echo "  ./start_services.sh auth           # Start only auth service with dependencies"
    echo "  ./start_services.sh cloudLink          # Start only cloudLink service with dependencies"
    echo "  ./start_services.sh fileNest          # Start only fileNest service with dependencies"
    echo "  ./start_services.sh gateway        # Start only gateway service with dependencies"
    echo "  ./start_services.sh nginx          # Start only nginx service"
}

# Main script logic
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
