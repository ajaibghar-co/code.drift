// app/code/page.tsx

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Card from "../components/Card"; // 🔁 adjust path
import LevelModal from "../components/LevelModal";
import {
  RawSnippet,
  SnippetFlat,
  PairOption,
  SnippetPair,
} from "../components/snippetsTypes";

// ---------- Constants & helpers ----------

const HEADER_HEIGHT_PX = 64;
const BOTTOM_HEIGHT_PX = 160;
const PAGE_BG = "#F4E1B8";
const GREEN_ACCENT = "#164938";
const GOLD_ACCENT = "#D4C36A";
const PINK_ACCENT = "#AA2E5C";
const INSTRUCTIONS_ANIMATION_MS = 520;
const INSTRUCTIONS_FILTER_BASE =
  "drop-shadow(0 20px 44px rgba(15, 23, 42, 0.22)) blur(0px) saturate(1) contrast(1)";
const INSTRUCTIONS_FILTER_SINGULARITY =
  "drop-shadow(0 0 32px rgba(15, 23, 42, 0.58)) blur(2.4px) saturate(0.82) contrast(1.08)";

const ORDERED_CODE_KEYS = ["global", "preload", "setup", "draw"] as const;

function flattenCode(raw: RawSnippet): SnippetFlat {
  const c = raw.code ?? {};
  const parts: string[] = [];

  ORDERED_CODE_KEYS.forEach((key) => {
    const v = c[key];
    if (v) parts.push(`// ${key}\n${v}`);
  });

  Object.keys(c)
    .filter((k) => !ORDERED_CODE_KEYS.includes(k as any))
    .sort()
    .forEach((k) => {
      const v = c[k];
      if (v) parts.push(`// ${k}\n${v}`);
    });

  return {
    id: String(raw.id),
    title: raw.title ?? `Snippet ${raw.id}`,
    level: raw.level ?? null,
    description: raw.description ?? "",
    code: parts.join("\n\n"),
    raw,
  };
}

