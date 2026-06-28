# B2B Negotiation Platform

A B2B (Business-to-Business) platform designed to facilitate negotiations, company registrations, offering management, and counteroffers between different companies. 

The application is built using a modern decoupled architecture with a Java/Spring Boot backend and a React/TypeScript/Vite frontend, orchestrated with Docker.

![Architecture Diagram](diagrams/architecture.png)

---

## 🚀 Quick Start

The easiest way to run the entire stack is using **Docker Compose** via the provided `Makefile`.

### Prerequisites
Make sure you have the following installed on your system:
- [Docker](https://docs.docker.com/) (including Docker Compose)
- [Make](https://www.gnu.org/software/make/) (optional, but recommended for convenience)

### Running the Application

1. **Set up Environment Variables**:
   Ensure a `.env` file exists in the root directory (it is already pre-configured for development):
   ```env
   JWT_SECRET=ZmlmdGVlbmluY3JlYXNlZGF1Z2h0ZXJjb2FsZ3JlYXRzdHJlbmd0aHNob2VidXR0ZXI
   DB_PASSWORD=password
   JWT_EXPIRATION=86400000
   ```

2. **Start the Services**:
   Run the following command to start all services (Database, Backend, and Frontend) in detached mode:
   ```bash
   make up
   # Or directly: docker compose up -d
   ```

3. **Verify the Services**:
   You can check the status of the running containers:
   ```bash
   make ps
   # Or directly: docker compose ps
   ```

4. **Access the Applications**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **Database**: PostgreSQL running on `localhost:5432`

5. **Stop the Services**:
   To stop and remove the containers:
   ```bash
   make down
   # Or directly: docker compose down
   ```

---

## 🛠️ Development & Useful Commands

The `Makefile` includes several commands to help manage the lifecycle of the application:

| Command | Action |
|---------|--------|
| `make up` | Starts all services in the background. |
| `make down` | Stops all running services. |
| `make build` | Builds the Docker images. |
| `make rebuild` | Rebuilds the images and restarts the services. |
| `make logs` | Follows the logs of all running containers. |
| `make ps` | Lists all running containers and their ports. |
| `make backend` | Rebuilds and starts only the backend service. |
| `make frontend` | Rebuilds and starts only the frontend service. |
| `make db` | Starts only the PostgreSQL database. |
| `make test-e2e` | Runs the Cypress end-to-end test suite (details below). |

---

## 🧪 Running Tests

### End-to-End (E2E) Tests
End-to-end tests are written in Cypress and located in the `frontend` directory. You can run them against the Docker environment using:

```bash
make test-e2e
```

**What this command does:**
1. Starts all services in Docker.
2. Waits for the frontend (`https://localhost:3000`) and the backend health check (`http://localhost:8080/api/v1/health`) to be fully ready.
3. Installs dependencies in the `frontend` directory.
4. Runs the Cypress test suite headlessly (`npm run cypress:run`).
5. Tears down the Docker containers.

---

## 📁 Project Structure

```text
├── backend/               # Kotlin + Spring Boot API
│   ├── src/               # Application source code
│   ├── build.gradle.kts   # Gradle dependencies and configuration
│   └── Dockerfile         # Dockerfile for the backend container
├── frontend/              # React + Vite + TypeScript SPA
│   ├── src/               # React components and application logic
│   ├── cypress/           # Cypress E2E tests
│   └── Dockerfile         # Dockerfile for the frontend container
├── docker-compose.yml     # Multi-container Docker configuration
├── Makefile               # Shortcuts for docker-compose and testing
├── BDD.md                 # Behavior-Driven Development scenarios
├── DoD.md                 # Definition of Done
└── README.md              # Project documentation (this file)
```

---

## 💡 Features & Business Logic

For a detailed breakdown of the features and user scenarios, please refer to [BDD.md](BDD.md). Key features include:

1. **Company Registration**: Allowing company representatives to register using their NIP, name, and address, customize their profile, and upload a company icon.
2. **Sending Negotiations**: Initiating new negotiation offers with target companies by specifying titles, descriptions, prices, and deadlines.
3. **Handling Negotiations**: Accepting or declining incoming offers with real-time updates and persistence.
4. **Counteroffers**: Submitting counteroffers with modified prices, quantities, or deadlines on active negotiations.