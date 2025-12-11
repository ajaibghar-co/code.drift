"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function IrregularModal({ open, onClose }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // create modal root if it doesn't exist (safe fallback)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
  }, []);

  if (!open || typeof window === "undefined") return null;

  const modalContent = (
    <div
      aria-hidden={!open}
      // extreme z-index so nothing on the page overlaps it
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2147483647, // largest safe int-ish value to outrank everything
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 2147483647, // same base - below the panel
        }}
      />

      {/* Panel wrapper */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          zIndex: 2147483648, // panel above backdrop
          width: "min(920px, 92%)",
          maxWidth: "920px",
        }}
        className={`${inter.variable} font-sans`}
      >
        <div
          style={{
            backgroundColor: "#AA2E5C",
            color: "#D4C36A",
            padding: "2rem",
            borderRadius: "36px 52px 44px 32px / 30px 48px 56px 36px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>The Actual Gear 💻📱</h2>
            <button
              onClick={onClose}
              style={{
                color: "#D4C36A",
                fontSize: 20,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div style={{ marginTop: 12, lineHeight: 1.6, whiteSpace: "normal", fontSize: 14 }}>
          <div style={{ marginTop: 12, lineHeight: 1.6, whiteSpace: "normal", fontSize: 14 }}>
  <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>

    {/* SYSTEM REQUIREMENTS */}
    <section>
      <h3 style={{ margin: 0, marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
        System Requirements
      </h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>Bring a laptop (Windows 10+ or macOS 11+). Prefer models from 2018+ and have Chrome updated.</li>
        <li>Ensure the laptop’s built-in microphone works.</li>
        <li>Headphones / earphones (recommended).</li>
      </ul>
    </section>

    {/* P5JS / P5LIVE */}
    <section>
      <h3 style={{ margin: 0, marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
        p5.js (Visuals)
      </h3>

      <p style={{ margin: 0, marginBottom: 6 }}>
        We'll use{" "}
        <a
          href="https://teddavis.org/p5live/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#D4C36A", textDecoration: "underline" }}
        >
          p5Live
        </a>{" "}
        — a collaborative live-coding VJ environment built on p5.js. It's web-based (no download).  
        Make sure you have the latest Google Chrome.
      </p>
    </section>

    {/* SONIC PI */}
    <section>
      <h3 style={{ margin: 0, marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
        Sonic Pi (Sound & Music)
      </h3>

      <p style={{ margin: 0, marginBottom: 6 }}>
        <a
          href="https://sonic-pi.net/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#D4C36A", textDecoration: "underline" }}
        >
          Sonic Pi
        </a>{" "}
        is a free, code-based music creation & performance tool.  
        Download and install before the workshop if you want to run sounds locally.
      </p>
    </section>

    {/* OTHER SOFTWARES */}
    <section>
      <h3 style={{ margin: 0, marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
        Other Softwares
      </h3>

      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li><strong>Windows:</strong> Audacity for basic trimming (free).</li>
        <li><strong>macOS:</strong> GarageBand & QuickTime (already included).</li>
        <li>Make space on your smartphone for photos & audio snippets (recommended recorder: Dolby On).</li>
      </ul>
    </section>

  </div>
</div>

</div>


          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(212,195,106,0.4)",
                background: "transparent",
                color: "#D4C36A",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const root = document.getElementById("modal-root")!;
  return createPortal(modalContent, root);
}
