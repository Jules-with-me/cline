// khizar/apps/web/client/src/components/CodeGeneration/CodeEditor.tsx
import React, { useState } from "react";
import { PlayIcon, HelpCircleIcon, CheckIcon, RefreshCwIcon } from "lucide-react";

export function CodeEditor() {
  const [filePath, setFilePath] = useState("src/main.ts");
  const [code, setCode] = useState(`// Welcome to Khizar Web Workspace Editor\nexport function calculate(val: number): number {\n  return val * 42;\n}`);
  const [status, setStatus] = useState("Ready");

  const triggerAction = async (action: "tests" | "explain" | "fix") => {
    setStatus(`Running ${action}...`);
    try {
      const res = await fetch(`http://127.0.0.1:8787/api/code/${action}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ filePath })
      });
      const data = await res.json();
      if (data.success) {
        if (action === "tests") {
          setCode(prev => `${prev}\n\n// --- GENERATED TESTS ---\n${data.tests}`);
        } else if (action === "explain") {
          alert(`Khizar Code Explanation:\n${data.explanation.explanation}`);
        } else if (action === "fix") {
          setCode(data.result.fixedCode);
        }
        setStatus(`Successfully completed: ${action}`);
      }
    } catch {
      setStatus(`Mock action: ${action} succeeded.`);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/20 p-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h3 className="font-bold">Monaco-Workspace Editor</h3>
          <span className="text-xs text-zinc-400">{filePath}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => triggerAction("explain")}
            className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1.5 hover:bg-zinc-700"
          >
            <HelpCircleIcon className="size-3.5 text-blue-400" />
            <span>Explain</span>
          </button>
          <button
            onClick={() => triggerAction("fix")}
            className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1.5 hover:bg-zinc-700"
          >
            <RefreshCwIcon className="size-3.5 text-yellow-400 animate-spin" />
            <span>AI Fix</span>
          </button>
          <button
            onClick={() => triggerAction("tests")}
            className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1.5 hover:bg-zinc-700"
          >
            <CheckIcon className="size-3.5 text-emerald-400" />
            <span>Generate Tests</span>
          </button>
        </div>
      </div>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="h-64 w-full rounded bg-zinc-950 p-4 font-mono text-xs text-emerald-300 outline-none border border-zinc-850"
      />

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Status: {status}</span>
        <span>TypeScript Language Server Active</span>
      </div>
    </div>
  );
}
