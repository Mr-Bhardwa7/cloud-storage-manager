#!/bin/bash

# Define the microservices
services=("auth" "cloud_link" "file_nest")
show_help=false
selected_services=()

# Parse flags and arguments
for arg in "$@"; do
    case $arg in
        --help)
            show_help=true
            shift
            ;;
        auth|cloud_link|file_nest)
            selected_services+=("$arg")
            shift
            ;;
        *)
            echo "❌ Unknown option or service: $arg"
            exit 1
            ;;
    esac
done

# Show help message if --help flag is passed
if [ "$show_help" = true ]; then
    echo "📦 Usage: ./install_dependencies.sh [service...]"
    echo ""
    echo "Options:"
    echo "  --help          Show this help message"
    echo ""
    echo "Services:"
    echo "  auth, cloud_link, file_nest"
    echo ""
    echo "Examples:"
    echo "  ./install_dependencies.sh           # Install dependencies for all services"
    echo "  ./install_dependencies.sh auth      # Install dependencies for auth only"
    echo "  ./install_dependencies.sh auth cloud_link # Install for auth and cloud_link"
    exit 0
fi

# Use all services if none are specified
if [ ${#selected_services[@]} -eq 0 ]; then
    selected_services=("${services[@]}")
fi

echo "🚀 Starting to install dependencies..."

# Loop through each selected service
for service in "${selected_services[@]}"; do
    service_path="services/$service"

    # Check if service directory exists
    if [ -d "$service_path" ]; then
        echo "📦 Installing dependencies for $service..."
        cd "$service_path" || exit

        # Check if package.json exists
        if [ -f "package.json" ]; then
            if npm install; then
                echo "✅ Dependencies installed for $service."
            else
                echo "❌ Failed to install dependencies for $service!"
            fi
        else
            echo "❌ package.json not found for $service, skipping!"
        fi

        cd - > /dev/null || exit
    else
        echo "❌ Directory $service_path not found, skipping $service!"
    fi
done

echo "🎉 All dependencies installed successfully!"
