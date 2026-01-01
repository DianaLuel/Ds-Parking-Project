<img width="1280" height="689" alt="image" src="https://github.com/user-attachments/assets/e9efad1b-4987-4074-a40f-805a5d12bde3" /># 🚗 Distributed Smart Parking Booking System

A distributed, microservices-based Smart Parking Booking System that allows users to view parking availability, book parking spots, and receive notifications.  
The system is designed using **microservices architecture**, **API Gateway**, and **Docker**, ensuring scalability, fault isolation, and maintainability.

---

## 📌 Features

### User Features
- User registration & login (JWT-based authentication)
- Browse parking lots and available spots
- Create and cancel bookings
- View personal booking history

### Admin Features
- Admin login & authorization (role-based)
- View all bookings
- Manage parking lots and spots
- Force-cancel bookings
- System-level control (admin-only APIs)

---

## 🏗️ High-Level Architecture

The system follows a **distributed microservices architecture**:

- **Frontend (React + Vite)**
- **API Gateway** (single entry point)
- **Auth Service** (users, roles, JWT)
- **Booking Service** (reservations)
- **Parking Service** (lots & spots)
- **Notification Service** (event-based)
- **Redis** (Pub/Sub for async communication)
- **PostgreSQL** (separate DB per service)

### Communication Model
- **Synchronous REST APIs** → user operations
- **Asynchronous Redis Pub/Sub** → state updates & notifications

---

## 🧩 Services Overview

| Service | Responsibility |
|------|---------------|
| API Gateway | Routes requests to backend services |
| Auth Service | Authentication, JWT, roles (USER / ADMIN) |
| Booking Service | Create, cancel, list bookings |
| Parking Service | Manage parking lots & spots |
| Notification Service | Send booking-related notifications |
| Redis | Event propagation |
| PostgreSQL | Persistent storage (per service) |

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Messaging**: Redis (Pub/Sub)
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

---

## 📂 Project Structure (Simplified)

```text
.
├── backend
│   ├── services
│   │   ├── api-gateway
│   │   ├── auth-service
│   │   ├── booking-service
│   │   ├── parking-service
│   │   └── notification-service
│   └── init-sql
│       ├── auth-init.sql
│       ├── booking-init.sql
│       └── parking-init.sql
├── frontend
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start (Run with Docker)

### Prerequisites
- Docker
- Docker Compose

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
```
### Step 2: Clone the Repository
```bash
  docker compose up --build
```
### Step 3: Access the system

| Component          | URL                                            |
| ------------------ | ---------------------------------------------- |
| Frontend (User UI) | [http://localhost:5173](http://localhost:5173) |
| API Gateway        | [http://localhost:8080](http://localhost:8080) |
| Auth Service       | [http://localhost:3000](http://localhost:3000) |
| Booking Service    | [http://localhost:3001](http://localhost:3001) |
| Parking Service    | [http://localhost:3002](http://localhost:3002) |

<img width="1321" height="615" alt="image" src="https://github.com/user-attachments/assets/c924bde1-a168-48f5-b3cd-db1e11d499f3" />


