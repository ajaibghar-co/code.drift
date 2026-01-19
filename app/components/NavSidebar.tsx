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

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed z-40 top-4 left-4 md:top-6 md:left-6 rounded-md hover:bg-[#D4C36A] transition"
      >
        <Image src="/nav/menu.gif" alt="Menu" width={65} height={100} />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/70 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full w-[85vw] sm:w-[420px] 3xl:w-[540px] flex flex-col">
          {/* Background shape */}
          <Image
            src="/nav/shape.png"
            alt=""
            fill
            priority
            className="object-cover select-none pointer-events-none"
          />

          {/* CONTENT */}
          <div
            className="
              relative flex flex-col h-full
              pt-6 lg:pt-4
              px-6 sm:px-10 lg:px-20
              pb-4
              overflow-y-auto lg:overflow-y-hidden
            "
          >
            {/* Close button */}
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-sm text-[#7b1b3a] bg-[#f7cfae] rounded-full px-3 py-1 shadow-md hover:brightness-95"
            >
              ✕
            </button>

            {/* TITLE */}
            <div className="w-[160px] sm:w-[200px] lg:w-[200px] mx-auto">
              <Image
                src="/nav/title.png"
                alt="Code Drift"
                width={480}
                height={200}
                className="w-full h-auto"
              />
            </div>

            {/* Gap below title */}
            <div className="mt-6 sm:mt-8 lg:mt-6" />

            {/* NAVIGATION */}
            <nav className="flex-1 flex flex-col justify-between">
              {/* SET 1: ABOUT */}
              <div className="mb-6">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block w-[180px] sm:w-[210px] lg:w-[230px]"
                >
                  <Image
                    src="/nav/about.png"
                    alt="About"
                    width={460}
                    height={120}
                    className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                  />
                </Link>
              </div>

              {/* SET 2: GAME + PHASES */}
              <div className="mb-6 space-y-3">
                <Link
                  href="/how-to-play"
                  onClick={() => setOpen(false)}
                  className="block w-[180px] sm:w-[210px] lg:w-[230px]"
                >
                  <Image
                    src="/nav/theGame.png"
                    alt="The Game"
                    width={460}
                    height={120}
                    className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                  />
                </Link>

                <div className="space-y-2 pl-4 sm:pl-6 lg:pl-8">
                  <Link
                    href="/printables"
                    onClick={() => setOpen(false)}
                    className="block w-[160px] sm:w-[180px] lg:w-[200px]"
                  >
                    <Image
                      src="/nav/phase1.png"
                      alt="Phase 1"
                      width={400}
                      height={100}
                      className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                    />
                  </Link>

                  <Link
                    href="/collaborate"
                    onClick={() => setOpen(false)}
                    className="block w-[160px] sm:w-[180px] lg:w-[200px]"
                  >
                    <Image
                      src="/nav/phase2.png"
                      alt="Phase 2"
                      width={400}
                      height={100}
                      className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                    />
                  </Link>

                  <Link
                    href="/potion-explosion"
                    onClick={() => setOpen(false)}
                    className="block w-[160px] sm:w-[180px] lg:w-[200px]"
                  >
                    <Image
                      src="/nav/phase3.png"
                      alt="Phase 3"
                      width={400}
                      height={100}
                      className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                    />
                  </Link>
                </div>
              </div>

              {/* SET 3: EXTRAS */}
              <div className="space-y-3">
                <Link
                  href="/extras"
                  onClick={() => setOpen(false)}
                  className="block w-[180px] sm:w-[210px] lg:w-[230px]"
                >
                  <Image
                    src="/nav/extras.png"
                    alt="Extras"
                    width={460}
                    height={120}
                    className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                  />
                </Link>

                <div className="space-y-2 pl-4 sm:pl-6 lg:pl-8">
                  <Link
                    href="/resources"
                    onClick={() => setOpen(false)}
                    className="block w-[160px] sm:w-[180px] lg:w-[200px]"
                  >
                    <Image
                      src="/nav/resources.png"
                      alt="Resources"
                      width={400}
                      height={100}
                      className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                    />
                  </Link>

                  <Link
                    href="/diy-kits"
                    onClick={() => setOpen(false)}
                    className="block w-[160px] sm:w-[180px] lg:w-[200px]"
                  >
                    <Image
                      src="/nav/diy.png"
                      alt="DIY Kits"
                      width={400}
                      height={100}
                      className="w-full h-auto scale-[0.95] hover:scale-[0.98] transition"
                    />
                  </Link>
                </div>
              </div>
            </nav>

            {/* FOOTER */}
            <div className="mt-4 flex justify-center">
              <Image
                src="/nav/footer.png"
                alt="Footer"
                width={1200}
                height={400}
                className="w-full max-w-none h-auto scale-[1.3]"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
