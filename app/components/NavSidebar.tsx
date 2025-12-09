"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavSidebar() {
  const [open, setOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed z-40 top-4 left-4 flex flex-col gap-1.5 p-2 rounded-md bg-black/60 hover:bg-black/80 transition md:top-6 md:left-6"
      >
        <span className="h-0.5 w-5 bg-white" />
        <span className="h-0.5 w-5 bg-white" />
        <span className="h-0.5 w-5 bg-white" />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/70 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full w-[420px] 3xl:w-[540px] max-w-[90vw] flex flex-col">
          {/* Background shape */}
          <Image
            src="/nav/shape.png"
            alt=""
            fill
            priority
            className="object-cover select-none pointer-events-none"
          />

          {/* CONTENT */}
          <div className="relative flex flex-col h-full pt-10 px-20 pb-6">

            {/* Close button */}
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-sm text-[#7b1b3a] bg-[#f7cfae] rounded-full px-3 py-1 shadow-md hover:brightness-95"
            >
              ✕
            </button>

            {/* TITLE */}
            <div className="w-[240px] mx-auto">
              <Image
                src="/nav/title.png"
                alt="Code Drift"
                width={480}
                height={200}
                className="w-full h-auto"
              />
            </div>

            {/* BIGGER GAP BELOW TITLE */}
            <div className="mt-25" />

            {/* NAVIGATION */}
            <nav className="flex-1 flex flex-col">

              {/* ---------------------- SET 1: ABOUT ---------------------- */}
              <div className="mb-10">
                <Link href="/" onClick={() => setOpen(false)} className="block w-[230px]">
                  <Image
                    src="/nav/about.png"
                    alt="About"
                    width={460}
                    height={120}
                    className="w-full h-auto hover:scale-[1.02] transition"
                  />
                </Link>
              </div>

              {/* ---------------------- SET 2: GAME + PHASES ---------------------- */}
              <div className="mb-10 space-y-4">
                {/* Main */}
                <Link href="/how-to-play" onClick={() => setOpen(false)} className="block w-[230px]">
                  <Image
                    src="/nav/theGame.png"
                    alt="The Game"
                    width={460}
                    height={120}
                    className="w-full h-auto hover:scale-[1.02] transition"
                  />
                </Link>

                {/* Sub-buttons */}
                <div className="space-y-3 pl-8">
                  <Link href="/printables" onClick={() => setOpen(false)} className="block w-[200px]">
                    <Image
                      src="/nav/phase1.png"
                      alt="Phase 1"
                      width={400}
                      height={100}
                      className="w-full h-auto hover:scale-[1.02] transition"
                    />
                  </Link>

                  <Link href="/collaborate" onClick={() => setOpen(false)} className="block w-[200px]">
                    <Image
                      src="/nav/phase2.png"
                      alt="Phase 2"
                      width={400}
                      height={100}
                      className="w-full h-auto hover:scale-[1.02] transition"
                    />
                  </Link>

                  <Link href="/phase-3" onClick={() => setOpen(false)} className="block w-[200px]">
                    <Image
                      src="/nav/phase3.png"
                      alt="Phase 3"
                      width={400}
                      height={100}
                      className="w-full h-auto hover:scale-[1.02] transition"
                    />
                  </Link>
                </div>
              </div>

              {/* ---------------------- SET 3: EXTRAS + SUBS ---------------------- */}
              <div className="space-y-4 mb-6">
                {/* Main */}
                <Link href="/extras" onClick={() => setOpen(false)} className="block w-[230px]">
                  <Image
                    src="/nav/extras.png"
                    alt="Extras"
                    width={460}
                    height={120}
                    className="w-full h-auto hover:scale-[1.02] transition"
                  />
                </Link>

                {/* Sub-buttons */}
                <div className="space-y-3 pl-8">
                  <Link href="/resources" onClick={() => setOpen(false)} className="block w-[200px]">
                    <Image
                      src="/nav/resources.png"
                      alt="Resources"
                      width={400}
                      height={100}
                      className="w-full h-auto hover:scale-[1.02] transition"
                    />
                  </Link>

                  <Link href="/diy-kits" onClick={() => setOpen(false)} className="block w-[200px]">
                    <Image
                      src="/nav/diy.png"
                      alt="DIY Kits"
                      width={400}
                      height={100}
                      className="w-full h-auto hover:scale-[1.02] transition"
                    />
                  </Link>
                </div>
              </div>
            </nav>

{/* ---------------------- FOOTER ---------------------- */}
<div className="mt-auto mb-4 -mx-20 flex justify-center">
  <Image
    src="/nav/footer.png"
    alt="Footer"
    width={900}
    height={300}
    className="w-[95%] max-w-[400px] h-auto"
  />
</div>

          </div>
        </div>
      </aside>
    </>
  );
}
