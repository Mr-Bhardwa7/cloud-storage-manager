# 📜 Shell Scripts Guide

This section explains the purpose and usage of each shell script in the `scripts/` directory. These scripts help manage dependencies, services, and containers efficiently.

---

## 📂 Scripts Overview

```
scripts/
├── install-dependencies.sh  # Install npm dependencies for all or individual services
├── update-dependencies.sh   # Update npm dependencies for all or individual services
├── start-services.sh        # Start all or individual services without rebuilding images
├── stop-services.sh         # Stop all or individual services
├── restart-services.sh      # Restart all or individual services with dependencies
├── clear-services.sh        # Remove containers, images, and volumes
├── remove-services.sh       # Remove only containers and images
```

---

## 🔄 Common Options

- `--help` : Displays usage information for each script.
- `[service-name]` : Specify a service name to target an individual service (e.g., `auth`, `cloudlink`, `filenest`).
- **If no service name is provided**, the script will apply to all services by default.

---

## 🛠️ **1. install-dependencies.sh**

**Description:** Installs npm dependencies for all or specified services.

**Usage:**

```bash
./scripts/install-dependencies.sh          # Install for all services
./scripts/install-dependencies.sh auth     # Install only for auth service
./scripts/install-dependencies.sh --help   # Show help
```

---

## 🔄 **2. update-dependencies.sh**

**Description:** Updates npm dependencies by removing `node_modules` and reinstalling.

**Usage:**

```bash
./scripts/update-dependencies.sh          # Update all services
./scripts/update-dependencies.sh auth     # Update only auth service
./scripts/update-dependencies.sh --help   # Show help
```

---

## 🚀 **3. start-services.sh**

**Description:** Starts Docker containers for all or specific services without rebuilding images if they already exist.

**Usage:**

```bash
./scripts/start-services.sh               # Start all services
./scripts/start-services.sh auth          # Start only auth service
./scripts/start-services.sh --help        # Show help
```

---

## 🛑 **4. stop-services.sh**

**Description:** Stops running containers for all or specified services.

**Usage:**

```bash
./scripts/stop-services.sh                # Stop all services
./scripts/stop-services.sh auth           # Stop only auth service
./scripts/stop-services.sh --help         # Show help
```

---

## 🔄 **5. restart-services.sh**

**Description:** Restarts Docker containers for all or specified services, including their dependencies.

**Usage:**

```bash
./scripts/restart-services.sh             # Restart all services
./scripts/restart-services.sh auth        # Restart only auth service
./scripts/restart-services.sh --help      # Show help
```

---

## 🧹 **6. clear-services.sh**

**Description:** Removes all containers, images, networks, and volumes.

**Usage:**

```bash
./scripts/clear-services.sh               # Clear everything
./scripts/clear-services.sh auth          # Clear only auth service resources
./scripts/clear-services.sh --help        # Show help
```

---

## 🗑️ **7. remove-services.sh**

**Description:** Removes only containers and images, leaving volumes and networks intact.

**Usage:**

```bash
./scripts/remove-services.sh             # Remove all containers and images
./scripts/remove-services.sh auth        # Remove only auth service containers and images
./scripts/remove-services.sh --help      # Show help
```

---

## 🛠️ **Service Names Reference**

| Service Name    | Description                   |
| --------------- | ----------------------------- |
| `auth`          | Authentication service        |
| `cloudlink`     | Cloud storage linking service |
| `filenest`      | File management service       |
| `nginx`         | NGINX reverse proxy           |
| `auth-db`       | PostgreSQL for Auth service   |
| `cloudlink-db`  | PostgreSQL for CloudLink      |
| `filenest-db`   | MongoDB for FileNest          |
| `adminer`       | Adminer for PostgreSQL        |
| `mongo-express` | Mongo Express for MongoDB     |

---

## 🛠️ **Tips**

- **Make scripts executable:** Run `chmod +x scripts/*.sh` if you get a "Permission denied" error.
- **Environment Variables:** Ensure `.env` files are correctly set for each microservice.

---
