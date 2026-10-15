"use client";

import Image from "next/image";
import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#F4E1B8] flex flex-col items-center px-4 py-10">
      <div className="w-full flex justify-center">
        <div className="w-[260px] sm:w-[320px] md:w-[380px]">
          <Image
            src="/howto/title.png"
            alt="How to play"
            width={380}
            height={120}
            className="w-full h-auto"
          />
        </div>
      </div>

      <section className="w-full max-w-[860px] mx-auto flex flex-col items-center gap-8 mt-10">
        <div className="w-full flex justify-center">
          <Image
            src="/howto/how1.png"
            alt="How to play step 1"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 100vw, 760px"
            className="block mx-auto h-auto w-full max-w-[760px]"
          />
        </div>

        <div className="w-full flex justify-center">
          <Image
            src="/howto/how2.png"
            alt="How to play step 2"
            width={1200}
            height={900}
            sizes="(max-width: 768px) 100vw, 760px"
            className="block mx-auto h-auto w-full max-w-[760px]"
          />
        </div>

        <Link
          href="/printables"
          aria-label="Go to printables"
          className="block w-[126px] sm:w-[154px] md:w-[182px] mt-2"
        >
          <Image
            src="/howto/play.gif"
            alt="Play"
            width={364}
            height={182}
            className="w-full h-auto"
          />
        </Link>
      </section>
    </main>
  );
}
