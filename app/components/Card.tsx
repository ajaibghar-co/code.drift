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
  height?: number | string; 
  showFlipIcon?: boolean;
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

  // color rules ✨
  const isAudioSide = !isFlipped;

  const bgColor = isAudioSide ? "#D4C36A" : "#AA2E5C";
  const textColor = isAudioSide ? "#164938" : "#D4C36A";

  const frontLabel = audio ? "AUDIO" : "AUDIO (empty)";
  const backLabel = visual ? "VISUAL" : "VISUAL (empty)";

  return (
    <div
      className={`pair-card ${isFlipped ? "flipped" : ""} ${className}`}
      style={{ width: "100%", height }}
    >
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
        onClick={() => onSelect?.()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect?.();
        }}
        style={{ cursor: onSelect ? "pointer" : "default" }}
      >
        {/* FRONT — AUDIO */}
        <div
          className="pair-card-face front"
          style={{
            background: bgColor,
            color: textColor,
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div className="text-xs mb-1" style={{ opacity: 0.7 }}>
              {frontLabel}
            </div>
            <div className="text-sm font-semibold">{audio?.title ?? "—"}</div>
            <div className="text-xs mt-2 line-clamp-3" style={{ opacity: 0.8 }}>
              {audio?.description ?? ""}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs" style={{ opacity: 0.7 }}>
            <div>#{audio?.id ?? "-"}</div>
            <div>{audio?.level != null ? `Level ${audio.level}` : ""}</div>
          </div>
        </div>

        {/* BACK — VISUAL */}
        <div
          className="pair-card-face back"
          style={{
            background: bgColor,
            color: textColor,
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div className="text-xs mb-1" style={{ opacity: 0.7 }}>
              {backLabel}
            </div>
            <div className="text-sm font-semibold">{visual?.title ?? "—"}</div>
            <div className="text-xs mt-2 line-clamp-3" style={{ opacity: 0.8 }}>
              {visual?.description ?? ""}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs" style={{ opacity: 0.7 }}>
            <div>#{visual?.id ?? "-"}</div>
            <div>{visual?.level != null ? `Level ${visual.level}` : ""}</div>
          </div>
        </div>
      </div>

      {/* SELECTED OUTLINE */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: 8,
            boxShadow: "inset 0 0 0 3px rgba(255,209,0,0.25)",
          }}
        />
      )}
    </div>
  );
}
