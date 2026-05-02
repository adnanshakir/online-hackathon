# OpsWatch

**OpsWatch** is a lightweight incident management platform that helps teams track, manage, and resolve outages efficiently using structured timelines and AI-powered insights.

<img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/88be7dcf-856c-46a7-a35b-1e5a1b29262f" />

---

## 🚀 Overview

OpsWatch is built to simulate real-world incident handling workflows used by modern engineering teams.

It provides:

* Structured incident tracking
* Real-time timeline updates
* Role-based access control
* AI-powered summaries (in progress)
* Public status visibility (planned)

---

## 🔄 How It Works

1. User creates an incident  
2. Team members are assigned  
3. Updates are added to timeline (logs/comments)  
4. Status changes are tracked and auto-logged  
5. Timeline provides full incident history  

AI layer (in progress) analyzes timeline for summaries and insights.

---

## ⚙️ Features

### 🔐 Authentication

* JWT-based authentication
* Google OAuth integration
* Secure cookie handling

---

### 📌 Incident Management

* Create incidents with severity + service
* Status lifecycle:

  * investigating → identified → monitoring → resolved
* Assign responders to incidents

---

### 🧾 Timeline System (Core Feature)

* Every incident has a timeline (like a log/chat)
* Supports:

  * logs
  * comments
  * status changes
* Automatic logging for:

  * status updates
  * user assignments

---

### 👥 Role-Based Access (In Progress)

* Admin / Member roles
* Controlled access to actions

---

### 🤖 AI Integration (In Progress)

* Incident summary generation
* Root cause suggestions

---

### 🌐 Public Status Page (Planned)

* Active incidents
* Incident history

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Zustand (state management)
- Radix UI (accessible components)
- shadcn/ui patterns
- React Router
- Axios
- Recharts (charts)
- Framer Motion (animations)
- React Markdown
- Sonner (toasts)

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)

**Authentication**
- JWT
- Passport (Google OAuth)

**Security**
- Helmet
- Rate Limiting
- Input Sanitization

## 🧱 Architecture

* Clean separation:

  * Models
  * Controllers
  * Routes
  * Middleware

* Centralized error handling (AppError)

* Zod-based validation layer

* Token-based authentication (cookies)

---

## 🔄 API Flow

1. Create Incident
2. Assign Users
3. Add Updates (timeline logs)
4. Change Status (auto-logged)
5. View Timeline

---

## 📌 Key Decisions

* Updates stored separately (not embedded)
* Timeline-driven UX (core focus)
* Minimal but scalable design
* Avoided over-engineering for hackathon speed

---

## ⚠️ Challenges Faced

* Designing clean incident ↔ timeline relationship
* Maintaining consistent validation across layers
* Handling auth + role structure without overcomplication
* Ensuring meaningful logs for every action

---

## 📈 What We Built Well

* Clean backend architecture
* Real-world incident workflow
* Scalable data design
* Strong separation of concerns

---

## 🚧 Upcoming Improvements

* Role-based access enforcement
* AI integration completion
* Public status page
* Pagination + filtering
* UI enhancements for timeline

---

## 📣 Final Note

OpsWatch focuses on solving a real operational problem with a clean, scalable approach rather than adding unnecessary complexity.

---
