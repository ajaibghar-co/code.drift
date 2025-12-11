"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function PotionExplosionsPage() {
  const [audioPrompts, setAudioPrompts] = useState<string[]>([]);
  const [visualPrompts, setVisualPrompts] = useState<string[]>([]);
  const [audioText, setAudioText] = useState("");
  const [visualText, setVisualText] = useState("");

  const [audioAnimate, setAudioAnimate] = useState(false);
  const [visualAnimate, setVisualAnimate] = useState(false);

  // For ticker animation control & cleanup
  const audioTimeouts = useRef<number[]>([]);
  const visualTimeouts = useRef<number[]>([]);
  const audioAnimating = useRef(false);
  const visualAnimating = useRef(false);

  // small flash state for text when it changes
  const [audioFlash, setAudioFlash] = useState(false);
  const [visualFlash, setVisualFlash] = useState(false);

  // Load JSON on mount
  useEffect(() => {
    fetch("/potion-explosion/audio.json")
      .then((res) => res.json())
      .then((data) => setAudioPrompts(Array.isArray(data) ? data : data?.prompts || []))
      .catch(() => setAudioPrompts([]));

    fetch("/potion-explosion/visual.json")
      .then((res) => res.json())
      .then((data) => setVisualPrompts(Array.isArray(data) ? data : data?.prompts || []))
      .catch(() => setVisualPrompts([]));

    // cleanup on unmount
    return () => {
      clearAllTimeouts(audioTimeouts.current);
      clearAllTimeouts(visualTimeouts.current);
    };
  }, []);

  function clearAllTimeouts(list: number[]) {
    list.forEach((id) => window.clearTimeout(id));
    list.length = 0;
  }

  function pickRandom(list: string[]) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // Original simple pick + pop animation (kept for quick click fallback)
  function triggerAudio() {
    setAudioText(pickRandom(audioPrompts));
    setAudioAnimate(true);
    setTimeout(() => setAudioAnimate(false), 250);
  }

  function triggerVisual() {
    setVisualText(pickRandom(visualPrompts));
    setVisualAnimate(true);
    setTimeout(() => setVisualAnimate(false), 250);
  }

  /**
   * runTicker: cycles through prompts rapidly then slows and stops on final prompt.
   *
   * - prompts: array of strings
   * - setText: setter for what is visible
   * - timeoutsRef: ref to array where timeout ids will be stored (so they can be cleared)
   * - animatingRef: ref boolean to guard against double clicks
   * - setFlash: optional small flash effect setter
   */
  function runTicker(
    prompts: string[],
    setText: (s: string) => void,
    timeoutsRef: { current: number[] },
    animatingRef: { current: boolean },
    setFlash?: (b: boolean) => void
  ) {
    if (!prompts || prompts.length === 0) return;
    if (animatingRef.current) return;
  
    clearAllTimeouts(timeoutsRef.current);
    animatingRef.current = true;
  
    // -----------------------------
    // 🔥 FASTER SETTINGS
    // -----------------------------
    const baseSteps = 10;        // was ~18 → fewer total jumps
    const extra = Math.floor(Math.random() * 6); // was 10 → fewer random jumps
    const totalSteps = baseSteps + extra;
  
    const startDelay = 18;       // was ~30 → starts faster
    const endDelay = 180;        // was ~300 → slows down faster
    // -----------------------------
  
    const finalIndex = Math.floor(Math.random() * prompts.length);
  
    const delayAt = (t: number) =>
      startDelay + (endDelay - startDelay) * (1 - Math.pow(1 - t, 2));
  
    let cumulative = 0;
  
    for (let step = 0; step < totalSteps; step++) {
      const t = step / Math.max(1, totalSteps - 1);
      const delay = delayAt(t);
      cumulative += delay;
  
      const idx =
        step === totalSteps - 1
          ? finalIndex
          : Math.floor(Math.random() * prompts.length);
  
      const id = window.setTimeout(() => {
        setText(prompts[idx]);
        if (setFlash) {
          setFlash(true);
          const f = window.setTimeout(() => setFlash(false), 90);
          timeoutsRef.current.push(f);
        }
      }, Math.round(cumulative));
  
      timeoutsRef.current.push(id);
    }
  
    const finishId = window.setTimeout(() => {
      animatingRef.current = false;
      timeoutsRef.current.length = 0;
    }, Math.round(cumulative + 30));
  
    timeoutsRef.current.push(finishId);
  }
  

  // Enhanced handlers: use runTicker (slowing ticker) instead of immediate pick
  function handleAudioTicker() {
    if (audioAnimating.current) return;
    // small pop on the button
    setAudioAnimate(true);
    setTimeout(() => setAudioAnimate(false), 220);

    runTicker(audioPrompts, setAudioText, audioTimeouts, audioAnimating, setAudioFlash);
  }

  function handleVisualTicker() {
    if (visualAnimating.current) return;
    setVisualAnimate(true);
    setTimeout(() => setVisualAnimate(false), 220);

    runTicker(visualPrompts, setVisualText, visualTimeouts, visualAnimating, setVisualFlash);
  }

  return (
    <main
      className="min-h-screen w-full flex items-start justify-center"
      style={{ backgroundColor: "#F4E1B8" }}
    >
      {/* INLINE ANIMATION CSS */}
      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }
        .pop-on-click {
          animation: pop 0.25s ease-out;
        }

        /* small flash when text changes */
        .blob-text {
          transition: transform 110ms ease-out;
          transform-origin: 50% 50%;
        }
        .blob-text.flash {
          transform: scale(1.06);
        }

        /* keep blob sizes consistent */
        .blob-window {
          width: 520px;
          height: 300px;
          position: relative;
        }
      `}</style>

      <div className="w-full max-w-5xl px-6 py-12">
        {/* Title */}
        <div className="flex justify-center">
          <Image
            src="/potion-explosion/heading.png"
            alt="Potion Explosions"
            width={600}
            height={50}
            priority
          />
        </div>

        {/* Subhead */}
        <div className="flex justify-center mt-28">
          <Image
            src="/potion-explosion/subhead.png"
            alt="Pick a prompt"
            width={480}
            height={60}
          />
        </div>

        {/* Two columns */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* AUDIO */}
          <div className="flex flex-col items-center">
            <div className="mb-6 flex justify-center w-full">
              {/* switched handler to ticker version */}
              <button
                aria-label="Audio prompt"
                onClick={handleAudioTicker}
                className={audioAnimate ? "pop-on-click" : ""}
                disabled={audioAnimating.current}
                style={{ background: "transparent", border: "none" }}
              >
                <Image
                  src="/potion-explosion/audio.png"
                  alt="Audio"
                  width={200}
                  height={90}
                />
              </button>
            </div>

            <div className="relative flex justify-center w-full">
              <Image
                src="/potion-explosion/audioBlob.png"
                alt="Audio blob"
                width={520}
                height={300}
              />
              <div
                className={`absolute top-1/2 left-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 text-center text-xl font-semibold blob-text ${
                  audioFlash ? "flash" : ""
                }`}
                style={{ color: "#95852F" }}
                aria-live="polite"
                aria-atomic="true"
              >
                {audioText || "—"}
              </div>
            </div>
          </div>

          {/* VISUAL */}
          <div className="flex flex-col items-center">
            <div className="mb-6 flex justify-center w-full">
              <button
                aria-label="Visual prompt"
                onClick={handleVisualTicker}
                className={visualAnimate ? "pop-on-click" : ""}
                disabled={visualAnimating.current}
                style={{ background: "transparent", border: "none" }}
              >
                <Image
                  src="/potion-explosion/visual.png"
                  alt="Visual"
                  width={200}
                  height={90}
                />
              </button>
            </div>

            <div className="relative flex justify-center w-full">
              <Image
                src="/potion-explosion/visualBlob.png"
                alt="Visual blob"
                width={520}
                height={300}
              />
              <div
                className={`absolute top-1/2 left-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 text-center text-xl font-semibold blob-text ${
                  visualFlash ? "flash" : ""
                }`}
                style={{ color: "#AA2E5C" }}
                aria-live="polite"
                aria-atomic="true"
              >
                {visualText || "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