function pickRandom<T>(arr: T[]): T | null {
  if (!arr || arr.length === 0) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function pickNWithoutReplacement<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function createEmptySnippet(prefix: string): SnippetFlat {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `${prefix}-${(crypto as any).randomUUID()}`
      : `${prefix}-${Date.now()}`;

  return {
    id,
    title: "—",
    level: null,
    description: "",
    code: "",
  };
}

// ---------- Main page ----------

export default function CodePage() {
  // layout derived values
  const containerHeight = `calc(100vh - ${HEADER_HEIGHT_PX}px)`;
  const leftMainHeight = `calc(100vh - ${HEADER_HEIGHT_PX}px - ${BOTTOM_HEIGHT_PX}px)`;

  // pools loaded from JSON
  const [audioPool, setAudioPool] = useState<SnippetFlat[]>([]);
  const [visualPool, setVisualPool] = useState<SnippetFlat[]>([]);
  const [loading, setLoading] = useState(true);

  // library of paired snippets
  const [library, setLibrary] = useState<SnippetPair[]>([]);
  const libraryCount = library.length;

  // library selection & UI state
  const [selectedLibraryIndex, setSelectedLibraryIndex] =
    useState<number | null>(null);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  // modal state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [levelModalOptions, setLevelModalOptions] = useState<PairOption[]>([]);
  const [levelModalSelected, setLevelModalSelected] =
    useState<number | null>(null);
  const [activeLevelRequested, setActiveLevelRequested] =
    useState<number | null>(null);
  const [levelModalFlipped, setLevelModalFlipped] = useState<
    Record<number, boolean>
  >({});

  const [copied, setCopied] = useState(false);
  const [copyNoticeVisible, setCopyNoticeVisible] = useState(false);
  const copyNoticeTimerRef = useRef<number | null>(null);
  const copyButtonRef = useRef<HTMLDivElement | null>(null);
  const instructionsCardRef = useRef<HTMLDivElement | null>(null);
  const infoButtonRef = useRef<HTMLButtonElement | null>(null);
  const instructionsTimerRef = useRef<number | null>(null);
  const [copyNoticePosition, setCopyNoticePosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const isMobile = vw <= 640;
  const instructionsModalRadius = isMobile ? 20 : 28;
  const infoButtonSize = isMobile ? 58 : 76;
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [instructionsPhase, setInstructionsPhase] = useState<
    "open" | "opening" | "closing" | "closed"
  >("open");
  const [instructionsTransform, setInstructionsTransform] = useState(
    "translate3d(0, 0, 0) scale(1)"
  );
  const [instructionsOpacity, setInstructionsOpacity] = useState(1);
  const [instructionsBorderRadius, setInstructionsBorderRadius] = useState(
    `${instructionsModalRadius}px`
  );
  const [instructionsFilter, setInstructionsFilter] = useState(
    INSTRUCTIONS_FILTER_BASE
  );
  const [instructionsBackdropOpacity, setInstructionsBackdropOpacity] =
    useState(1);

  const clearInstructionsTimer = useCallback(() => {
    if (instructionsTimerRef.current !== null) {
      window.clearTimeout(instructionsTimerRef.current);
      instructionsTimerRef.current = null;
    }
  }, []);

  const prefersReducedMotion = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const getInstructionsTarget = useCallback(() => {
    const cardRect = instructionsCardRef.current?.getBoundingClientRect();
    const infoRect = infoButtonRef.current?.getBoundingClientRect();

    if (!cardRect || !infoRect) {
      return { x: 0, y: 0, scale: 0.16 };
    }

    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const infoCenterX = infoRect.left + infoRect.width / 2;
    const infoCenterY = infoRect.top + infoRect.height / 2;
    const scale = Math.max(
      0.14,
      Math.min(
        infoRect.width / cardRect.width,
        infoRect.height / cardRect.height
      )
    );

    return {
      x: infoCenterX - cardCenterX,
      y: infoCenterY - cardCenterY,
      scale,
    };
  }, []);

  const buildSingularityTransform = useCallback(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      const squeezeX = Math.max(scale * 0.5, 0.085);
      const squeezeY = Math.max(scale * 0.04, 0.018);
      const driftX = x + (x >= 0 ? 28 : -28);
      const driftY = y + (y >= 0 ? -20 : 20);

      return `translate3d(${driftX}px, ${driftY}px, 0) rotate(17deg) skew(-26deg, 9deg) scale(${squeezeX}, ${squeezeY})`;
    },
    []
  );

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setInstructionsBorderRadius(`${instructionsModalRadius}px`);
  }, [instructionsModalRadius]);

  useEffect(() => {
    return () => clearInstructionsTimer();
  }, [clearInstructionsTimer]);

  // -------- data load --------
  useEffect(() => {
    let mounted = true;

    async function loadPools() {
      setLoading(true);
      try {
        const [audR, visR] = await Promise.all([
          fetch("/code_snippets/audio.json"),
          fetch("/code_snippets/visual.json"),
        ]);

        const audJson = (await audR.json()) as RawSnippet[];
        const visJson = (await visR.json()) as RawSnippet[];

        if (!mounted) return;

        setAudioPool(audJson.map(flattenCode));
        setVisualPool(visJson.map(flattenCode));

        setLibrary([]);
        setSelectedLibraryIndex(null);
        setFlipped({});
      } catch (e) {
        console.error("Failed to load snippets", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPools();
    return () => {
      mounted = false;
    };
  }, []);

  // -------- derived selected pair + side --------

  const selectedPair =
    selectedLibraryIndex != null ? library[selectedLibraryIndex] : null;
  const selectedAudio = selectedPair?.audio ?? null;
  const selectedVisual = selectedPair?.visual ?? null;

  // source of truth: flipped state
  const selectedIsFlipped =
    selectedLibraryIndex != null ? !!flipped[selectedLibraryIndex] : false;
  const activeSide: "audio" | "visual" = selectedIsFlipped ? "visual" : "audio";

  // -------- handlers --------

  const toggleFlipLib = (idx: number) => {
    setFlipped((s) => ({ ...s, [idx]: !s[idx] }));
  };

  const updateCopyNoticePosition = useCallback(() => {
    const anchor = copyButtonRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();

    setCopyNoticePosition({
      left: rect.left + rect.width / 2,
      top: Math.max(120, rect.top - 18),
    });
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    const content = text ?? "";

    const showNotice = () => {
      updateCopyNoticePosition();
      window.requestAnimationFrame(updateCopyNoticePosition);
      setCopied(true);
      setCopyNoticeVisible(true);

      if (copyNoticeTimerRef.current) {
        window.clearTimeout(copyNoticeTimerRef.current);
      }

      copyNoticeTimerRef.current = window.setTimeout(() => {
        setCopyNoticeVisible(false);
        copyNoticeTimerRef.current = null;
      }, 4000);

      window.setTimeout(() => setCopied(false), 200);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
        showNotice();
        return;
      }
    } catch {}

    try {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showNotice();
    } catch {
      console.log("Copy failed");
    }
  }, [updateCopyNoticePosition]);

  useEffect(() => {
    if (!copyNoticeVisible) return;

    const repositionNotice = () => {
      updateCopyNoticePosition();
    };

    window.addEventListener("resize", repositionNotice);
    window.addEventListener("scroll", repositionNotice, true);

    return () => {
      window.removeEventListener("resize", repositionNotice);
      window.removeEventListener("scroll", repositionNotice, true);
    };
  }, [copyNoticeVisible, updateCopyNoticePosition]);

  useEffect(() => {
    return () => {
      if (copyNoticeTimerRef.current) {
        window.clearTimeout(copyNoticeTimerRef.current);
      }
    };
  }, []);

  const resetInstructionsState = useCallback(() => {
    setInstructionsTransform("translate3d(0, 0, 0) scale(1)");
    setInstructionsOpacity(1);
    setInstructionsBackdropOpacity(1);
    setInstructionsBorderRadius(`${instructionsModalRadius}px`);
    setInstructionsFilter(INSTRUCTIONS_FILTER_BASE);
  }, [instructionsModalRadius]);

  const finishClosingInstructions = useCallback(() => {
    setInstructionsVisible(false);
    setInstructionsPhase("closed");
    resetInstructionsState();
    instructionsTimerRef.current = null;
  }, [resetInstructionsState]);

  const closeInstructions = useCallback(() => {
    if (!instructionsVisible || instructionsPhase === "closing") {
      return;
    }

    clearInstructionsTimer();

    if (prefersReducedMotion()) {
      finishClosingInstructions();
      return;
    }

    const singularityTransform = buildSingularityTransform(
      getInstructionsTarget()
    );

    setInstructionsPhase("closing");
    setInstructionsTransform(singularityTransform);
    setInstructionsOpacity(0.1);
    setInstructionsBackdropOpacity(0);
    setInstructionsBorderRadius("999px");
    setInstructionsFilter(INSTRUCTIONS_FILTER_SINGULARITY);

    instructionsTimerRef.current = window.setTimeout(
      finishClosingInstructions,
      INSTRUCTIONS_ANIMATION_MS
    );
  }, [
    buildSingularityTransform,
    clearInstructionsTimer,
    finishClosingInstructions,
    getInstructionsTarget,
    instructionsPhase,
    instructionsVisible,
    prefersReducedMotion,
  ]);

  const openInstructions = useCallback(() => {
    if (instructionsVisible) {
      return;
    }

    clearInstructionsTimer();
    setInstructionsTransform("translate3d(0, 0, 0) scale(0.18)");
    setInstructionsOpacity(0);
    setInstructionsBackdropOpacity(0);
    setInstructionsBorderRadius("999px");
    setInstructionsFilter(INSTRUCTIONS_FILTER_SINGULARITY);
    setInstructionsVisible(true);
    setInstructionsPhase("opening");
  }, [clearInstructionsTimer, instructionsVisible]);

  useEffect(() => {
    if (!instructionsVisible) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInstructions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeInstructions, instructionsVisible]);

  useEffect(() => {
    if (!instructionsVisible || instructionsPhase !== "opening") {
      return;
    }

    clearInstructionsTimer();

    if (prefersReducedMotion()) {
      resetInstructionsState();
      setInstructionsPhase("open");
      return;
    }

    const singularityTransform = buildSingularityTransform(
      getInstructionsTarget()
    );

    setInstructionsTransform(singularityTransform);
    setInstructionsOpacity(0.1);
    setInstructionsBackdropOpacity(0);
    setInstructionsBorderRadius("999px");
    setInstructionsFilter(INSTRUCTIONS_FILTER_SINGULARITY);

    const frame = window.requestAnimationFrame(() => {
      resetInstructionsState();
    });

    instructionsTimerRef.current = window.setTimeout(() => {
      setInstructionsPhase("open");
      instructionsTimerRef.current = null;
    }, INSTRUCTIONS_ANIMATION_MS);

    return () => window.cancelAnimationFrame(frame);
  }, [
    buildSingularityTransform,
    clearInstructionsTimer,
    getInstructionsTarget,
    instructionsPhase,
    instructionsVisible,
    prefersReducedMotion,
    resetInstructionsState,
  ]);

  const openLevelModal = (level: number) => {
    const audioMatches = audioPool.filter((a) => a.level === level);
    const visualMatches = visualPool.filter((v) => v.level === level);

    const audCandidates = audioMatches.length ? audioMatches : audioPool;
    const visCandidates = visualMatches.length ? visualMatches : visualPool;

    if (audCandidates.length === 0 && visCandidates.length === 0) {
      const emptyChoices: PairOption[] = Array.from({ length: 3 }).map(
        () => ({
          audio: null,
          visual: null,
        })
      );
      setLevelModalOptions(emptyChoices);
      setLevelModalSelected(null);
      setActiveLevelRequested(level);
      setLevelModalFlipped({});
      setIsLevelModalOpen(true);
      return;
    }

    const audPicked = pickNWithoutReplacement(audCandidates, 3);
    const visPicked = pickNWithoutReplacement(visCandidates, 3);

    const choices: PairOption[] = [];
    for (let i = 0; i < 3; i++) {
      const audioChoice =
        audPicked[i] ??
        (audioMatches.length
          ? pickRandom(audioMatches)
          : pickRandom(audioPool)) ??
        null;

      const visualChoice =
        visPicked[i] ??
        (visualMatches.length
          ? pickRandom(visualMatches)
          : pickRandom(visualPool)) ??
        null;

      choices.push({ audio: audioChoice, visual: visualChoice });
    }

    const finalChoices = choices.filter((c) => c.audio || c.visual);
    const ensureChoices =
      finalChoices.length > 0
        ? finalChoices
        : [
            {
              audio: pickRandom(audioPool),
              visual: pickRandom(visualPool),
            },
          ];

    const shuffled = pickNWithoutReplacement(
      ensureChoices,
      Math.min(ensureChoices.length, 3)
    );

    setLevelModalOptions(shuffled);
    setLevelModalSelected(null);
    setActiveLevelRequested(level);
    setLevelModalFlipped({});
    setIsLevelModalOpen(true);
  };

  const closeLevelModal = useCallback(() => {
    setIsLevelModalOpen(false);
    setLevelModalOptions([]);
    setLevelModalSelected(null);
    setActiveLevelRequested(null);
    setLevelModalFlipped({});
  }, []);

  const confirmLevelSelection = () => {
    if (levelModalSelected == null) return;
    const chosen = levelModalOptions[levelModalSelected];

    const newPair: SnippetPair = {
      audio: chosen.audio ?? createEmptySnippet("a-none"),
      visual: chosen.visual ?? createEmptySnippet("v-none"),
    };

    setLibrary((prev) => {
      const next = [...prev, newPair];
      const newIndex = next.length - 1;

      // preserve the flip state from the modal
      setSelectedLibraryIndex(newIndex);
      setFlipped((f) => ({ ...f, [newIndex]: levelModalFlipped[levelModalSelected] ?? false }));

      return next;
    });

    closeLevelModal();
  };

  // close modal on Escape
  useEffect(() => {
    if (!isLevelModalOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLevelModal();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLevelModalOpen, closeLevelModal]);

  const copyNoticeOverlay =
    typeof document !== "undefined" && copyNoticePosition
      ? createPortal(
          <div
            className={`pointer-events-none fixed z-[9999] flex items-center justify-center border px-6 py-2 text-center text-sm font-medium leading-5 shadow-[0_10px_28px_rgba(22,73,56,0.18)] transition-opacity duration-700 ${
              copyNoticeVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: PINK_ACCENT,
              borderColor: GREEN_ACCENT,
              color: GOLD_ACCENT,
              width: "min(340px, calc(100vw - 32px))",
              minHeight: "60px",
              left: copyNoticePosition.left,
              top: copyNoticePosition.top,
              borderRadius: "999px 999px 940px 940px",
              transform: "translate(-50%, -100%) rotate(-2deg)",
            }}
          >
            Remember to paste this into a new sketch
          </div>,
          document.body
        )
      : null;
  const showInfoButton =
    !instructionsVisible || instructionsPhase === "closing";
  const infoAnchorInset = (isMobile ? 16 : 24) + infoButtonSize / 2;
  const instructionsTransition =
    instructionsPhase === "opening" || instructionsPhase === "closing"
      ? `transform ${INSTRUCTIONS_ANIMATION_MS}ms cubic-bezier(0.12, 0.88, 0.16, 1), opacity ${Math.round(
          INSTRUCTIONS_ANIMATION_MS * 0.75
        )}ms ease, border-radius ${INSTRUCTIONS_ANIMATION_MS}ms cubic-bezier(0.12, 0.88, 0.16, 1), filter ${Math.round(
          INSTRUCTIONS_ANIMATION_MS * 0.82
        )}ms ease`
      : undefined;
  const backdropTransition =
    instructionsPhase === "opening" || instructionsPhase === "closing"
      ? `opacity ${Math.round(INSTRUCTIONS_ANIMATION_MS * 0.72)}ms ease`
      : undefined;
  const singularityBackdrop =
    instructionsPhase === "opening" || instructionsPhase === "closing"
      ? `radial-gradient(circle at calc(100% - ${infoAnchorInset}px) ${infoAnchorInset}px, rgba(8, 8, 14, 0.96) 0 18px, rgba(18, 18, 28, 0.88) 18px, rgba(22, 24, 38, 0.72) 42px, rgba(15, 23, 42, 0.38) 110px, rgba(15, 23, 42, 0.2) 180px, rgba(15, 23, 42, 0.16) 100%)`
      : "rgba(15, 23, 42, 0.28)";

  // -------- render --------

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: PAGE_BG }}
      >
        Loading snippets...
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{ background: PAGE_BG }}
    >
      <style>{`
        .pair-card { perspective: 900px; position: relative; }
        .pair-card-inner { width: 100%; height: 100%; transition: transform 420ms cubic-bezier(.2,.9,.2,1); transform-style: preserve-3d; position: relative; }
        .pair-card.flipped .pair-card-inner { transform: rotateY(180deg); }
        .pair-card-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 12px; box-sizing: border-box; border-radius: 10px; }
        .pair-card-face.back { transform: rotateY(180deg); }
        .flip-icon { position: absolute; right: 8px; top: 8px; z-index: 30; background: rgba(255,255,255,0.95); border-radius: 6px; padding: 6px; border: 1px solid rgba(0,0,0,0.06); }
        .modal-flip-icon { position: absolute; right: 8px; top: 8px; z-index: 10; background: rgba(255,255,255,0.95); border-radius: 6px; padding: 6px; border: 1px solid rgba(0,0,0,0.06); }
        .copy-glow { box-shadow: 0 0 12px rgba(255, 255, 255, 0.7); }
        .copy-glow-off { box-shadow: none; }
        .floating-info-btn { transition: opacity 220ms ease, transform 220ms ease, filter 220ms ease; }
        .floating-info-btn:hover { transform: translateY(-4px) scale(1.04); }
      `}</style>

      <button
        ref={infoButtonRef}
        type="button"
        aria-label="Open instructions"
        onClick={openInstructions}
        className="floating-info-btn"
        style={{
          position: "fixed",
          top: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 10030,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: instructionsVisible ? "default" : "pointer",
          opacity: showInfoButton ? 1 : 0,
          transform: showInfoButton
            ? instructionsPhase === "closing"
              ? "translate3d(0, 0, 0) scale(1.14)"
              : "translate3d(0, 0, 0) scale(1)"
            : "translate3d(0, -10px, 0) scale(0.72)",
          filter:
            instructionsPhase === "closing"
              ? "drop-shadow(0 0 16px rgba(8, 8, 14, 0.56))"
              : "none",
          pointerEvents: instructionsVisible ? "none" : "auto",
        }}
      >
        <img
          src="/code_snippets/info.png"
          alt="Instructions"
          style={{
            width: infoButtonSize,
            height: "auto",
            display: "block",
          }}
        />
      </button>

      {instructionsVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4 py-6"
          style={{
            zIndex: 10020,
            pointerEvents: instructionsPhase === "closing" ? "none" : "auto",
          }}
        >
          <button
            type="button"
            aria-label="Close instructions overlay"
            onClick={closeInstructions}
            style={{
              position: "absolute",
              inset: 0,
              background: singularityBackdrop,
              backdropFilter:
                instructionsPhase === "opening" ||
                instructionsPhase === "closing"
                  ? "blur(8px)"
                  : "blur(4px)",
              opacity: instructionsBackdropOpacity,
              transition: backdropTransition,
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />

          <div
            ref={instructionsCardRef}
            role="dialog"
            aria-modal="true"
            aria-label="Collaborate instructions"
            style={{
              position: "relative",
              zIndex: 1,
              width: isMobile ? "min(97vw, 650px)" : "min(96vw, 1196px)",
              maxWidth: "1196px",
              transform: instructionsTransform,
              opacity: instructionsOpacity,
              borderRadius: instructionsBorderRadius,
              transition: instructionsTransition,
              transformOrigin: "center center",
              willChange: "transform, opacity, filter",
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(244, 225, 184, 0.98) 0%, rgba(212, 195, 106, 0.98) 100%)",
              border: "3px solid rgba(22, 73, 56, 0.28)",
              filter: instructionsFilter,
            }}
          >
            <img
              src="/code_snippets/instructions.png"
              alt="Instructions for collaborate"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "calc(100vh - 8px)",
                objectFit: "contain",
                padding: isMobile ? "24px 14px 14px" : "30px 18px 18px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              aria-label="Close instructions"
              onClick={closeInstructions}
              style={{
                position: "absolute",
                top: isMobile ? 10 : 14,
                right: isMobile ? 10 : 14,
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img
                src="/code_snippets/close.gif"
                alt="Close"
                style={{
                  width: isMobile ? 86 : 120,
                  height: "auto",
                  display: "block",
                }}
              />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header
  className="flex items-center justify-center px-6"
  style={{ height: '120px' }}
>
  <img
    src="/code_snippets/title.png"
    alt="Snippets Title"
    className="select-none"
    style={{
      height: "80%",     // make it big relative to header
      width: "auto",
      objectFit: "contain",
      display: "block",
    }}
  />
</header>



      {/* Main */}
      <div
        className="flex-1 flex overflow-hidden"
        style={{ height: containerHeight }}
      >
        {/* Left: Level buttons - vertical */}
        <div className="flex flex-col items-center justify-center" style={{ width: '200px', background: PAGE_BG }}>
          {/* LEVEL BUTTONS */}
          <div className="flex flex-col items-center justify-center gap-3">
            {/* LEVEL 1 */}
            <button
              onClick={() => openLevelModal(1)}
              className="rounded-xl transition-transform hover:scale-[1.06]"
            >
              <img
                src="/code_snippets/level1.png"
                alt="Level 1"
                className="w-40 h-auto"
              />
            </button>

            {/* LEVEL 2 */}
            <button
              onClick={() => openLevelModal(2)}
              className="rounded-xl transition-transform hover:scale-[1.06]"
            >
              <img
                src="/code_snippets/level2.png"
                alt="Level 2"
                className="w-40 h-auto"
              />
            </button>

            {/* LEVEL 3 */}
            <button
              onClick={() => openLevelModal(3)}
              className="rounded-xl transition-transform hover:scale-[1.06]"
            >
              <img
                src="/code_snippets/level3.png"
                alt="Level 3"
                className="w-40 h-auto"
              />
            </button>
          </div>
        </div>

        {/* Center: details / code viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            className="p-6 overflow-hidden flex-1"
          >
<div
  className="h-full rounded-2xl p-4 flex flex-col"
  style={{
    background: PAGE_BG,
    border: `3px solid ${GREEN_ACCENT}`,
  }}
>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold">
                    {selectedLibraryIndex == null ? (
                      "Library empty"
                    ) : activeSide === "audio" ? (
                      selectedAudio?.title ?? "—"
                    ) : (
                      selectedVisual?.title ?? "—"
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    ref={copyButtonRef}
                    className="relative flex items-center justify-center"
                  >
                    <button 
                      onClick={() => {
                        const text = activeSide === "audio" ? selectedAudio?.code : selectedVisual?.code;
                        copyToClipboard(text ?? "");
                      }}
                      disabled={selectedLibraryIndex == null}
                      className={`
                        transition-all
                        ${copied ? "scale-90 copy-glow" : "scale-100 copy-glow-off"}
                      `}
                      style={{
                        transition: "transform 120ms ease, box-shadow 150ms ease",
                        borderRadius: "8px", // helps glow look cleaner
                      }}
                    >
                      <img
                        src="/code_snippets/copy.png"
                        alt="Copy"
                        className="w-24 h-auto select-none"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Code window */}
              <div
  className="flex-1 overflow-auto rounded-md border border-slate-100 shadow-sm"
  style={{
    background: activeSide === "audio" ? GOLD_ACCENT : PINK_ACCENT,
    color: activeSide === "audio" ? GREEN_ACCENT : GOLD_ACCENT,
  }}
>
  {selectedLibraryIndex == null ? (
    <div className="p-6 text-center" 
      style={{ 
        color: activeSide === "audio" ? GREEN_ACCENT : GOLD_ACCENT 
      }}
    >
      Your library is empty — use the potion buttons on the left to add potions. Start with Elementary Potions.
    </div>
  ) : (
    <pre
      className="m-0 p-4 text-sm leading-6 whitespace-pre-wrap font-mono"
      style={{
        color: activeSide === "audio" ? GREEN_ACCENT : GOLD_ACCENT,
      }}
    >
      {activeSide === "audio"
        ? selectedAudio?.code ?? "// no audio snippet"
        : selectedVisual?.code ?? "// no visual snippet"}
    </pre>
  )}
</div>

            </div>
          </main>
        </div>

        {/* Right: library */}
        <aside
          className="w-96 bg-transparent overflow-auto"
          style={{ height: containerHeight }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-6 flex justify-center">
              <img
                src="/code_snippets/myPotions.png"
                alt="My Potions"
                className="w-52 h-auto select-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-3">
              {libraryCount === 0 ? (
              <div className="text-sm" style={{ color: "#164938" }}>
                Pick your potion recipe! Start from Elementary Potions.
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-4">
                  {library.map((pair, i) => {
                    const isFlipped = !!flipped[i];
                    const pairKey = `lib-pair-${i}`;

                    return (
                      <li key={pairKey}>
                        <Card
                          audio={pair.audio}
                          visual={pair.visual}
                          isFlipped={isFlipped}
                          onToggleFlip={() => toggleFlipLib(i)}
                          onSelect={() => setSelectedLibraryIndex(i)}
                          isSelected={selectedLibraryIndex === i}
                          height={140}
                          showFlipIcon
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Level modal */}
      <LevelModal
        isOpen={isLevelModalOpen}
        level={activeLevelRequested}
        options={levelModalOptions}
        flipped={levelModalFlipped}
        selected={levelModalSelected}
        onToggleFlip={(idx) =>
          setLevelModalFlipped((s) => ({ ...s, [idx]: !s[idx] }))
        }
        onSelect={setLevelModalSelected}
        onClose={closeLevelModal}
        onConfirm={confirmLevelSelection}
      />
      {copyNoticeOverlay}
    </div>
  );
}
