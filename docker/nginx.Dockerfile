# nginx.Dockerfile 

# Use the official Nginx image
FROM nginx:latest

# Set the working directory
WORKDIR /etc/nginx

# Copy the Nginx configuration and entrypoint script
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
