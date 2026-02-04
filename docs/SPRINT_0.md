# Sprint 0: Project Setup & Planning - SpendWise

## 1. Product Vision
For young professionals and students who struggle to track their daily expenses, **SpendWise** is a containerized web application that allows users to log spending and view real-time totals, helping them stay within budget through a reliable, automated, and iteratively delivered solution.

---

## 2. Estimation Scale
**Story Points (Fibonacci):** 1, 2, 3, 5, 8
*Points represent the relative complexity, effort, and risk involved in completing a story.*

---

## 3. Product Backlog
This backlog outlines the features to be developed across Sprint 1 and Sprint 2.

| ID | Priority | User Story | Acceptance Criteria (AC) | Estimate (Pts) |
| :--- | :--- | :--- | :--- | :--- |
| **US01** | High | **Log Expense**<br>As a user, I want to enter the name and cost of an item I bought so that I can keep a record of my spending. | 1. Input fields for "Item Name" and "Amount".<br>2. "Add Expense" button saves to Postgres.<br>3. Validation prevents empty names or negative costs. | 3 |
| **US02** | High | **View Expense List**<br>As a user, I want to see a list of all items I have added so that I can review my spending history. | 1. List displays "Item Name" and "Amount" for each entry.<br>2. Data is fetched dynamically from the Node.js API.<br>3. Displays a message if the list is empty. | 2 |
| **US03** | High | **View Total Spending**<br>As a user, I want to see the total sum of all my expenses so that I know my total spending. | 1. Distinct "Total" display area on screen.<br>2. Total updates automatically when items are added.<br>3. Calculation is mathematically accurate. | 1 |
| **US04** | Medium | **Delete Expense**<br>As a user, I want to remove an item from the list so that I can fix mistakes or remove duplicates. | 1. Visible "Delete" button for each list item.<br>2. Clicking removes the record from the database.<br>3. Total spending updates immediately. | 2 |
| **US05** | Medium | **Filter by Category**<br>As a user, I want to filter my expenses by category (e.g., Food, Transport) to analyze my habits. | 1. Dropdown in "Log Expense" to select category.<br>2. Filter control above the list to toggle views.<br>3. Total updates to show only filtered sum. | 5 |

---

## 4. Definition of Done (DoD)
[cite_start]A story is considered **Done** only when it meets the following criteria: [cite: 38, 86, 93]

### 4.1 Code Quality & Standards
* **Clean Code:** Code is written clearly, properly indented, and follows consistent naming conventions. 
* **No Dead Code:** All commented-out code, unused variables, and debug statements are removed.
* **Conventional Commits:** Every commit follows the industry standard (e.g., `feat:`, `fix:`, `docs:`) to ensure a readable history. 

### 4.2 Functional Requirements
* **Acceptance Criteria:** All ACs defined for the story are fully implemented and verified. 
* **Validation:** Input validation is handled (e.g., no empty item names or negative costs).
* **UI/UX:** The interface is responsive, and the user receives feedback for actions.

### 4.3 DevOps & CI/CD
* **Containerization:** The feature is tested and working perfectly within the **Docker** environment. 
* **Automated Testing:** Unit or integration tests are written and pass successfully. 
* **CI Pipeline:** Code is pushed to GitHub, and the **GitHub Actions** pipeline returns a green checkmark. 
* **Incremental Delivery:** The commit history shows a step-by-step evolution rather than one "big-bang" commit. 

### 4.4 Documentation & Reflection
* **Sprint Review:** Screenshots or descriptions of the working feature are added to the Sprint Review. 
* **Retrospective:** Process improvements and lessons learned are documented. 

---

## 5. Technical Stack
* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL (with Docker Volumes)
* **Infrastructure:** Docker & Docker-Compose
* **CI/CD:** GitHub Actions

<!-- # Sprint 0: Project Setup & Planning - SpendWise

## 1. Product Vision
For young professionals and students who struggle to track their daily expenses, **SpendWise** is a containerized web application that allows users to log spending and view real-time totals, helping them stay within budget through a reliable, automated, and iteratively delivered solution.

---

## 2. Estimation Scale
**Story Points (Fibonacci):** 1, 2, 3, 5, 8
*This project uses story points to estimate the relative effort required for each feature.*

---

## 3. Product Backlog
Below is the prioritized list of work. We have selected **Stories 1, 2, and 3** for execution in Sprint 1.

### Story 1: Log Expense (Sprint 1)
**Priority:** High | **Estimate:** 3 Points
**As a** user, **I want to** enter the name and cost of an item I bought, **so that** I can keep a record of my spending.
**Acceptance Criteria:**
* Text input for "Item Name" and number input for "Amount".
* An "Add Expense" button that saves data to the PostgreSQL database.
* System prevents empty names or negative amounts (Validation).

### Story 2: View Expense List (Sprint 1)
**Priority:** High | **Estimate:** 2 Points
**As a** user, **I want to** see a list of all the items I have added, **so that** I can review my recent spending history.
**Acceptance Criteria:**
* List displays "Item Name" and "Amount" for every entry.
* Data is fetched dynamically from the Node.js backend.
* If empty, displays: "No expenses recorded yet.".

### Story 3: View Total Spending (Sprint 1)
**Priority:** High | **Estimate:** 1 Point
**As a** user, **I want to** see the total sum of all my expenses, **so that** I know exactly how much money I have spent in total.
**Acceptance Criteria:**
* Total updates automatically when items are added or removed.
* Calculation is performed by the backend or database query.
* Total is formatted as currency (GHS).

### Story 4: Delete Expense (Sprint 2)
**Priority:** Medium | **Estimate:** 2 Points
**As a** user, **I want to** remove an item from the list, **so that** I can fix mistakes or remove duplicates.
**Acceptance Criteria:**
* Each item has a visible "Delete" button.
* Clicking delete removes the record from the PostgreSQL database.

### Story 5: Filter by Category (Sprint 2)
**Priority:** Low | **Estimate:** 5 Points
**As a** user, **I want to** filter my expenses by category (e.g., Food, Transport), **so that** I can analyze where my money is going.
**Acceptance Criteria:**
* Category dropdown included in the "Log Expense" form.
* Filter control allows viewing specific categories.

---

## 4. Definition of Done (DoD)
[cite_start]To ensure **Discipline** and **Quality**, a story is only "Done" when it meets these criteria[cite: 38, 86, 89]:

### Technical Standards
* [cite_start]**Version Control:** Uses Git with **Conventional Commits** (e.g., `feat:`, `fix:`)[cite: 47, 93].
* **Containerization:** The feature works when running inside the **Docker** container.
* [cite_start]**CI/CD:** Code is pushed to GitHub, and the **GitHub Actions** pipeline is green (passing)[cite: 48, 71, 92].
* [cite_start]**Testing:** Automated unit/integration tests for the logic have been written and passed[cite: 49, 72, 92].

### Execution Standards
* [cite_start]**No "Big-Bang" Commits:** Work is committed in small, logical increments[cite: 47, 93].
* [cite_start]**Monitoring:** Sprint 2 features must include logging or a health endpoint[cite: 60, 92].
* [cite_start]**Documentation:** Sprint reports and retrospectives are updated for the period[cite: 50, 51, 61, 62].

---

## 5. Technical Stack
* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL (with Docker Volumes for persistence)
* **DevOps:** Docker, Docker-Compose, GitHub Actions -->