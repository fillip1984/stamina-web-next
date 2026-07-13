# Todo Application Specification

## 1. Purpose

Define functional and non-functional requirements for the Todo application as currently implemented and intended near-term.

## 2. Product Scope

In scope:

- Single-user authenticated experience.
- Collection management.
- Task lifecycle management with typed behavior.
- Task completion and result recording.
- Data export.

Out of scope for current release:

- Multi-user collaboration.
- Public sharing.
- Full import pipeline.
- Advanced analytics dashboards.

## 3. Target User

A single authenticated user who wants to track habits, recurring tasks, and selected health-related completion outcomes.

## 4. Functional Requirements

### FR-1 Authentication

- System shall require an authenticated session to access app content.
- System shall support Google OAuth sign-in.
- System shall provide sign-out from authenticated shell.

Acceptance criteria:

- Unauthenticated user sees sign-in view.
- Authenticated user sees sidebar/topbar shell and routes.

### FR-2 Navigation and Shell

- System shall provide persistent sidebar navigation.
- System shall show breadcrumb context in topbar.
- System shall allow theme selection (light, dark, system).

Acceptance criteria:

- Collections route is reachable from sidebar.
- Breadcrumb reflects current route hierarchy.

### FR-3 Collection Management

- User shall create a collection with name and optional description.
- User shall list all collections sorted predictably.
- User shall view a single collection by id.
- User shall update collection name/description.
- User shall delete a collection.

Acceptance criteria:

- New collection appears in list without manual refresh.
- Deleted collection is removed and user is redirected to collection list.

### FR-4 Task Creation and Editing

- User shall create task within a collection.
- User shall edit existing task details.
- Task form shall validate required fields.
- Task type shall support Todo, Recurring, Seeking, and Tally.

Acceptance criteria:

- Create action is disabled until required fields are valid.
- Editing pre-populates form fields from selected task.

### FR-5 Task Scheduling Semantics

- Recurring tasks require due date semantics.
- Suggested day and suggested day time are optional metadata.
- Interval is optional at create time and may be inferred through completion logic.

Acceptance criteria:

- Recurring task cannot be submitted without due date.
- Suggested day can auto-drive due date defaults in UI for recurring mode.

### FR-6 Task Completion

- User shall complete a task from task card actions.
- Completion shall persist a result entry.
- Completion shall recalculate task timing values based on task type.
- If on-complete action requires measurement data, completion shall require it.

Acceptance criteria:

- Completing task without required measurement data is rejected.
- Successful completion updates task timing and inserts result atomically.

### FR-7 Health Metric Linkage

- System shall support optional completion-linked weigh-in data.
- System shall support optional completion-linked blood pressure readings.

Acceptance criteria:

- Valid measurement data persists and links to user context.
- Blood pressure category is computed during persistence.

### FR-8 Results and History Data Access

- System shall expose result history ordered by date.
- System shall include related measurement records where present.

Acceptance criteria:

- Result queries return newest-first records with related detail.

### FR-9 Data Export

- User shall export personal data bundle including collections and tasks.

Acceptance criteria:

- Export action triggers file download in JSON format.

## 5. Non-Functional Requirements

### NFR-1 Type Safety

- End-to-end type safety across UI, API, and database access.

### NFR-2 Performance

- Common reads and writes should feel interactive for personal-scale datasets.
- Client cache invalidation should refresh affected views after mutations.

### NFR-3 Security

- All domain operations must be user-scoped.
- No unauthenticated access to user data routes.

### NFR-4 Reliability

- Mutations affecting multiple records should be transactional where required.
- Failures should avoid partial writes in completion workflows.

### NFR-5 Maintainability

- Domain logic should remain in routers/utilities, not duplicated across UI.
- Feature modules should preserve current separation by domain area.

## 6. API Surface Summary

Core routers:

- auth
- collection
- task
- result
- admin
- weighIn
- bloodPressureReading
- tag

Key operations:

- collection.create/readAll/readById/update/delete
- task.create/readById/update/complete/delete
- result.create/findAll
- admin.exportData
- weighIn.readById/getWeightGoal/setWeightGoal
- bloodPressureReading.readById

## 7. Data Model Constraints

- Every user-owned record includes userId.
- Task belongs to one collection.
- Collection and task delete behavior cascades through relational constraints.
- Enum-backed fields control task and completion behavior.

## 8. Known Issues and Open Requirements

- On-complete dialog integration in active task UI is incomplete.
- Task action menu handlers for edit/delete/activity are partially unimplemented.
- Collection type setting currently lacks persistence path.
- Import pipeline is not implemented.
- Validation and UX feedback are basic and can be expanded.

## 9. Test Requirements

Minimum automated coverage expected:

- Router unit/integration tests for collection and task mutations.
- Completion flow tests for each task type transition.
- Auth-guard tests for protected procedures.
- UI smoke tests for create/edit/delete flows.

## 10. Release Criteria for Next Milestone

- Full create/edit/delete and complete flows working end-to-end.
- On-complete measurement capture integrated in task completion UI.
- Export verified and import either implemented or explicitly hidden.
- No TypeScript, lint, or build errors.
