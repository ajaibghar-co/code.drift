// app/code/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
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

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 200);
    } catch {
      console.log("Copy failed");
    }
  }, []);
  

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

      // new cards default to AUDIO/front side (not flipped)
      setSelectedLibraryIndex(newIndex);
      setFlipped((f) => ({ ...f, [newIndex]: false }));

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
      `}</style>

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
        {/* Left: details / code viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            className="p-6 overflow-hidden"
            style={{ height: leftMainHeight }}
          >
<div
  className="h-full rounded-2xl p-4 flex flex-col"
  style={{
    background: "#F4E1B8",
    border: "3px solid #164938",
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

              {/* Code window */}
              <div
  className="flex-1 overflow-auto rounded-md border border-slate-100 shadow-sm"
  style={{
    background: activeSide === "audio" ? "#D4C36A" : "#AA2E5C",
    color: activeSide === "audio" ? "#164938" : "#D4C36A",
  }}
>
  {selectedLibraryIndex == null ? (
    <div className="p-6 text-center" 
      style={{ 
        color: activeSide === "audio" ? "#164938" : "#D4C36A" 
      }}
    >
      Your library is empty — use the potion buttons below to add potions. Start with Elementary Potions.
    </div>
  ) : (
    <pre
      className="m-0 p-4 text-sm leading-6 whitespace-pre-wrap font-mono"
      style={{
        color: activeSide === "audio" ? "#164938" : "#D4C36A",
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

          {/* bottom level buttons */}
          <div
            style={{ height: BOTTOM_HEIGHT_PX }}
          >
            <div className="h-full flex items-center justify-center p-4">
              <div className="flex items-center justify-center gap-10">
                {/* PICK IMAGE ON THE LEFT */}
                <img
                  src="/code_snippets/pick.png"
                  alt="Pick"
                  className="w-48 h-auto opacity-95 select-none"
                />

                {/* LEVEL BUTTONS */}
                <div className="flex items-center gap-8">
                  {/* LEVEL 1 */}
                  <button
                    onClick={() => openLevelModal(1)}
                    className="rounded-xl transition-transform hover:scale-[1.06]"
                  >
                    <img
                      src="/code_snippets/level1.png"
                      alt="Level 1"
                      className="w-36 h-auto"
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
                      className="w-36 h-auto"
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
                      className="w-36 h-auto"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}
