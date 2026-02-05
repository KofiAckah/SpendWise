# SPRINT 2

**Sprint Goal:** Enhance expense management with delete, filter, and edit features while applying Sprint 1 process improvements

---

## Sprint Planning

### Velocity Reference
- **Sprint 1 Velocity:** 6 points
- **Sprint 2 Capacity:** 7 points
- **Rationale:** Increased capacity justified by eliminated setup overhead, established patterns, and process improvements

---

## Process Improvements Implementation

Before starting user stories, the following improvements from Sprint 1 retrospective were implemented:

### Improvement 1: Pre-commit Hooks with Husky
- Installed Husky and lint-staged packages
- Configured to run ESLint before all commits
- **Status:** TODO (Sprint 2 work)

### Improvement 2: data-testid Attributes
- Add explicit test IDs to all UI components
- Update tests to use data-testid selectors
- **Status:** TODO (Sprint 2 work)

### Improvement 3: Environment Variable Documentation
- Created .env.example with all required variables
- Added comments explaining each variable
- **Status:** TODO (Sprint 2 work)

### Improvement 4: Standardized Error Handling
- Create error response utility function
- Apply to all API endpoints
- **Status:** TODO (Sprint 2 work)

### Improvement 5: Request Logging
- Install Morgan middleware
- Configure logging format
- **Status:** TODO (Sprint 2 work)

---

## Selected User Stories

### US-004: Delete Expense
**Story Points:** 2  
**Priority:** High

**User Story:**  
As a user, I want to delete an expense from my list so that I can remove mistakes or unwanted entries.

**Acceptance Criteria:**
- Delete button appears on each expense item
- Confirmation dialog prevents accidental deletion
- DELETE API request removes expense from database
- UI updates immediately after deletion
- Total spending recalculates after deletion
- Success notification shown to user

**Tasks:**
- Create DELETE `/api/expenses/:id` endpoint
- Add delete button to expense item component
- Implement confirmation modal
- Update total after deletion
- Test deletion flow
- Document API endpoint

---

### US-005: Filter by Category
**Story Points:** 5  
**Priority:** Medium

**User Story:**  
As a user, I want to filter my expenses by category (e.g., Food, Transport) to analyze my habits.

**Acceptance Criteria:**
- Dropdown in "Log Expense" to select category
- Filter control above the list to toggle views
- Total updates to show only filtered sum

**Tasks:**
- Add category field to database schema
- Update POST `/api/expenses` to accept category
- Create GET `/api/expenses?category=X` filter endpoint
- Add category dropdown to expense form
- Build category filter control above list
- Update total calculation for filtered data
- Create unit tests (backend + frontend)
- Document API changes

---

### Sprint Commitment
**Total Committed Story Points:** 7

**Selection Justification:**
- Completes all remaining backlog items from Sprint 0
- US-004 enables users to correct mistakes
- US-005 provides spending analysis by category
- Both are medium priority items from product backlog

---

## Sprint Execution Log

### Early Sprint

**Completed Work:**
- Sprint 2 planning completed
- Process improvements planning documented
- Acceptance criteria reviewed

_[Sprint 2 execution in progress - to be updated daily]_

**US-004 Progress:**
- _[To be updated during sprint]_

---

### Mid-Sprint

_[To be updated during sprint]_

---

### Late Sprint

_[To be updated during sprint]_

---

### Sprint End

_[To be updated at sprint conclusion]_

---

## Sprint Review

### Completed Work

_[To be completed after Sprint 2 execution]_

**US-004: Delete Expense** ⏳  
_[Status and screenshots to be added]_

**US-005: Filter by Date Range** ⏳  
_[Status and screenshots to be added]_

**US-006: Edit Expense** ⏳  
_[Status and screenshots to be added]_

### Screenshots

_[Screenshots to be added during sprint execution]_

### Sprint Metrics

_[Metrics to be captured at sprint end]_

- **Planned Story Points:** 7
- **Completed Story Points:** TBD
- **Sprint Velocity:** TBD
- **Completion Rate:** TBD
- **Total Tests:** TBD

### Demonstration Summary

_[To be completed after sprint execution]_

---

## Sprint Retrospective

### What Went WellCategory
### What Could Be Improved

_[To be completed after sprint execution]_

### Lessons Learned

_[To be completed after sprint execution]_

---

## Final Project Retrospective

### Agile Process Reflection

_[To be completed after Sprint 2]_

**Sprint 1 to Sprint 2 Evolution:**
- Process improvements identified and applied
- Velocity adjustment based on Sprint 1 data
- Definition of Done consistently applied

### Technical Development Reflection

_[To be completed after Sprint 2]_

**Architecture Validation:**
- React + Node.js + PostgreSQL stack
- Docker containerization approach
- CI/CD pipeline effectiveness

### Key Takeaways

_[To be completed after Sprint 2]_

**Agile Methodology:**
- Sprint planning and commitment discipline
- Retrospective-driven improvement
- Incremental delivery value

**DevOps Practice:**
- Automated testing benefits
- CI/CD pipeline value
- Container orchestration learning

---

**Sprint 2 Status:** 🚧 PLANNED - Ready to Begin
