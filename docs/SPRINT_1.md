# Sprint 1 Report: Execution & DevOps Foundation

## 1. Sprint Overview
**Goal:** Establish the SpendWise core infrastructure, develop the basic finance logging features, and implement the automated CI/CD pipeline.

* **Start Date:** 4th Feb
* **End Date:** [Insert Date]
* **Status:** In Progress

---

## 2. Selected User Stories
For this execution phase, we have selected the "Happy Path" stories to ensure data flows correctly from the User Interface to the PostgreSQL database.

<!-- [To-Do/In Progress/Done] -->

| ID | Priority | User Story | Acceptance Criteria (AC) | Est. (Pts) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US01** | High | **Log Expense**<br>As a user, I want to enter the name and cost of an item I bought so that I can keep a record of my spending. | 1. Validation for empty names/negative costs.<br>2. Data persists in Postgres.<br>3. UI reflects new item instantly. | 3 | [Done] |
| **US02** | High | **View Expense List**<br>As a user, I want to see a list of all items I have added so that I can review my spending history. | 1. Fetches data from Node.js API.<br>2. Displays list in chronological order.<br>3. Shows "No expenses" if empty. | 2 | [Done] |
| **US03** | High | **View Total Spending**<br>As a user, I want to see the total sum of all my expenses so that I know my total spending. | 1. Total updates when items are added.<br>2. Backend calculates sum accurately.<br>3. Formatted as GHS currency. | 1 | [To-Do] |

---

## 3. DevOps & Technical Implementation
This sprint focuses on the "DevOps Practice" dimension of the project, ensuring the environment is standardized and automated.

### 3.1 Containerization (Docker)
* **Backend:** Node.js Express server containerized with a dedicated Dockerfile.
* **Frontend:** React (Vite) application containerized with a multi-stage build.
* **Database:** PostgreSQL container configured for local persistence.
* **Orchestration:** `docker-compose.yml` manages the network and volume linking.

### 3.2 CI/CD Pipeline (GitHub Actions)
The automated pipeline is defined in `.github/workflows/main.yml`:
* **Triggers:** Automated runs on every push and pull request.
* **Workflow:** Includes environment setup, dependency installation, and linting.
* **Build Check:** Verifies that the Docker images build successfully without errors.

### 3.3 Testing Strategy
To satisfy the "Quality" requirement, automated tests have been integrated:
* **Backend:** Testing API routes and calculation logic.
* **Frontend:** Component testing for the expense form.
* **Evidence:** Screenshots of test runs are attached in Section 4.

---

## 4. Sprint Review (Evidence)
*Documentation of the working prototype and pipeline status.*

### 4.1 Functional Demo
> **[INSERT SCREENSHOT OF FRONTEND UI]**
> *Description: The current state of the SpendWise interface.*

### 4.2 CI/CD Pipeline Status
> **[INSERT SCREENSHOT OF GITHUB ACTIONS LOGS]**
> *Description: Evidence of successful (and failed) pipeline runs to show iterative debugging.*

---

## 5. Sprint 1 Retrospective
*Reflecting on the process to improve for Sprint 2.*

### What went well?
1. 
2. 

### Challenges & Obstacles
1. 
2. 

### Improvements for Sprint 2
* **Action 1:** [Identify a process or technical improvement]
* **Action 2:** [Identify a process or technical improvement]