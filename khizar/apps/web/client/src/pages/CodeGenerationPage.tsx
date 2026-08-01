// khizar/apps/web/client/src/pages/CodeGenerationPage.tsx
import React, { useState } from "react";
import { CodeGenerator } from "../components/CodeGeneration/CodeGenerator";
import { CodeEditor } from "../components/CodeGeneration/CodeEditor";
import { CodeChat } from "../components/CodeGeneration/CodeChat";
import { CodeReview } from "../components/CodeGeneration/CodeReview";
import { SparklesIcon, CpuIcon, EyeIcon } from "lucide-react";

export function CodeGenerationPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "editor" | "chat" | "review">("generate");

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-100">Khizar Autonomous AI Engineering</h1>
          <p className="text-sm text-zinc-400">Manage code generation, security validations, and interactive chat editing sessions.</p>
        </div>
        <div className="flex gap-1 bg-zinc-900/40 p-1 rounded-lg border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-3 py-1.5 rounded-md ${activeTab === "generate" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1.5 rounded-md ${activeTab === "editor" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Workspace Editor
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1.5 rounded-md ${activeTab === "chat" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-3 py-1.5 rounded-md ${activeTab === "review" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Audits & Reviews
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "generate" && <CodeGenerator />}
          {activeTab === "editor" && <CodeEditor />}
          {activeTab === "chat" && <CodeChat />}
          {activeTab === "review" && <CodeReview />}
        </div>

        {/* Sidebar Info and Stats */}
        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <CpuIcon className="size-4.5 text-emerald-400" />
              <h3 className="font-bold text-sm">Gemini 2.5 Flash Metrics</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Context Window</span>
                <span>1,048,576 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Max Outputs</span>
                <span>8,192 tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Active Session Status</span>
                <span className="text-emerald-400">Online & Ready</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <EyeIcon className="size-4.5 text-blue-400" />
              <h3 className="font-bold text-sm">Security Guard Status</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Khizar sandboxed environment actively screens command parameters. All write operations require authorization verification. Path-traversal is strictly blocked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CodeGenerationPage;
