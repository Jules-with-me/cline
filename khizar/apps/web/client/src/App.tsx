// khizar/apps/web/client/src/App.tsx
import React, { useState } from "react";
import {
  BotIcon,
  SettingsIcon,
  MessageSquareIcon,
  ClockIcon,
  PlusIcon,
  SendIcon,
  ShieldAlertIcon,
  LogOutIcon,
  SparklesIcon
} from "lucide-react";
import { CodeGenerationPage } from "./pages/CodeGenerationPage";

export default function App() {
  const [messages, setMessages] = useState<any[]>([
    { id: "1", role: "assistant", text: "Hello, I am Khizar, your standalone web-based AI coding agent. Let me help you build, test, and write high-quality code in safety isolated workspaces." }
  ]);
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState("Connected to Khizar API");
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeView, setActiveView] = useState<"chat" | "codegen">("chat");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8787/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        setStatus(`Welcome, ${data.user.email}`);
      } else {
        alert(data.error || "Login failed");
      }
    } catch {
      alert("Authentication server unreachable. Running offline mock mode.");
      setIsAuthenticated(true);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate Khizar streaming response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: `[Khizar] Executing secure task: "${userMsg.text}". All file system executions are restricted to authorized directories. Pre-commit compilation checks completed.`
      }]);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-400">Khizar</h1>
            <p className="mt-2 text-sm text-zinc-400">Standalone Web-Based AI Coding Agent</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500"
                placeholder="developer@khizar.ai"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 active:scale-[0.98] transition-all"
            >
              Sign In to Web Workspace
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-[16rem_minmax(0,1fr)] bg-zinc-950 text-zinc-100">
      {/* Sidebar Navigation */}
      <aside className="flex flex-col border-r border-zinc-800 bg-zinc-900/30 p-4">
        <div className="mb-6 flex items-center gap-2">
          <BotIcon className="size-6 text-emerald-400" />
          <span className="text-xl font-black tracking-tight text-zinc-50">Khizar</span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">v1.0</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveView("chat")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
              activeView === "chat" ? "bg-zinc-800/50 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
            }`}
          >
            <MessageSquareIcon className="size-4" />
            <span>Chat Session</span>
          </button>
          <button
            onClick={() => setActiveView("codegen")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
              activeView === "codegen" ? "bg-zinc-800/50 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
            }`}
          >
            <SparklesIcon className="size-4" />
            <span>AI Code Engineering</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200">
            <ClockIcon className="size-4" />
            <span>Session Logs</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200">
            <SettingsIcon className="size-4" />
            <span>Core Settings</span>
          </button>
        </nav>

        <div className="border-t border-zinc-800/80 pt-4">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10"
          >
            <LogOutIcon className="size-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-6 bg-zinc-900/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-400">{status}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-mono">
            <ShieldAlertIcon className="size-3.5" />
            <span>Workspace Sandbox Mode</span>
          </div>
        </header>

        {activeView === "codegen" ? (
          <CodeGenerationPage />
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Messages Stream */}
            <section className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex max-w-[85%] flex-col rounded-lg p-4 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-emerald-500 text-zinc-950 font-medium"
                      : "mr-auto border border-zinc-850 bg-zinc-900/50 text-zinc-100"
                  }`}
                >
                  <span className="mb-1 block text-[10px] uppercase font-bold tracking-wider opacity-60">
                    {m.role === "user" ? "Developer" : "Khizar Agent"}
                  </span>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              ))}
            </section>

            {/* Prompt Input Area */}
            <footer className="border-t border-zinc-850 p-4 bg-zinc-900/10 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Ask Khizar to build, test, and write code securely..."
                  className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSend}
                  className="flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
                >
                  <SendIcon className="size-4" />
                  <span>Send</span>
                </button>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
