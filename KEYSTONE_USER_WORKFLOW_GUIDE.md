# 🚀 KEYSTONE Field Service Management — Complete Step-by-Step User Flow & Operating Guide

Welcome to **KEYSTONE**, an enterprise-grade Field Service Management (FSM) and dispatch operations platform built for commercial facility maintenance, technician fleet routing, SLA tracking, and customer self-service workflows.

---

## 📊 End-to-End Operational Flow Diagram

```mermaid
flowchart TD
    A[1. Authentication & Role Selection (/login)] --> B[2. Customer & Site Onboarding (/customers)]
    B --> C[3. Parts & Inventory Setup (/inventory)]
    C --> D[4. Technician Fleet Ready (/technicians)]
    D --> E[5. Raise & Dispatch Work Order (/work-orders)]
    E --> F[6. Technician Field Execution & Logging (/my-jobs)]
    F --> G[7. Manager Inspection & Closing (/work-orders)]
    G --> H[8. Operations Analytics & Account Settings (/analytics)]
```

---

## 🔑 Role-Based Access Matrix

| Role | Access Permissions | Primary Portal URL |
| :--- | :--- | :--- |
| **Dispatcher / Manager** | Full control over work order dispatching, ClickUp views, customer onboarding, inventory, technician fleet management, scheduling, and analytics. | `http://localhost:5173/dashboard` |
| **Technician** | Access to assigned field jobs, interactive subtask checklists, labor hours logging, and inventory parts consumption. | `http://localhost:5173/my-jobs` |
| **Customer** | Access to raise facility maintenance requests, view site locations, and track real-time SLA status audit trails. | `http://localhost:5173/portal` |

---

## 🛠️ Detailed Step-by-Step User Walkthrough

### **Step 1: Authentication & Role Selection (`/login`)**
1. Open `http://localhost:5173/login`.
2. Log in using your email credentials or click one of the instant **One-Click Demo Login** buttons:
   - **Manager**: `manager@keystone-ops.com` (Full admin dashboard)
   - **Dispatcher**: `dispatcher@keystone-ops.com` (Dispatch board & work orders)
   - **Technician**: `tech.john@keystone-ops.com` (Mobile-responsive field job list)
   - **Customer**: `customer@acme-facilities.com` (Customer request portal)

---

### **Step 2: Customer & Site Onboarding (`/customers`)**
*Before creating work orders, register client organizations and their physical facility site locations.*

1. Navigate to **Customers & Sites** (`/customers`) in the sidebar menu.
2. **Onboard Customer Organization**: Click **`+ Onboard New Customer`** (e.g. *Acme Commercial Facilities*).
3. **Attach Facility Sites**: Click **`+ Add Site`** under a customer card to register physical locations (e.g. *Acme HQ - Tower A*, *Acme East Warehouse*, *Apex Mall - North Wing*).

---

### **Step 3: Parts & Inventory Setup (`/inventory`)**
*Stock your warehouse inventory so technicians can record spare parts used during site visits.*

1. Navigate to **Inventory** (`/inventory`) in the sidebar menu.
2. Click **`+ Add Part`**.
3. Register spare parts with SKU numbers, unit costs, and initial stock quantities (e.g. *HVAC Capacity Filter*, *Circuit Breaker 20A*, *Copper Piping 3/4in*, *Refrigerant Canister*).

---

### **Step 4: Technician Fleet Verification (`/technicians`)**
*Ensure your field workforce is ready for job assignments.*

1. Navigate to **Technicians** (`/technicians`) in the sidebar menu.
2. View active field technicians (e.g., *John Gallagher*, *Sarah Jenkins*).
3. Inspect technician skill certifications, contact numbers, assigned service vans, and real-time active job loads.

---

### **Step 5: Raise & Dispatch Work Orders (`/work-orders` or `/board`)**
*Create, organize, and dispatch field service jobs using the ClickUp 3.0 Workspace Suite.*

