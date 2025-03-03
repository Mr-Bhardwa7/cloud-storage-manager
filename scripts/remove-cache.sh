#!/bin/bash

# Remove Docker cache
echo "Cleaning Docker cache..."
docker system prune -f
docker volume prune -f

# Stop running containers
echo "Stopping running services..."
docker-compose down

# Remove node_modules and reinstall dependencies for each service
services=("auth" "oauth" "files" "gateway")
for service in "${services[@]}"; do
    echo "Cleaning and reinstalling dependencies for $service..."
    rm -rf services/$service/node_modules
    docker-compose run --rm $service npm install
done

echo "Cleanup and reinstallation complete!"
