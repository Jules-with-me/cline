# Khizar: Standalone Web-Based AI Coding Agent

Khizar is a standalone, web-based autonomous coding agent environment. This project has been extracted and fully rebranded from Cline, stripping away VS Code and IDE extension dependencies to focus purely on a high-performance browser-based coding workspace.

## Project Structure

```text
khizar/
├── apps/
│   └── web/                   # Main web application
│       ├── server/            # Bun HTTP & WebSocket server
│       ├── client/            # React SPA (Vite, Tailwind, Shadcn)
│       └── public/            # Static assets
├── packages/
│   ├── core/                  # Agent orchestration (from @cline/core)
│   ├── agents/                # Low-level Agent runtime loop (from @cline/agents)
│   ├── llms/                  # Model & vendor integrations (from @cline/llms)
│   └── shared/                # Common types, utilities, and prompts
└── docs/                      # Analysis & documentation
```

## Getting Started

Refer to package-specific READMEs for build, run, and test instructions.
