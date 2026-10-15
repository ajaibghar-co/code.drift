"use client";

import { useEffect, useState } from "react";
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
      {/* Hamburger */}
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed z-40 top-4 left-4 md:top-6 md:left-6 rounded-md hover:bg-[#D4C36A] transition"
      >
        <Image src="/nav/menu.gif" alt="Menu" width={130} height={200} />
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
        <div className="relative h-full w-[85vw] sm:w-[420px] 3xl:w-[540px] flex flex-col">
          {/* Background */}
          <Image
            src="/nav/shape.png"
            alt=""
            fill
            priority
            className="object-cover select-none pointer-events-none"
          />

          {/* Content */}
          <div
            className="
              relative flex flex-col h-full
              pt-6 lg:pt-4
              px-6 sm:px-10 lg:px-20
              pb-4
              overflow-y-auto lg:overflow-y-hidden
            "
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] items-center justify-center rounded-full bg-[#F4E1B8] p-[2px] hover:brightness-105 transition"
            >
              <Image
                src="/nav/close.gif"
                alt="Close"
                width={480}
                height={262}
                className="h-auto w-[150%]"
              />
            </button>

            {/* Title */}
            <div className="w-[160px] sm:w-[200px] lg:w-[200px] mx-auto">
              <Image
                src="/nav/title.png"
                alt="Code Drift"
                width={480}
                height={200}
                className="w-full h-auto"
              />
            </div>

            {/* Large gap: title to about */}
            <div className="mt-8 lg:mt-10" />

            {/* Nav */}
            <nav className="flex flex-col">
              {/* About */}
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

              {/* Medium gap: about to next main */}
              <div className="mt-6" />

              {/* Game */}
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

              {/* Small gaps: main to subs and between subs */}
              <div className="mt-3 space-y-2 pl-4 sm:pl-6 lg:pl-8">
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

              {/* Medium gap: last sub to next main */}
              <div className="mt-6" />

              {/* Extras */}
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

              {/* Small gaps */}
              <div className="mt-3 space-y-2 pl-4 sm:pl-6 lg:pl-8">
                <Link
                  href="https://docs.google.com/document/d/1H_nTvl0fe-At1COqu9F7zqz3crbdF5W5FxLiSAbdvdA/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
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
            </nav>

            {/* Footer */}
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
