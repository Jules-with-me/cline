# Khizar: Standalone Web-Based Agent Local PC Usage Guide

This guide describes how to configure, run, and develop the standalone **Khizar** web-based AI coding agent on your **local PC / laptop**.

---

## 💻 Local PC Quick Start

### Prerequisites
* **Bun Runtime (Required)**: Bun is the primary package manager and execution environment.
  * Install on Mac/Linux: `curl -fsSL https://bun.sh/install | bash`
  * Install on Windows (PowerShell): `powershell -c "irm bun.sh/install.ps1 | iex"`
* **Google Gemini API Key**: Get a free API key from Google AI Studio to power the Gemini 2.5 Flash model.

---

## 🛠️ Step-by-Step Setup

### Step 1: Clone and Navigate to the Workspace
Open your terminal and navigate to the `khizar` project directory:

```bash
cd khizar
```

### Step 2: Install Workspace Packages
Before running the backend, resolve workspace package configurations by executing `bun install` in the root `khizar` workspace directory:

```bash
bun install
```

### Step 3: Configure Environment Variables
Copy the template `.env.template` file to a new `.env` file:

```bash
cp .env.template .env
```

Open `.env` in your text editor and fill in your Gemini API key:
```ini
# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyYourActualGeminiAPIKeyHere
GEMINI_MODEL=gemini-2.5-flash
```

### Step 4: Run the Web Backend Server
Start the high-performance Bun-based REST & WebSocket backend server on your local PC:

```bash
bun run apps/web/server/src/server.ts
```

The terminal will print:
`Khizar standalone web server running at: http://127.0.0.1:8787`

The server is now listening for incoming HTTP requests (auth/code-generation) and real-time WebSocket streams on port `8787`!

*Note: Server modules leverage safe relative imports to guarantee direct execution on any workspace environment.*

### Step 5: Launch the React Frontend Client
To launch the React SPA client locally, open a second terminal window and run:

```bash
# Navigate to client and install dependencies
cd apps/web/client
bun install

# Start local React Vite dev server
bun run dev
```

Open your browser and navigate to the local React dev server URL printed in the console (usually `http://localhost:5173`).

---

## 🧠 Interactive AI Code Workspace Features

Once logged in locally (use any credentials during mock mode), you can select **AI Code Engineering** in the left sidebar:
1. **Autonomous Code Generator**: Input natural language instructions, select your language, set the temperature, and click "Generate Autonomous Code".
2. **Workspace Editor**: View and modify file paths, and trigger instant code actions like "Explain Code", "AI Fix", and "Generate Tests".
3. **Iterative Code Chat**: Refine your generated functions in an interactive code conversation panel.
4. **Audits & Reviews**: Review security recommendations and apply optimizations with a single click.
