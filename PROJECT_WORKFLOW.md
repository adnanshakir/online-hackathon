# 🛡️ Project Requiem: Technical Workflow & Architecture

This document outlines the core business logic and API flows for the **Requiem Incident Management Platform**.

---

## 🏗️ 1. Authentication & Onboarding Flow
**Goal:** Get a user verified and into a workspace.

1.  **Signup/Login**: User registers. They are assigned a "floating" state (no workspace yet).
2.  **Email Verification**: User receives a secure link. **Crucial:** Most features (Incidents/Services) are locked until `isVerified: true`.
3.  **Workspace Entry**: User has two choices:
    *   **Create Workspace**: Becomes the `Owner`.
    *   **Join Workspace**: Enters a 6-char `inviteCode` shared by an owner. Becomes a `Member`.

---

## 🖥️ 2. System Mapping (Services)
**Goal:** Define the architecture being monitored.

1.  **Create Service**: The team defines their tech stack.
    *   *Input:* Name, Type (Frontend/Backend/DB), Tech Stack (e.g., Node.js, Redis), Environment (Prod/Staging).
2.  **Service Directory**: Dashboard shows all services and their current health status.

---

## 🚨 3. Incident Lifecycle
**Goal:** Track and resolve system failures.

1.  **Reporting**: A user creates an incident. 
    *   *Constraint:* Must select a **Service** from their workspace.
2.  **Triage**:
    *   **Assignment**: Admins assign team members to the incident.
    *   **Status Update**: Incident moves from `Investigating` → `Identified` → `Monitoring` → `Resolved`.
3.  **Timeline**: Every action (status change, manual comment) is logged as an **Update**. This forms the "Story" for the AI.

---

## 🧠 4. AI Intelligence Layer (The "Secret Sauce")
**Goal:** Automate analysis using Gemini/Mistral failover logic.

1.  **Auto-Summary**:
    *   Frontend triggers `GET /api/ai/incidents/:id/summary`.
    *   AI reads the latest 5 timeline updates and generates a professional, plain-text summary for stakeholders.
2.  **Root Cause Analysis (RCA)**:
    *   Frontend triggers `GET /api/ai/incidents/:id/root-cause`.
    *   **Context Injection:** The backend sends the Service's Tech Stack + Timeline Updates to the AI.
    *   **Output:** Returns a structured JSON array of 1–3 ranked technical causes.

---

## 🌐 5. Public Transparency
**Goal:** Communicate status to external customers.

1.  **Status Page**: A public-facing route `/api/status` returns the "Big Picture":
    *   Current health of all Services.
    *   Ongoing active incidents.
    *   Historical uptime logs.

---

## 🛠️ Frontend Technical Checklist
*   **Auth State**: Store the JWT in cookies (handled by backend). Keep user profile in global state (Zustand/Redux).
*   **Workspace Context**: Ensure the `workspace` ID is available for all Incident/Service forms.
*   **Real-time Feel**: Use polling or WebSockets (if implemented) for the Incident Timeline.
*   **Markdown Rendering**: The AI Root Cause is returned as an array; the Summary is plain text.

---
*Generated for the OpsWatch Development Team.*
