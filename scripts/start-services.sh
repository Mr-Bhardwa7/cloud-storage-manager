#!/bin/bash

services=("auth" "oauth" "files" "gateway" "nginx")

if [ "$1" ]; then
    if [[ " ${services[@]} " =~ " $1 " ]]; then
        echo "Starting $1 service..."
        docker-compose up --build $1
    else
        echo "Service '$1' not found. Available services: ${services[*]}"
    fi
else
    echo "Starting all services..."
    docker-compose up --build
fi
