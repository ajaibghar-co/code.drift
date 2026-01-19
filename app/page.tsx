"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 700;

type Sticker = {
  src: string;
  alt: string;
  style: React.CSSProperties;
  isGif?: boolean;
};

const ELEMENTS: Sticker[] = [
  { src: "/landing/title.png", alt: "about code drift title", style: { top: "1%", left: "50%", width: "42%" } },
  { src: "/landing/venn.png", alt: "tech / drift / art venn diagram", style: { top: "43%", left: "50%", width: "32%" } },
  { src: "/landing/live-coded.png", alt: "code drift is a performance…", style: { top: "22%", left: "10%", width: "26%", transform: "rotate(180deg)" } },
  { src: "/landing/drifting.png", alt: "inspired by drifting around streets…", style: { top: "63%", left: "7%", width: "30%" } },
  { src: "/landing/rooted.png", alt: "rooted in the local…", style: { top: "93%", left: "7%", width: "40%" } },
  { src: "/landing/foundation.png", alt: "an unplanned journey through a landscape", style: { top: "15%", left: "90%", width: "30%" } },
  { src: "/landing/spaces.png", alt: "spaces become collaborators…", style: { top: "50%", left: "90%", width: "30%" } },
  { src: "/landing/colab.png", alt: "it’s usually a collaboration…", style: { top: "92%", left: "94%", width: "32%" } },
  { src: "/landing/play.gif", alt: "play button", style: { top: "85%", left: "50%", width: "15%" }, isGif: true },
  { src: "/landing/drift.png", alt: "drift, gather inspiration, and make cityscapes with code", style: { top: "105%", left: "52%", width: "36%" } },
];

export default function AboutCodeDriftPage() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const nextScale = Math.min(
        vw / DESIGN_WIDTH,
        vh / DESIGN_HEIGHT,
        vh < 1400 ? 0.9 : 1
      );

      setScale(nextScale);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <main className="min-h-screen bg-[#F4E1B8] flex items-center justify-center overflow-hidden">
      <h1 className="sr-only">About Code Drift</h1>

      {/* SCALE CONTAINER */}
      <div
        className="relative"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <div className="relative w-full h-full">
          {ELEMENTS.map((el, idx) => {
            const content = el.isGif ? (
              <img
                src={el.src}
                alt={el.alt}
                className="w-full h-auto object-contain cursor-pointer"
              />
            ) : (
              <Image
                src={el.src}
                alt={el.alt}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority={idx === 0}
              />
            );

            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  top: el.style.top,
                  left: el.style.left,
                  width: el.style.width,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {el.isGif ? <Link href="/how-to-play">{content}</Link> : content}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
