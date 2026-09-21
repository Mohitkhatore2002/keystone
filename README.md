# Project KEYSTONE — Field Service Management Platform
**Commercial Facilities Maintenance Platform for Meridian Facilities Management**  
*Zidio Development · Java Full-Stack Internship Solo Build*

---

## 1. Project Overview
KEYSTONE is a full-stack, enterprise-grade Field Service Management (FSM) platform designed for commercial facility maintenance (HVAC, Electrical, Plumbing). It replaces fragmented WhatsApp/phone coordination with a single, server-enforced system of record:
- **Managers** track real-time SLA compliance, workload metrics, and close finished jobs.
- **Dispatchers** raise work orders, assign field technicians, and manage Kanban pipelines.
- **Technicians** manage assigned jobs from a mobile-friendly view, start/pause work, log parts, and track labor hours.
- **Customers** self-serve maintenance requests and monitor resolution status and audit histories.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Java 21 · Spring Boot 3.3.3 · Spring Data JPA · Spring Validation |
| **Security** | Spring Security with Stateless JWT + BCrypt Password Encoding |
| **Database & Migrations** | Flyway (`V1__init_schema.sql`, `V2__seed_data.sql`) · PostgreSQL 16 (H2 compatibility mode enabled for instant local testing) |
| **API Documentation** | OpenAPI 3.0 (springdoc-openapi) & Interactive Swagger UI |
| **Frontend Framework** | React 18 · TypeScript · Vite · React Router v6 · Axios |
| **Design System** | Figma Tokens (`#0F0E2C` Navy, `#6C5CE7` Indigo, `#F8F9FC` BG, Pill Chips, KPI Cards) |

---

## 3. User Roles & Access Control

All permissions are strictly enforced server-side via Spring Security `@PreAuthorize`:

| Role | Permissions & Access Scope |
|---|---|
| **MANAGER** | Executive Dashboard (`/dashboard`), view/create all customers, sites, and work orders, assign technicians, close completed jobs, inspect audit logs, and view inventory. |
| **DISPATCHER** | Dispatch Board (`/board`), view/create all customers, sites, and work orders, assign technicians, transition job states (except close). |
| **TECHNICIAN** | Mobile Field View (`/my-jobs`), view ONLY jobs assigned to them, start/hold/complete assigned jobs, deduct inventory stock for parts used, and log labor minutes. |
| **CUSTOMER** | Customer Portal (`/portal`), raise requests ONLY for their own sites, view ONLY their own organization's work orders and real-time audit trail. |

---

## 4. Work-Order Lifecycle (7-State Machine)

Status transitions are governed by a server-side state machine. All transitions produce an **append-only audit log** in `work_order_status_history`:

```
NEW ──(assign)──> ASSIGNED ──(start)──> IN_PROGRESS ──(complete)──> COMPLETED ──(close)──> CLOSED
 │                    │                     │  ↑
 └──(cancel)──> CANCELLED <──(cancel)───────┘  │
                                        (hold)  │  (resume)
                                          └─> ON_HOLD ┘
```

- **CLOSED** & **CANCELLED** are terminal states and cannot transition further.
- Only a **MANAGER** can move a job from `COMPLETED` to `CLOSED`.

---

## 5. Seed Accounts (One-Click Login)

The Login page includes 1-click demo buttons for testing all four roles:

| Role | Email | Password | Primary Route |
|---|---|---|---|
| **Manager** | `manager@meridian.com` | `password123` | `/dashboard` |
| **Dispatcher** | `dispatcher@meridian.com` | `password123` | `/board` |
| **Technician John** | `tech.john@meridian.com` | `password123` | `/my-jobs` |
| **Technician Sarah** | `tech.sarah@meridian.com` | `password123` | `/my-jobs` |
| **Customer Acme** | `customer@acme.com` | `password123` | `/portal` |

---

## 6. How to Run Locally

### Prerequisites
- JDK 21
- Node.js v18+ & npm

### Backend Setup
```bash
cd backend
# Run database Flyway migrations and start API server (Port 8080)
# Powershell / CMD:
$env:JAVA_HOME="C:\Program Files\Java\jdk-23" # or your local JDK 21/23 path
.\maven-dist\apache-maven-3.9.8\bin\mvn.cmd spring-boot:run
```
- **Backend API Base URL**: `http://localhost:8080/api`
- **Swagger API Documentation**: `http://localhost:8080/swagger-ui.html`
- **H2 Web Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:keystonedb`)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- **Frontend App URL**: `http://localhost:5173`

---

## 7. Running Unit & Integration Tests

### Backend Unit Tests
```bash
cd backend
.\maven-dist\apache-maven-3.9.8\bin\mvn.cmd test
```
- Verifies state machine transitions (`NEW` → `ASSIGNED` → `IN_PROGRESS` → `COMPLETED` → `CLOSED`), illegal transition rejection, and role-based permission checks.

### Frontend Production Build Verification
```bash
cd frontend
npm run build
```
- Verifies zero TypeScript compilation or bundling errors.
