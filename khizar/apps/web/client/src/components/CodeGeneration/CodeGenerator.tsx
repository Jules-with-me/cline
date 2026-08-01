// khizar/apps/web/client/src/components/CodeGeneration/CodeGenerator.tsx
import React, { useState } from "react";
import { SparklesIcon, CopyIcon, SaveIcon, CodeIcon } from "lucide-react";

export function CodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [temperature, setTemperature] = useState(0.7);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("http://127.0.0.1:8787/api/code/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, context: { language, projectPath: "workspace" } })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCode(data.code.code);
      }
    } catch {
      // Mock fallback
      setGeneratedCode(`// Generated ${language} Code for: "${prompt}"\nexport function run() {\n  console.log("Welcome to Khizar Autonomous sandbox!");\n}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-zinc-800 bg-zinc-900/20 p-6">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-5 text-emerald-400" />
        <h2 className="text-lg font-bold">Autonomous Code Generator</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Language</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="mt-2 w-full rounded bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Temperature ({temperature})</label>
          <input
            type="range"
            min="0"
            max="1.2"
            step="0.1"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            className="mt-3 w-full accent-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Prompt / Instructions</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="E.g., Write a secure is_prime validation loop with tests..."
          className="mt-2 h-24 w-full rounded bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded bg-emerald-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
      >
        <CodeIcon className="size-4" />
        <span>{isGenerating ? "Generating..." : "Generate Autonomous Code"}</span>
      </button>

      {generatedCode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase">Generated Output</span>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs hover:bg-zinc-700"
              >
                <CopyIcon className="size-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-4 font-mono text-xs border border-zinc-850 text-emerald-300">
            {generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
