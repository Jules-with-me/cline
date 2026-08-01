# 03-DEPENDENCY-SECURITY.md

## Dependency & Security Analysis

This document analyzes the monorepo's dependencies, identifies potential security concerns when transitioning to a web deployment, and details the environment variable configurations.

---

## 1. Monorepo Package Map & Dependencies

The repository is organized as a Bun workspace. Below are the core workspaces and critical npm packages:

### Workspace Overview
* `@cline/packages` (Root Workspace, private)
* `apps/cline-hub`: Dashboard client and server.
* `apps/cli`: Command-line interface.
* `sdk/packages/core`: Stateful orchestrator.
* `sdk/packages/agents`: Core AI loop.
* `sdk/packages/llms`: Vendor model gateway.
* `sdk/packages/shared`: Common schemas, prompt templates, and IDs.

### Critical Dependencies List

| Package | Purpose | Version | Criticality / Audit |
| --- | --- | --- | --- |
| `bun` | Runtime engine, lockfile manager, compiler, bundler. | `1.3.13` | **High**: Powers the whole monorepo, server execution, and test suite. |
| `vitest` | Unit and integration testing framework. | `^4.0.18` | **Medium**: Standard testing platform. |
| `zod` | Schema validation and runtime type enforcement. | `^3.x` | **High**: Critical for enforcing type-safety across RPC endpoints and tool parameters. |
| `nanoid` | Cryptographically secure string ID generator. | `^5.x` | **High**: Generates unique session, run, message, and tool identifiers. |
| `biome` | Code formatting, linting, and diagnostics. | `2.4.5` | **Low**: Enforces strict code quality. |
| `lucide-react` | Lightweight modern UI icon suite. | `Latest` | **Low**: Renders visual icons in React SPA. |

---

## 2. Security Considerations for Web Deployments

Moving from a local desktop extension (where execution happens on the user's secure machine) to a web-based client exposes several high-risk attack surfaces. These must be addressed during Phase 1 & 2 of development.

### A) API Key & Secret Management
* **Vulnerability**: Exposing LLM provider API keys (OpenAI, Anthropic) directly in the browser's LocalStorage or sending them unencrypted.
* **Mitigation**:
  1. Store keys strictly on the server side (encrypted in SQLite/Postgres or configured via safe server-side environment variables).
  2. The frontend browser client should never receive or store raw API keys. Instead, the server acts as an authorized proxy.
  3. When storing key settings in a database, encrypt values with `AES-256-GCM` using a server secret (`ENCRYPTION_SECRET`).

### B) Command Execution Safety (Subprocess Hijacking)
* **Vulnerability**: If the agent is allowed to execute arbitrary commands (`execute_bash_command`) on a shared server, a compromised agent or user can execute malicious payloads (e.g. `rm -rf /`, reverse shells, or coin miners).
* **Mitigation**:
  1. **Strict Sandboxing**: Never run shell execution tools directly on the production host machine. Wrap execution inside ephemeral, isolated Docker containers or microVMs (e.g., E2B, Firecracker).
  2. **Automatic Expiry**: Enforce strict TTL limits on running commands and sandboxes to prevent zombie processes.
  3. **Resource Constraints**: Throttle container CPU and RAM usage.

### C) File System Path Traversal
* **Vulnerability**: File utility tools (`read_file`, `write_to_file`) could traverse out of the designated project directory (e.g. `path="../../../../etc/passwd"`).
* **Mitigation**:
  1. Implement path sanitization on the server-side to resolve all paths to their absolute location and assert they reside within the designated `WORKSPACE_ROOT`.
  2. Reject any requests attempting path traversal outside the workspace boundary.

### D) Cross-Site Scripting (XSS) & Cross-Site Request Forgery (CSRF)
* **Vulnerability**: If the agent reads an HTML/SVG file containing malicious scripts and renders it in the web dashboard, the scripts could execute in the context of the user's session, stealing authentication tokens.
* **Mitigation**:
  1. Enforce strict content-sanitization (e.g. `DOMPurify`) before rendering any file contents or markdown in the chat components.
  2. Implement safe `Content-Security-Policy` (CSP) headers.
  3. Enforce CSRF protection on the server-side, verifying WebSocket origins and requiring HTTP headers on write operations.

### E) Session Hijacking & WebSocket Authentication
* **Vulnerability**: Unauthorized actors accessing another user's running coding sessions.
* **Mitigation**:
  1. Secure the WebSocket upgrade request (`/browser`).
  2. Issue short-lived JSON Web Tokens (JWT) upon successful authentication.
  3. Require the JWT as a query parameter or token during WebSocket handshakes and validate it before promoting to a connection.

---

## 3. Environment Variable Configurations

To configure and deploy the transformed server securely, configure the following environment variables:

```ini
# --- SERVER HOST & PORT ---
HOST=127.0.0.1                      # Bind host (use 0.0.0.0 to expose on network)
CLINE_HUB_DASHBOARD_PORT=8787       # Port for the server to listen on
PUBLIC_URL=http://localhost:8787    # Publicly accessible URL

# --- SAFETY & SECURITY ---
ROOM_SECRET=your-random-long-secret # Require this secret to join if HOST is non-local
ENCRYPTION_SECRET=your-aes-key-32   # Secret key used to encrypt API credentials in the database
JWT_SECRET=your-jwt-signing-secret  # Signing key for session authorization tokens

# --- PATHS & WORKSPACES ---
WORKSPACE_ROOT=/absolute/path/workspace # Target workspace path for file operations
CLINE_DATA_DIR=/var/data/cline      # Path to store SQLite files and cache

# --- AI PROVIDER FALLBACKS ---
CLINE_PROVIDER=anthropic            # Default LLM Provider (if not specified in session)
CLINE_MODEL=claude-3-5-sonnet       # Default LLM Model
```
