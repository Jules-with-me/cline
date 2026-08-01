// khizar/apps/web/client/src/components/CodeGeneration/CodeReview.tsx
import React, { useState } from "react";
import { CheckCircleIcon, XCircleIcon, ShieldAlertIcon } from "lucide-react";

export function CodeReview() {
  const [reviews, setReviews] = useState([
    { id: "1", title: "Add Input Sanitization", file: "src/server.ts", severity: "high", accepted: null },
    { id: "2", title: "Add missing semicolon", file: "src/main.ts", severity: "low", accepted: null }
  ]);

  const handleDecision = (id: string, decision: boolean) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, accepted: decision } : r));
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/20 p-6">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <ShieldAlertIcon className="size-5 text-red-400" />
        <h3 className="font-bold">Automated Security & Code Review</h3>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded bg-zinc-950 p-4 border border-zinc-900 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{r.title}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  r.severity === "high" ? "bg-red-500/10 text-red-400" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {r.severity}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">{r.file}</span>
            </div>

            <div className="flex gap-2">
              {r.accepted === null ? (
                <>
                  <button
                    onClick={() => handleDecision(r.id, false)}
                    className="flex items-center gap-1 rounded bg-rose-500/10 px-2.5 py-1 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                  >
                    <XCircleIcon className="size-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleDecision(r.id, true)}
                    className="flex items-center gap-1 rounded bg-emerald-500/10 px-2.5 py-1 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                  >
                    <CheckCircleIcon className="size-3.5" />
                    <span>Apply</span>
                  </button>
                </>
              ) : (
                <span className={`font-bold ${r.accepted ? "text-emerald-400" : "text-rose-400"}`}>
                  {r.accepted ? "Applied" : "Rejected"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
