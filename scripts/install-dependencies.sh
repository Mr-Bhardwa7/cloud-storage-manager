#!/bin/bash

services=("auth" "cloud_link" "file_nest")

for service in "${services[@]}"
do
    echo "Installing dependencies for $service..."
    cd services/$service || exit
    npm install
    cd - || exit
    echo "Done with $service."
done

echo "All dependencies installed successfully!"
