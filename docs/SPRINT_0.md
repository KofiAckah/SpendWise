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
A story is considered **Done** only when it meets the following criteria:

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