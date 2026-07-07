"use client";

import { useState } from "react";

const required = ["tree_id", "farm_code", "field_code", "latitude", "longitude", "health_status", "disease_stage", "confidence"];

export function UploadValidator({ type }: { type: "tree-data" | "drone-images" | "predictions" }) {
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <h2 className="text-lg font-semibold">Prototype {type.replace("-", " ")} upload</h2>
        <p className="text-sm text-muted-foreground">Validates client-side only; Supabase storage is intentionally mocked.</p>
      </div>
      <input
        type="file"
        accept={type === "drone-images" ? "image/*" : ".csv,.json,application/json,text/csv"}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const next: string[] = [];
          if (file.size === 0) next.push("File is empty.");
          if (file.size > 10 * 1024 * 1024) next.push("File is over the 10 MB prototype limit.");
          if (type === "drone-images" && !file.type.startsWith("image/")) next.push("Drone uploads must be image files.");
          if (type !== "drone-images") {
            const text = await file.text();
            const header = text.trim().startsWith("[") ? Object.keys(JSON.parse(text)[0] ?? {}) : text.split(/\r?\n/)[0]?.split(",").map((item) => item.trim());
            const missing = required.filter((field) => !header.includes(field));
            if (missing.length) next.push(`Missing required columns: ${missing.join(", ")}.`);
            if (/latitude,\s*longitude/.test(text) && /999/.test(text)) next.push("Latitude/longitude values look invalid.");
          }
          if (next.length === 0) next.push("Validation passed. Prototype sync would update map, grid, dashboards, and history.");
          setMessages(next);
        }}
      />
      <ul className="space-y-2 text-sm">
        {messages.map((message) => <li key={message} className="rounded-md bg-muted px-3 py-2">{message}</li>)}
      </ul>
    </div>
  );
}
