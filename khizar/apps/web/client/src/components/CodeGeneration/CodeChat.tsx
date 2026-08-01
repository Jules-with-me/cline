// khizar/apps/web/client/src/components/CodeGeneration/CodeChat.tsx
import React, { useState } from "react";
import { MessageSquareIcon, SendIcon, SparklesIcon } from "lucide-react";

export function CodeChat() {
  const [messages, setMessages] = useState<any[]>([
    { id: "1", role: "assistant", text: "Ask me to help explain or refine any of your generated coding files. I can recommend optimizations dynamically." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: `[Khizar Code Assistant] Reviewed instruction: "${input}". Recommend checking exports and adding try-catch error boundary logic to main functions.`
      }]);
    }, 800);
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col h-[400px]">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <MessageSquareIcon className="size-5 text-blue-400" />
        <h3 className="font-bold">Iterative Code Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg p-3 text-xs ${
              m.role === "user" ? "ml-auto bg-zinc-800 text-zinc-100" : "mr-auto bg-zinc-950 border border-zinc-900 text-emerald-400"
            } max-w-[85%]`}
          >
            <p className="whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="E.g., Can you add error handling to this method?"
          className="flex-1 rounded bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleSend}
          className="rounded bg-emerald-500 px-3 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400"
        >
          <SendIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
