# Cloud Storage Management System

A microservices-based cloud storage management system built with **Next.js 15**, containerized using Docker and managed with Nginx as a reverse proxy. This system allows users to authenticate, connect cloud storage accounts, and manage files in one place.

## Features

- **Authentication:** User login/signup and session management with NextAuth.js.
- **OAuth Integration:** Connect to Google Drive, Dropbox, etc.
- **File Management:** Explore, upload, and manage files with duplicate detection.
- **Nginx:** Reverse proxy, SSL termination (future), caching.
- **Event-Driven Architecture:** Plan to use Apache Kafka for internal communication (future).
- **Docker:** Containerized microservices with `docker-compose`.

## Project Structure

```
cloud-storage-management/
├── docker/                     # Docker configurations
├── services/                   # Microservices
│   ├── auth/                   # Authentication
│   ├── cloud_link/             # Cloud storage linking
│   ├── file_nest/              # File management
├── nginx/                      # Nginx configuration
├── scripts/                    # Shell scripts
│   ├── install-dependencies.sh # Install dependencies
│   ├── start-services.sh       # Start services
│   ├── restart-services.sh     # Restart services
│   ├── clean-services.sh       # Clean services
├── docker-compose.yml          # Docker Compose file
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
   chmod +x scripts/install-dependencies.sh
   ./scripts/install-dependencies.sh
   ```

## Environment Variables

Configure the `.env` files inside each microservice (`auth`, `cloud_link`, `file_nest`).

## Running the Project

- To start all services:

  ```bash
  chmod +x scripts/start-services.sh
  ./scripts/start-services.sh
  ```

- To start a specific service:

  ```bash
  ./scripts/start-services.sh <service-name>
  ```

- To restart services:

  ```bash
  ./scripts/restart-services.sh
  ```

- To clean and reinstall dependencies:
  ```bash
  ./scripts/clean-services.sh
  ```

## Accessing the Application

- **Auth Service:** [http://auth.localhost](http://auth.localhost)
- **CloudLink Service:** [http://cloudlink.localhost](http://cloudlink.localhost)
- **FileNest Service:** [http://filenest.localhost](http://filenest.localhost)

> **Note:** SSL support and Kafka integration are planned for future updates.

## Future Plan

- **SSL Integration:** Implement SSL certificates for secure communication.
- **Apache Kafka:** Use for internal event-driven communication between microservices.
- **Monitoring:** Integrate Prometheus and Grafana for monitoring and alerting.
- **Scaling:** Setup Kubernetes or Docker Swarm for scaling microservices.

## Contributing

1. Fork the repo.
2. Create a branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License.

---

### 📄 **Markdown Snippet**

```markdown
# Cloud Storage Management System

A microservices-based cloud storage management system built with **Next.js 13+** and **Node.js Express**, containerized using Docker and managed with Nginx as a reverse proxy. This system allows users to authenticate, connect cloud storage accounts, and manage files in one place.

## Features

- **Authentication:** User login/signup and session management with NextAuth.js.
- **OAuth Integration:** Connect to Google Drive, Dropbox, etc.
- **File Management:** Explore, upload, and manage files with duplicate detection.
- **Nginx:** Reverse proxy, SSL termination (future), caching.
- **Event-Driven Architecture:** Plan to use Apache Kafka for internal communication (future).
- **Docker:** Containerized microservices with `docker-compose`.

## Project Structure
```

cloud-storage-management/
├── docker/ # Docker configurations
│ ├── nginx/ # Nginx configuration
├── services/ # Microservices
│ ├── auth/ # Authentication
│ ├── cloud_link/ # Cloud storage linking
│ ├── file_nest/ # File management
├── scripts/ # Shell scripts
│ ├── install-dependencies.sh # Install dependencies
│ ├── start-services.sh # Start services
│ ├── restart-services.sh # Restart services
│ ├── stop-services.sh # Stop services
│ ├── clear-services.sh # Clear containers, images, volumes
│ ├── remove-services.sh # Remove containers and images
│ ├── update-dependencies.sh # Update dependencies
| ├── README.md # Detailed scripts guide
├── docker-compose.yml # Docker Compose file
├── .gitignore # Git ignore file
├── README.md # Project documentation

```

## 📜 Shell Scripts Guide

For detailed information about the shell scripts, check out the [Shell Scripts Guide](scripts/README.md).

## Accessing the Application

- **Auth Service:** [http://localhost/auth](http://localhost/auth)
- **CloudLink Service:** [http://localhost/accounts](http://localhost/accounts)
- **FileNest Service:** [http://localhost/files](http://localhost/files)

# 🚀 Adminer (for PostgreSQL)
- **URL:** [http://localhost:8081](http://localhost:8081)
- **System:** PostgreSQL (Select this from the dropdown in Adminer)
- **Server:** Use the service name (container name), like `auth-db` or `cloudlink-db`

### 🔑 Credentials
#### For `auth-db`:
- **Username:** `auth_user`
- **Password:** `auth_pass`
- **Database:** `auth_db`

#### For `cloudlink-db`:
- **Username:** `cloud_user`
- **Password:** `cloud_pass`
- **Database:** `cloudlink_db`

---

# 🚀 Mongo Express (for MongoDB)
- **URL:** [http://localhost:8082](http://localhost:8082)
- **HTTP Basic Auth:**
  - **Username:** `admin`
  - **Password:** `admin`

### 🔑 MongoDB Login (inside Mongo Express)
- **Username:** `filenest_user`
- **Password:** `filenest_pass`
- **Database Host:** `filenest-db`


## Future Plan

- **SSL Integration:** Implement SSL certificates for secure communication.
- **Apache Kafka:** Use for internal event-driven communication between microservices.
- **Monitoring:** Integrate Prometheus and Grafana for monitoring and alerting.
- **Scaling:** Setup Kubernetes or Docker Swarm for scaling microservices.

## License

This project is licensed under the MIT License.
```
