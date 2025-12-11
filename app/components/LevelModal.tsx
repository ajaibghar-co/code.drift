"use client";

import React from "react";
import Card from "../components/Card"; // adjust path if needed
import { PairOption } from "../components/snippetsTypes";

type LevelModalProps = {
  isOpen: boolean;
  level: number | null;
  options: PairOption[];
  flipped: Record<number, boolean>;
  selected: number | null;
  onToggleFlip: (idx: number) => void;
  onSelect: (idx: number) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LevelModal({
  isOpen,
  level,
  options,
  flipped,
  selected,
  onToggleFlip,
  onSelect,
  onClose,
  onConfirm,
}: LevelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-60 w-full max-w-3xl mx-4 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border p-6">

          {/* 🔵 PNG TITLE BAR (centered) */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 flex justify-center">
              <img
                src="/code_snippets/modal_title.png"
                alt="Modal Title"
                className="h-12 object-contain"
              />
            </div>

            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 p-2 rounded"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* GRID OF OPTIONS */}
          <div className="grid grid-cols-3 gap-4">
            {options.map((opt, idx) => {
              const isFlipped = !!flipped[idx];
              const isActive = selected === idx;

              return (
                <div
                  key={`opt-${idx}`}
                >
     

                  <div onClick={() => onSelect(idx)} style={{ height: 160 }}>
                    <Card
                      audio={opt.audio ?? null}
                      visual={opt.visual ?? null}
                      isFlipped={isFlipped}
                      onToggleFlip={() => onToggleFlip(idx)}
                      onSelect={() => onSelect(idx)}
                      isSelected={isActive}
                      height={160}
                      showFlipIcon
                    />
                  </div>

                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none"
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border bg-white"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-[#0066FF] text-white"
              disabled={selected == null}
            >
              OK
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
