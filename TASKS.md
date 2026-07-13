# Task Backlog

## Milestone 1: Stabilize Core CRUD and Completion

Goal: Ensure the main collections and tasks workflow is complete, consistent, and testable.

### 1.1 Task card action wiring

- [ ] Implement Edit action to open Task Details dialog in update mode.
- [ ] Implement Delete action mutation and success/error feedback.
- [ ] Implement View Activity action or temporarily hide it.
- [ ] Ensure item click and action buttons do not conflict with event bubbling.

Definition of done:

- Edit, delete, and complete are fully functional from task list.
- No dead or placeholder actions remain visible.

### 1.2 Completion side-effect integration

- [ ] Integrate on-complete measurement dialog into active task completion path.
- [ ] Ensure weigh-in and blood pressure inputs map to task.complete mutation payload.
- [ ] Add client-side validation for required measurement fields before submit.
- [ ] Add mutation pending and error states in completion UI.

Definition of done:

- Tasks with onComplete requirements can be completed with correct data.
- Tasks without onComplete still complete in one click.

### 1.3 Collection settings persistence

- [ ] Persist collection type changes via collection.update.
- [ ] Read collection type from backend and initialize UI state from source of truth.
- [ ] Remove local-only state defaults that can drift from persisted data.

Definition of done:

- Collection type remains consistent after reload and navigation.

## Milestone 2: Data Integrity and API Hardening

Goal: Improve correctness and maintainability of router logic.

### 2.1 Router consistency

- [ ] Standardize router DB access through request context where appropriate.
- [ ] Review all protected procedures for explicit user scoping.
- [ ] Add robust error messages and typed error handling for mutation failures.

### 2.2 Completion flow invariants

- [ ] Add tests covering task.complete transitions for Todo, Recurring, Seeking, and Tally.
- [ ] Verify interval and due date calculations across boundary cases.
- [ ] Ensure result and measurement writes remain transactional.

### 2.3 Export/import strategy

- [ ] Keep export stable and version output schema.
- [ ] Implement import endpoint and client flow, or remove import CTA until ready.
- [ ] Validate imported JSON with strict schema and conflict strategy.

## Milestone 3: UX Refinement

Goal: Reduce friction and improve confidence in daily use.

### 3.1 Form UX

- [ ] Add inline validation messages for required fields.
- [ ] Add success and failure toast notifications for key mutations.
- [ ] Improve dialog keyboard behavior and focus management.

### 3.2 Loading and error feedback

- [ ] Standardize mutation loading states across dialogs and card actions.
- [ ] Add retry affordances on mutation failures where useful.

### 3.3 Mobile usability

- [ ] Review layout behavior on small screens for collection details and dialogs.
- [ ] Tune spacing and target sizes for touch-first actions.

## Milestone 4: Quality and Delivery

Goal: Increase confidence and reduce regressions.

### 4.1 Test suite

- [ ] Add router tests for collection CRUD.
- [ ] Add router tests for task CRUD and complete.
- [ ] Add UI tests for create collection and create task happy paths.

### 4.2 Code health

- [ ] Remove dead legacy components or isolate them under archive paths.
- [ ] Align naming: task vs measurable terminology across codebase.
- [ ] Resolve all TODO comments with owner and milestone or implementation.

### 4.3 CI quality gates

- [ ] Run lint, typecheck, and build in CI.
- [ ] Fail PRs on test regressions.

## Suggested Execution Order (High Priority First)

1. Task card action wiring
2. Completion side-effect integration
3. Collection settings persistence
4. Completion flow invariants tests
5. Export/import strategy decision and implementation

## Risks

- Legacy measurable-oriented code can cause confusion during integration.
- Partial UI wiring may hide server capability and create false regressions.
- Date and timezone behavior may produce subtle completion schedule bugs.

## Tracking

Use this board mapping:

- Now: Milestone 1
- Next: Milestone 2
- Later: Milestone 3 and Milestone 4
