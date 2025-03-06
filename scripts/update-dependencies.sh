#!/bin/bash

services=("auth" "cloud_link" "file_nest" "gateway")

echo "Updating dependencies for all services..."
for service in "${services[@]}"; do
    echo "Updating $service..."
    cd services/$service
    rm -rf node_modules package-lock.json
    npm install
    cd ../..
done

echo "Dependencies updated successfully!"