1. Navigate to **Work Orders** (`/work-orders`) or **Dispatch Board** (`/board`).
2. Click the purple **`+ Raise Work Order`** button.
3. Fill in work order details:
   - **Job Title**: e.g., *Main AC Chiller Tripping in Tower A*
   - **Customer & Site**: Select from registered customers and sites.
   - **Priority Level**: Select `HIGH` 🔴, `MEDIUM` 🟠, or `LOW` 🔵.
   - **SLA Resolution Target**: Select window (*2 Hours Emergency*, *4 Hours*, *24 Hours Maintenance*, *48 Hours*).
   - **Assigned Technician (Optional)**: Select a technician or leave unassigned (`NEW`).
4. **Choose your preferred ClickUp View**:
   - 📋 **List View**: Signature ClickUp view with collapsible status headers, subtask counters, inline status popover dropdowns, technician avatars, and SLA badges.
   - 🗂️ **Board (Kanban)**: Drag and inspect status columns (*NEW, ASSIGNED, IN PROGRESS, ON HOLD, COMPLETED, CLOSED*).
   - 📑 **Table Grid**: High-density spreadsheet layout with column sorting.
   - 📅 **Calendar**: Monthly visual SLA due date schedule.
   - 📊 **Gantt Chart**: Horizontal timeline chart displaying completion progress percentages.

---

### **Step 6: Technician Field Execution & Logging (`/my-jobs`)**
*Field technicians execute jobs on site and log labor and inventory in real time.*

1. Technicians log in and navigate to **My Assigned Jobs** (`/my-jobs`).
2. **Update Status**: Click `Start Work` to transition status from `ASSIGNED` ➔ `IN PROGRESS`.
3. **Interactive Subtasks Checklist**: Check off completed field tasks (e.g. *Safety Pre-check*, *Thermal diagnostic*, *Voltage load test*).
4. **Log Consumed Parts**: Click `Log Parts` to deduct used inventory (e.g. *2 x LED Panel Light Fixture*).
5. **Log Labor Hours**: Click `Log Time` to record elapsed minutes and diagnostic notes.
6. **Mark Completed**: Click `Mark Completed` to change status to `COMPLETED`.

---

### **Step 7: Manager Inspection & Closing (`/work-orders`)**
*Review work order audit history, consumed inventory costs, and close out jobs.*

1. Dispatchers or Managers open the **Work Order Details Inspector** (`Inspect`).
2. Review the **ClickUp Activity Audit Trail** to view timestamped status logs and technician notes.
3. Verify consumed parts costs and labor hours.
4. Click **`Close`** to transition status to `CLOSED & ARCHIVED`.

---

### **Step 8: Operations Analytics & Account Settings**
- 📈 **Analytics (`/analytics`)**: Monitor SLA compliance rates, average resolution speed, technician workload distribution, and total parts expense charts.
- ⚙️ **Settings (`/settings`)**: Edit user profile email/name, security password, 2FA authentication, notification controls, and theme mode.
- 👤 **Profile (`/profile`)**: Manage field certifications, assigned fleet unit, dispatch phone, and base station.
- ❓ **Help Center (`?`)**: Access searchable documentation, FAQ, email support, and WhatsApp support popover.

---

## 🌐 Full System Application Routes Map

| Route URL | Page Title | Allowed User Roles |
| :--- | :--- | :--- |
| `/login` | Authentication & Demo Account Login | All Users |
| `/dashboard` | Executive Operations Dashboard | Dispatcher, Manager |
| `/work-orders` | ClickUp 3.0 Work Orders Suite | Dispatcher, Manager |
| `/customers` | Customers & Facility Sites Management | Dispatcher, Manager |
| `/scheduling` | Technician Scheduling Calendar | Dispatcher, Manager |
| `/map` | Live Fleet GPS Map View | Dispatcher, Manager |
| `/technicians` | Technicians Directory | Dispatcher, Manager |
| `/inventory` | Spare Parts & Warehouse Inventory | Dispatcher, Manager |
| `/analytics` | SLA & Financial Analytics | Dispatcher, Manager |
| `/board` | Visual Dispatch Kanban Board | Dispatcher, Manager |
| `/profile` | Operations User Profile | All Users |
| `/settings` | Platform & Security Settings | All Users |
| `/my-jobs` | Technician Field Work Portal | Technician |
| `/portal` | Customer Service Request Portal | Customer |

---
*KEYSTONE Operations Hub — Engineered for Meridian Facilities Management System of Record.*
