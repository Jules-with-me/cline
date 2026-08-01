# 05-FILE-BY-FILE-DOCUMENTATION.md

## Comprehensive File-by-File Documentation

This document provides detailed mappings and descriptions of the critical files in the Cline monorepo. It is structured into three tiers of depth according to importance for the web transition.

---

## TIER 1: CORE ORCHESTRATION, AGENT LOOP, & WEB INTERFACES (Deep Dive)

### 1. Web & WebSocket Gateway (`apps/cline-hub/`)

* **`apps/cline-hub/src/server.ts`**
  * **Purpose**: Entry point for the Bun-based dashboard server.
  * **Details**: Spawns Bun's built-in HTTP and WebSocket server, loads settings, handles upgrade requests (`/browser`), registers incoming peers, and routes WS frame payloads to appropriate handlers (e.g., `send`, `ready`, `approval_response`).
* **`apps/cline-hub/src/server/sessions.ts`**
  * **Purpose**: Orchestrates chat sessions, message deliveries, and checkpoints.
  * **Details**: Provides functions like `createSession()`, `selectSession()`, `sendMessage()`, `deleteSession()`, and `forkPeerSession()`. Interacts with `ClineCore` to create/abort runs, and feeds state payloads back to browser peers.
* **`apps/cline-hub/src/server/hub.ts`**
  * **Purpose**: Manages the local detached daemon connection.
  * **Details**: Spawns or detaches the background Hub server, monitors local client lists, subscribes to client registration/disconnections, and handles the "Restart Hub" grace protocol.
* **`apps/cline-hub/src/server/approvals.ts`**
  * **Purpose**: Manages user-approval requests for sensitive operations.
  * **Details**: Registers pending approvals, streams request notifications to the webview UI, parses user choices (approve/reject), and resumes the paused orchestrator.
* **`apps/cline-hub/src/server/http.ts`**
  * **Purpose**: Static asset delivery and SPA routing logic.
  * **Details**: Defines which paths are webview routes (such as `/chat`, `/sessions`, `/settings`) and serves `index.html` or static hashed assets from the webview distribution directory.
* **`apps/cline-hub/src/webview/src/App.tsx`**
  * **Purpose**: Primary React Single-Page Application (SPA) shell.
  * **Details**: Renders the navigation drawer, manages theme variables, coordinates client sidebar listings, and switches active sub-views (Chat, Sessions, MCP settings, etc.).
* **`apps/cline-hub/src/webview/src/Chat.tsx`**
  * **Purpose**: Core chat UI interface.
  * **Details**: Standard workspace chat interface. Displays streamed messages, reasoning steps, tool results, pending approvals, and implements checkpoint restore prompts.

---

### 2. Core Orchestrator (`sdk/packages/core/`)

* **`sdk/packages/core/src/ClineCore.ts`**
  * **Purpose**: The developer-facing entry point for the Cline Core SDK.
  * **Details**: Provides programmatic APIs (`start`, `send`, `stop`, `get`, `list`, `restore`) to start and manage background sessions, register Cron automations, and initialize telemetry contexts.
* **`sdk/packages/core/src/runtime/host/local-runtime-host.ts`**
  * **Purpose**: Executes files and commands on the host machine.
  * **Details**: Connects file-reader, editor, search, and shell tools to standard Node.js/Bun APIs.
* **`sdk/packages/core/src/runtime/tools/tool-approval.ts`**
  * **Purpose**: Gating logic for tool execution.
  * **Details**: Integrates the `ToolPolicy` configurations to decide if a tool request needs human permission or is safe to auto-approve.

---

### 3. Agent Execution Loop (`sdk/packages/agents/`)

* **`sdk/packages/agents/src/agent-runtime.ts`**
  * **Purpose**: The main AI loop coordinator (`AgentRuntime`).
  * **Details**: Constructs prompt messages, sends them to the provider, streams results, processes text and reasoning tokens, parses XML/JSON tags into formal tool calls, pauses for approvals, and appends outputs to the history.

---

### 4. LLM Vendor Gateway (`sdk/packages/llms/`)

* **`sdk/packages/llms/src/providers/gateway.ts`**
  * **Purpose**: Normalizes communication with multiple LLM backends.
  * **Details**: Factory pattern for generating `AgentModel` connections for Anthropic, OpenAI, OpenRouter, and local models. Manages connection limits and estimates cost in USD.
* **`sdk/packages/llms/src/providers/handler.ts`**
  * **Purpose**: Interface for LLM clients.
  * **Details**: Declares standard methods such as `stream()` and `createMessage()` that vendor handlers must implement.

---

## TIER 2: COMMON SCHEMAS, CONFS, & BUILDS (Medium Depth)

### 1. Shared Package (`sdk/packages/shared/`)
* **`sdk/packages/shared/src/prompt/system.ts`**
  * **Purpose**: The master prompt template. Defines how the agent is expected to act, formatting standards, and rule expectations.
* **`sdk/packages/shared/src/identifier.ts`**
  * **Purpose**: Cryptographically secure ID utilities. Generates unique codes for sessions and tasks.

### 2. Configurations & Scripting
* **`package.json`**: Root package configurations. Declares the Bun workspace mappings and defines global testing, linting, formatting, and build scripts.
* **`biome.json`**: Strict formatting and code-quality rules.

---

## TIER 3: AUXILIARY HELPERS, TESTS, & CLI (Overview Only)

### 1. Command-Line App (`apps/cli/`)
* **`apps/cli/src/index.ts`**: Entry point for terminal execution. Parses arguments and mounts TUI elements.
* **`apps/cli/src/main.ts`**: Handles piped input or interactive mode depending on shell arguments.

### 2. Testing Platforms
* **`sdk/packages/agents/src/agent-runtime.test.ts`**: Unit test suite for verifying prompt assemblies, stream processing, and tool-call parsers inside Vitest.
* **`apps/cline-hub/src/server/browser-auth.test.ts`**: Unit test suite verifying secure auth challenges for remote dashboard queries.
