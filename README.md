# Dashboard Application - Monorepo

This is a full-stack dashboard application with a Spring Boot REST API backend and React frontend.

## Project Structure

```
react-dashboard-project/
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite frontend
├── README.md         # This file
└── .gitignore
```

## Prerequisites

- **Java 17** (JDK). Verify with `java -version`.
- **Node.js 18+** and **npm**. Verify with `node -v` and `npm -v`.
- **Gradle** is **not** required to be installed globally — the project ships with the Gradle Wrapper (`gradlew` / `gradlew.bat`).
- Internet access to download Gradle and dependencies on first build (see [Gradle repository configuration](#gradle-repository-configuration)).

### Ports used

| Service | URL | Port |
|---------|-----|------|
| Frontend (Vite dev server) | http://localhost:3000 | 3000 |
| Backend REST API | http://localhost:8080 | 8080 |
| WebSocket | ws://localhost:8080/ws | 8080 |

The Vite dev server proxies `/api` and `/ws` to the backend, so during development you only need to open **http://localhost:3000**.

## Quick Start

Run the backend and frontend in **two separate terminals**. Start the backend first.

### 1. Backend

**macOS / Linux:**
```bash
cd backend
./gradlew bootRun
```

**Windows (PowerShell):**
```powershell
cd backend
# If Java is not on PATH, point JAVA_HOME at your JDK 17 install for this session:
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat bootRun
```

The API server starts on `http://localhost:8080`. On startup it seeds an in-memory H2 database (demo customers and orders).

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

### 2. Frontend

**macOS / Linux:**
```bash
cd frontend
npm install   # first time only
npm run dev
```

**Windows (PowerShell):**
```powershell
cd frontend
npm install   # first time only
npm run dev
```

> **Windows note:** If PowerShell blocks `npm` with a *"running scripts is disabled on this system"* error (execution policy), either run npm through cmd:
> ```powershell
> cmd /c "npm run dev"
> ```
> or allow local scripts for your user once:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

The frontend opens automatically at `http://localhost:3000`.

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard overview with stats and charts

### Orders
- `GET /api/orders?page=0&size=10` - Get paginated orders
- `GET /api/orders/{id}` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get single customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Search
- `GET /api/search?q=query` - Search orders and customers

### WebSocket
- `WS /ws` - WebSocket endpoint for real-time notifications
  - Topic: `/topic/orders` - Order updates

## Authentication

The application uses HTTP Basic Authentication.

- Credentials are stored locally in the browser
- Each API request includes a Basic Authorization header
- WebSocket connections also use Basic Auth

## Development

### Backend Development
- Java 17
- Spring Boot 3.2.5
- Gradle build system
- H2 in-memory database

### Frontend Development
- React 18
- Vite build tool
- React Router for navigation
- Zustand for state management
- Axios for HTTP client
- Bootstrap 5 for styling
- Recharts for charts
- React-Toastify for notifications

## Building for Production

### Backend

**macOS / Linux:**
```bash
cd backend
./gradlew build
```

**Windows (PowerShell):**
```powershell
cd backend
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\gradlew.bat build
```

This compiles the code, runs the tests, and produces a runnable (fat) JAR in `backend/build/libs/`:

```
backend/build/libs/dashboard-0.0.1-SNAPSHOT.jar
```

Run the packaged JAR directly (no Gradle needed):
```bash
java -jar backend/build/libs/dashboard-0.0.1-SNAPSHOT.jar
```

Run with the hardened `prod` profile (hides raw exception messages from clients):
```bash
java -jar backend/build/libs/dashboard-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

Useful Gradle tasks:
- `./gradlew clean` — remove previous build output
- `./gradlew test` — run tests only
- `./gradlew bootJar` — build the JAR without running tests/checks

### Frontend
```bash
cd frontend
npm run build     # outputs to frontend/dist/
npm run preview   # serve the production build locally to verify
```

Build output will be in `frontend/dist/`. Lint the source with `npm run lint`.

## Gradle Repository Configuration

The Gradle Wrapper downloads Gradle itself from the URL in
`backend/gradle/wrapper/gradle-wrapper.properties`, and dependencies are resolved
from the repositories listed in `backend/build.gradle`.

Both are configured to prefer the public **Gradle distribution service** and
**Maven Central** so the project builds on any machine with internet access. A
corporate Artifactory mirror is also listed as a fallback — if you build behind a
corporate proxy/VPN that requires it, keep that entry; otherwise the public
repositories are used automatically.

If your environment can only reach an internal mirror, update:
- `distributionUrl` in `backend/gradle/wrapper/gradle-wrapper.properties`
- the `repositories { ... }` blocks in `backend/build.gradle`

## Features

- 📊 Dashboard with stats and charts
- 📋 Order management (CRUD)
- 👥 Customer management (CRUD)
- 🔍 Global search
- 🌙 Dark/Light theme toggle
- 🔐 Authentication
- ⚡ Real-time WebSocket notifications
- 📱 Responsive design
- 📝 Form validation

## Technologies

### Backend
- Spring Boot 3.2.5
- Spring Security
- Spring Data JPA
- Spring WebSocket
- Lombok
- H2 Database
- Gradle

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- Zustand
- React-Toastify
- Recharts
- Bootstrap 5
- SockJS & Stomp.js

## Notes

- The database is H2 in-memory, so data persists only during runtime
- For production use, migrate to PostgreSQL or MySQL
- Consider implementing JWT tokens instead of Basic Auth
- Add proper HTTPS/SSL configuration for production

## Troubleshooting

### CORS Errors
Make sure the backend is running on `http://localhost:8080` and the frontend proxy is configured correctly in `frontend/vite.config.js`

### WebSocket Connection Issues
Ensure credentials are set in localStorage before connecting to WebSocket

### API not responding
Check that the backend is running: `cd backend && ./gradlew bootRun` (Windows: `.\gradlew.bat bootRun`).

### `java` is not recognized / wrong Java version
Ensure a JDK 17 is installed and on `PATH`, or set `JAVA_HOME` for the session as shown in [Quick Start](#quick-start). Verify with `java -version`.

### Gradle fails to download (UnknownHostException)
The wrapper or a dependency is pointing at an unreachable repository. See
[Gradle repository configuration](#gradle-repository-configuration) and make sure
the public repositories (or your reachable internal mirror) are configured.

### Port already in use (8080 or 3000)
Stop the process using the port, or change it:
- Backend: set `server.port` in `backend/src/main/resources/application.yaml`.
- Frontend: set `server.port` in `frontend/vite.config.js` (also update the proxy target if you move the backend).

## License

This is a template project for learning purposes.
