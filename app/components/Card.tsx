// components/Card.tsx
"use client";

import React from "react";

type SnippetFlat = {
  id: string;
  title: string;
  level: number | null;
  description: string;
  code: string;
};

type Props = {
  audio?: SnippetFlat | null;
  visual?: SnippetFlat | null;
  isFlipped?: boolean;
  onToggleFlip?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  height?: number | string; // e.g. 140 or "160px"
  showFlipIcon?: boolean; // hide flip icon when not wanted
  className?: string;
};

export default function Card({
  audio,
  visual,
  isFlipped = false,
  onToggleFlip,
  onSelect,
  isSelected = false,
  height = 140,
  showFlipIcon = true,
  className = "",
}: Props) {
  const frontLabel = audio ? "AUDIO" : "AUDIO (empty)";
  const backLabel = visual ? "VISUAL" : "VISUAL (empty)";

  return (
    <div className={`pair-card ${isFlipped ? "flipped" : ""} ${className}`} style={{ width: "100%", height }}>
      {showFlipIcon && (
        <button
          title="Flip"
          className="flip-icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFlip?.();
          }}
        >
          ↺
        </button>
      )}

      <div
        className="pair-card-inner"
        onClick={() => {
          onSelect?.();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect?.();
        }}
        style={{ cursor: onSelect ? "pointer" : "default" }}
      >
        {/* front */}
        <div
          className="pair-card-face front"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
          }}
        >
          <div>
            <div className="text-xs text-slate-400 mb-1">{frontLabel}</div>
            <div className="text-sm font-semibold">{audio?.title ?? "—"}</div>
            <div className="text-xs text-slate-500 mt-2 line-clamp-3">{audio?.description ?? ""}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">#{audio?.id ?? "-"}</div>
            <div className="text-xs text-slate-500">{audio?.level != null ? `Level ${audio.level}` : ""}</div>
          </div>
        </div>

        {/* back */}
        <div
          className="pair-card-face back"
          style={{
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
          }}
        >
          <div>
            <div className="text-xs text-slate-400 mb-1">{backLabel}</div>
            <div className="text-sm font-semibold">{visual?.title ?? "—"}</div>
            <div className="text-xs text-slate-500 mt-2 line-clamp-3">{visual?.description ?? ""}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">#{visual?.id ?? "-"}</div>
            <div className="text-xs text-slate-500">{visual?.level != null ? `Level ${visual.level}` : ""}</div>
          </div>
        </div>
      </div>

      {/* selected overlay */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: 8,
            boxShadow: "inset 0 0 0 3px rgba(255,209,0,0.14)",
          }}
        />
      )}
    </div>
  );
}
