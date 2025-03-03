# Cloud Storage Management System

A microservices-based cloud storage management system built with **Next.js 13+** and **Node.js Express**, containerized using Docker and managed with Nginx as a reverse proxy. This system allows users to authenticate, connect cloud storage accounts, and manage files in one place.

## Features

- **Authentication:** User login/signup and session management with NextAuth.js.
- **OAuth Integration:** Connect to Google Drive, Dropbox, etc.
- **File Management:** Explore, upload, and manage files with duplicate detection.
- **API Gateway:** Handles routing, CORS, and load balancing.
- **Nginx:** Reverse proxy, SSL termination, caching.
- **Docker:** Containerized microservices with `docker-compose`.

## Project Structure

```
cloud-storage-management/
├── docker/                     # Docker configurations
├── services/                   # Microservices
│   ├── auth/                   # Authentication
│   ├── oauth/                  # OAuth for cloud accounts
│   ├── files/                  # File management
│   ├── gateway/                # API Gateway
├── nginx/                      # Nginx configuration
├── docker-compose.yml          # Docker Compose file
├── install-dependencies.sh     # Install dependencies
├── start-services.sh           # Start services
├── .gitignore                  # Git ignore file
├── README.md                   # Project documentation
```

## Prerequisites

- Node.js and npm
- Docker and Docker Compose

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cloud-storage-management.git
   cd cloud-storage-management
   ```
2. Install dependencies:
   ```bash
   chmod +x install-dependencies.sh
   ./install-dependencies.sh
   ```

## Environment Variables

Configure the `.env` files inside each microservice (`auth`, `oauth`, `files`, `gateway`).

## Running the Project

- To start all services:
  ```bash
  chmod +x start-services.sh
  ./start-services.sh
  ```
- To start a specific service:
  ```bash
  ./start-services.sh <service-name>
  ```

## Accessing the Application

- **Auth Service:** http://localhost:3001
- **OAuth Service:** http://localhost:3002
- **Files Service:** http://localhost:3003
- **API Gateway:** http://localhost:8080

## Contributing

1. Fork the repo.
2. Create a branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License.
