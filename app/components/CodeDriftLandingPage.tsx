'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
  onPlay?: () => void;
  onCollaborate?: () => void;
  onPerform?: () => void;
};

export default function CodeDriftLandingPage({
  onPlay = () => {},
  onCollaborate = () => {},
  onPerform = () => {},
}: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col relative" style={{ background: '#F2F0EF' }} >
      {/* dotted paper background overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
          opacity: 0.35,
        }}
      />

      <header className="z-10 relative flex items-center justify-end p-6">
        <nav className="inline-flex gap-6 items-center font-semibold tracking-wide text-gray-800">
          <Link href="/about" className="hover:underline cursor-pointer">About</Link>
          <Link href="/printables" className="hover:underline cursor-pointer">Printables</Link>
          <a className="hover:underline cursor-pointer">DIY Events</a>
        </nav>
      </header>

      <main className="z-10 relative flex-1 flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          <div className="relative bg-transparent rounded-2xl p-12 flex flex-col items-center">
            {/* playful bauhaus shapes (decorative SVGs) */}
            <svg
              className="absolute -left-8 -top-12"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="6" y="6" width="48" height="48" rx="6" fill="#FFD400" />
              <circle cx="86" cy="86" r="24" fill="#0066FF" />
              <rect x="68" y="12" width="40" height="16" rx="2" fill="#FF3B30" />
            </svg>

            <svg className="absolute -right-8 -bottom-8 rotate-6" width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="90" width="60" height="30" rx="4" fill="#FF3B30" />
              <rect x="90" y="10" width="52" height="52" rx="6" fill="#0066FF" />
              <circle cx="40" cy="40" r="14" fill="#FFD400" />
            </svg>

            {/* big title with hand-drawn red outline simulated by svg path */}
            <div className="relative w-full flex flex-col items-center text-center">
              <svg className="w-full h-36" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
                <path
                  d="M60 90 C160 10, 340 10, 460 90 C580 170, 760 170, 920 90 C1060 20, 1140 20, 1180 90"
                  fill="none"
                  stroke="#FF3B30"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                  style={{ filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.04))' }}
                />

                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'"
                  fontSize={48}
                  letterSpacing={6}
                  fill="#0F172A"
                >
                  CODE DRIFT : THE GAME
                </text>
              </svg>

              {/* control row: Play / Collaborate / Perform */}
              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                  {/* Play (triangle) */}
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPlay}
                    aria-label="Play Code Drift"
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg"
                    style={{ border: '3px solid #0066FF' }}
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <polygon points="6,4 20,12 6,20" fill="#FF3B30" />
                      <circle cx="12" cy="12" r="11" stroke="#FFD400" strokeWidth="1" fill="none" opacity="0.12" />
                    </svg>
                    <span className="font-semibold text-lg tracking-wide">Play</span>
                  </motion.button>

                  {/* Collaborate (square) */}
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCollaborate}
                    aria-label="Collaborate in Code Drift"
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg"
                    style={{ border: '3px solid #0066FF' }}
                  >
                    <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <rect x="6" y="6" width="36" height="36" rx="4" fill="#0066FF" />
                      <rect x="10" y="30" width="28" height="6" rx="2" fill="#FFD400" opacity="0.18" />
                    </svg>
                    <span className="font-semibold text-lg tracking-wide">Collaborate</span>
                  </motion.button>

                  {/* Perform (circle) */}
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPerform}
                    aria-label="Perform in Code Drift"
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-lg"
                    style={{ border: '3px solid #0066FF' }}
                  >
                    <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="24" cy="18" r="12" fill="#FFD400" />
                      <rect x="6" y="32" width="36" height="6" rx="2" fill="#FF3B30" opacity="0.18" />
                    </svg>
                    <span className="font-semibold text-lg tracking-wide">Perform</span>
                  </motion.button>
                </div>

                <div className="mt-2 text-sm text-gray-600 opacity-80">First time here? Click Play | Back from drift? Press collaborate | Ready to perform? Click perform.</div>
              </div>
            </div>

            {/* lower playful footer shapes */}
            <div className="mt-14 w-full flex justify-between items-center px-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-6 rounded-sm bg-[#FF3B30] shadow-sm" />
                <div className="w-8 h-8 rounded-sm bg-[#0066FF] shadow-sm" />
                <div className="w-20 h-4 rounded-sm bg-[#FFD400] shadow-sm" />
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* <footer className="z-10 relative p-6 text-center text-sm text-gray-500">Designed by Juicebox Collective for Code Yatra & Ajaibghar</footer> */}
    </div>
  );
}
