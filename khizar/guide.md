# Khizar: Standalone Web-Based Agent Usage & Developer Guide

This guide describes how to configure, run, expand, and deploy the standalone **Khizar** web-based AI coding agent.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Bun Runtime**: Bun is the recommended package manager and execution environment. Install via `curl -fsSL https://bun.sh/install | bash`.
* **Node.js**: Node.js >= 22 (for auxiliary runtime support if needed).

### 1. Installation & Environment Setup
Clone the repository and navigate to the `khizar` workspace directory:

```bash
cd khizar
```

Copy the environment template and configure your secrets:

```bash
cp .env.template .env
```

Open `.env` in your editor and configure your secrets:
```ini
KHIZAR_SERVER_PORT=8787
KHIZAR_JWT_SECRET=your-secure-jwt-secret-signing-key
KHIZAR_ENCRYPTION_SECRET=your-secure-32-char-aes-encryption-key
```

### 2. Launch the Application
Start the independent Bun backend server:

```bash
# Starts the HTTP REST & WebSocket Gateway on port 8787
bun run apps/web/server/src/server.ts
```

The server logs:
`Khizar standalone web server running at: http://127.0.0.1:8787`

---

## 🔧 Integrating Your Database & Sandbox

Khizar is built on modular abstraction boundaries. You can easily plug in your production database and execution sandboxes without editing core orchestrator loops.

### 1. Custom Database Adapter (Postgres / Supabase)
To swap out the mock in-memory store with PostgreSQL (using Drizzle/Prisma), implement the `IDatabaseAdapter` interface defined in `packages/core/src/database/interfaces.ts`:

```typescript
import { IDatabaseAdapter, User, Project } from "@khizar/core";
import { pgPool } from "./db-connection"; // Your pg pool

export class PostgresDatabaseAdapter implements IDatabaseAdapter {
  async getUserById(id: string): Promise<User | null> {
    const res = await pgPool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  }

  // Implement the other remaining database methods...
}
```

Then, initialize your server with the new adapter:
```typescript
// apps/web/server/src/server.ts
const db = new PostgresDatabaseAdapter();
```

### 2. Docker / Secure Execution Sandboxing
By default, the shell executor uses the local OS shell. To isolate commands inside an ephemeral Docker container, implement the `IExecutionDriver` interface:

```typescript
import { IExecutionDriver, ExecResult } from "@khizar/core";
import { exec } from "node:child_process";

export class DockerExecutionDriver implements IExecutionDriver {
  constructor(private readonly containerId: string) {}

  async executeCommand(command: string): Promise<ExecResult> {
    return new Promise((resolve) => {
      exec(`docker exec ${this.containerId} ${command}`, (err, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          exitCode: err ? err.code || 1 : 0
        });
      });
    });
  }

  // Implement compile and pre-commit lint validations...
}
```

---

## 🔒 Security Design Principles

When deploying Khizar as a multi-user SaaS, ensure you follow these security principles:
1. **Never Store Clear-Text Keys**: Enforce encryption (e.g., AES-256-GCM using `KHIZAR_ENCRYPTION_SECRET`) before storing provider keys in your database.
2. **Restrict FS Access**: Always use the `IFileSystemDriver.resolvePath()` validator to assert that files do not traverse outside the user's workspace directory.
3. **Short-Lived JWT Tokens**: Connect web sockets using temporary JWT query strings and validate origins.
