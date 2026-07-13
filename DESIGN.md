# Todo Application Design

## 1. Product Vision

Build a personal, invitation-only task tracking app focused on recurring behavior change.
The product centers around collections of tasks, where each task can behave differently over time:

- Todo: one-off completion behavior.
- Recurring: date-based cadence with interval.
- Seeking: exploratory cadence that becomes structured after repeated completion.
- Tally: open-ended streak/time-since behavior.

The app is not a generic team project manager. It is a single-user, high-signal personal operating system for health and routine progress.

## 2. Design Principles

- Fast default path: users should add and complete tasks in a few clicks.
- Rich behavior, simple UI: complex cadence logic should stay behind straightforward controls.
- Context over clutter: each screen should focus on one level of detail.
- Human rhythm support: suggested day/time and completion side effects should encourage habits.
- Progressive depth: basic task creation first, advanced fields available without blocking.

## 3. Information Architecture

Primary areas:

- Authentication gate
- Collections list
- Collection details (tasks)
- Task details dialog (create/edit)
- Settings (import/export)

Navigation model:

- Left sidebar as primary navigation.
- Topbar breadcrumb for context and hierarchy.
- Collection details as the main workspace.

## 4. Primary User Flows

### 4.1 Sign in

- User lands in app shell.
- If no session exists, user sees invitation-only sign-in view.
- OAuth (Google) creates session and enters app workspace.

### 4.2 Create collection

- User opens New Collection dialog.
- User enters name and optional description.
- Collection list refreshes after successful creation.

### 4.3 Create task

- User opens Add Task from a collection page.
- User enters task metadata and chooses task type.
- If Recurring, user can set suggested day/time, due date, and interval.
- Task is persisted and visible in collection list.

### 4.4 Complete task

- User taps complete action from task card.
- If on-complete action is required, user should capture supplemental data.
- Completion updates task timing (set date, due date, interval) and records result.

### 4.5 Update or delete entities

- Collection and task records are editable.
- Deletions should cascade and preserve integrity via schema relations.

## 5. UX Structure

### 5.1 Shell

- Floating sidebar with brand, primary nav, account controls.
- Header with sidebar trigger and breadcrumbs.
- Content pane optimized for vertical workflows.

### 5.2 Collections list

- Card-based list with empty state.
- Primary action is create collection.
- Future secondary action is import collection.

### 5.3 Collection details

- Editable name and description.
- Task list with animation and per-task actions.
- Collection-level settings and destructive action in menu.

### 5.4 Task details dialog

- Single dialog for create and update modes.
- Dynamic fields by task type.
- Validation gates action button.
- Supports optional completion side effects.

## 6. System Architecture

### 6.1 Frontend

- Next.js App Router with React client components for interactive pages.
- TanStack Query for request lifecycle and cache invalidation.
- tRPC client links with SuperJSON transport.
- UI layer built with Base UI/shadcn style primitives.

### 6.2 Backend

- tRPC router composition by domain (collection, task, result, admin, health metrics).
- Procedure-level auth via protected procedures.
- Better Auth for session management and OAuth.

### 6.3 Data layer

- Drizzle ORM with Postgres.
- Strong schema for collections, tasks, results, weigh-ins, blood pressure readings, tags.
- User-scoped data across all domain entities.

## 7. Domain Model Summary

Core entities:

- User
- Collection
- Task
- Result
- WeighIn
- BloodPressureReading
- WeightGoal
- Tag

Important task fields:

- type
- setDate
- dueDate
- interval
- suggestedDay
- suggestedDayTime
- onComplete

Behavioral rules:

- Completion recalculates timing data based on task type.
- Seeking tasks can transition into recurring-like behavior after completion.
- Optional side effects create health measurements tied to completion events.

## 8. State and Data Flow

- Pages fetch data through tRPC query options and TanStack Query.
- Mutations invalidate scoped caches for consistency.
- Dialog components maintain local draft form state, then submit via mutation.
- Auth session is resolved in root layout and gates app shell rendering.

## 9. Security and Privacy

- All core routes are effectively private behind session gating.
- All database reads and writes are user-scoped.
- OAuth credentials and DB credentials are managed through validated environment variables.

## 10. Current Design Gaps

- Task complete flow currently opens an on-complete path but integration is incomplete.
- Task actions menu shows Edit/Delete but handlers are partially stubbed.
- Collection type selection appears UI-only and is not persisted.
- Import flow is not implemented, export only.
- Activity/history views are not yet surfaced in UI.

## 11. Quality Goals

- High confidence type safety from database to UI.
- Predictable optimistic-feeling interactions through fast invalidation patterns.
- No cross-user data leakage in any query path.
- Minimal friction for daily, repeated use.

## 12. Future Design Extensions

- Activity timeline and insights dashboard.
- Habit scorecards and longitudinal trend visualization.
- Bulk task operations and keyboard-first workflows.
- Collection templates for recurring routines.
- Better mobile ergonomics for quick check-ins.
