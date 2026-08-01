# 04-MODIFICATION-ROADMAP.md

## Transformation Roadmap: Local-to-Web AI Coding Agent

This document lays out a comprehensive three-phase roadmap for transforming Cline from its current capabilities into a production-ready, secure, web-based coding companion.

---

## 1. Current Capabilities vs. What's Missing

### Current Capabilities
* **Core Agent Engine**: Stateful, iterative agent loop that handles reasoning and file-editing operations.
* **Extensive AI Provider Network**: Direct, streaming support for major LLM providers via `@cline/llms`.
* **Multi-Session CLI & VS Code Dashboard**: Existing `apps/cline-hub` exposes a multi-session dashboard for managing local clients and connected sessions.
* **Granular Multi-Agent Teams**: Framework exists to run multi-agent teams (`@cline/agents` + `@cline/core`).

### What's Missing for a Production Web App
* **Persistent DB & Schema**: History and preferences are stored in flat files or temporary SQLite DBs. We need a normalized database schema with a robust ORM (Drizzle or Prisma) to scale.
* **Secure Sandbox Virtualization**: Command execution currently runs directly on the host machine. A web app needs swappable executors that run in isolated containers (Docker) or microVMs (E2B).
* **Multi-User Multi-Tenant Isolation**: The current `cline-hub` is single-user without authentication or role separation.
* **Web-Based File Explorer & Terminal UI**: Users cannot easily browse files or see interactive shell output from the browser.
* **Enterprise Security Protocols**: Missing JWT-based authentication, rate-limiting, and cost control protections.

---

## 2. Priority Improvements Checklist

### Tier A: Critical (Must Have)
* [ ] **Multi-Tenant User Authentication**: Implement JWT-based signup/login and secure WebSocket gateway connection gates.
* [ ] **Drizzle/Prisma SQLite/PostgreSQL Database**: Migrate session data, settings, and team metadata to a unified relational model.
* [ ] **Path Traversal Shield**: Strictly sanitize workspace and folder operations on the server side.
* [ ] **Secure Command Execution (Docker Runner)**: Abstract the bash runner to execute inside isolated container instances.

### Tier B: Important (Should Have)
* [ ] **Interactive File Explorer**: A sidebar tree component allowing users to view, upload, and search the workspace directory tree.
* [ ] **Monaco/Diff Web Editor**: Integrated file viewer showing exact side-by-side diff changes before committing them.
* [ ] **Cost & Token Budgets**: Enforce strict caps on cost, input/output tokens, and iteration cycles per user or session.
* [ ] **Pre-Commit Code Validation**: Enforce syntax checks and lint routines on modified code files before finalizing agent runs.

### Tier C: Nice to Have (Could Have)
* [ ] **E2B Sandbox Driver**: Seamless, pluggable support for cloud-based virtual environments with network control.
* [ ] **Team Collaboration Features**: Joint/shared workspaces where multiple human team members can view or drive an agent session simultaneously.
* [ ] **Discord / Slack Integration**: Let users query session status or approve modifications directly via slash commands on communication tools.

---

## 3. 3-Phase Timeline & Action Plan

```
+-----------------------------------------------------------------------------------+
|                              PHASE 1: FOUNDATION                                  |
|                                (Weeks 1 - 3)                                      |
|                                                                                   |
| * Set up database schema with Drizzle/Prisma (SQLite for local, Postgres ready).  |
| * Refactor apps/cline-hub backend to handle secure Multi-Tenant JWT auth.         |
| * Restrict directory path accesses on core tool executors (Sandbox shield).       |
| * Establish basic local user login flows and session state persistence.           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             PHASE 2: UX & SANDBOXING                              |
|                                (Weeks 4 - 7)                                      |
|                                                                                   |
| * Implement DockerExecutor for subprocesses (swappable bash driver).              |
| * Integrate a rich frontend File Tree explorer and Monaco code view.             |
| * Add real-time streaming terminal view and diff comparisons.                     |
| * Introduce code generation health checks (linter and test execution hooks).      |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           PHASE 3: ENTERPRISE & DEPLOY                            |
|                                (Weeks 8 - 10)                                     |
|                                                                                   |
| * Scale to multi-user Postgres deployments on Kubernetes / Fly.io / AWS.          |
| * Set up API rate-limiters, request throttles, and budget caps.                   |
| * Expand testing coverage (Playwright frontend, Vitest mocks for LLM APIs).       |
| * Complete auditing, logging pipelines, and production optimization.              |
+-----------------------------------------------------------------------------------+
```
