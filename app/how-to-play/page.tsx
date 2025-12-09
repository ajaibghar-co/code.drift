// app/how-to-play/page.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#F4E1B8] flex flex-col items-center px-4 py-10">
      {/* TITLE — centered */}
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

      {/* SECTION 1: Setup + Before + Gather / Arrange+Software / Print */}
      <section className="relative w-full max-w-5xl flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Stars background (single image, behind everything in this section) */}
        <Image
          src="/howto/stars.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover opacity-70 pointer-events-none"
        />

        {/* Original content, unchanged layout */}
        <div className="relative z-10 mt-10 w-full max-w-5xl flex flex-col items-center">
          {/* LEFT SIDE: GAME SETUP + BEFORE (stacked) */}
          <div className="w-full flex justify-start">
            <div className="flex flex-col items-center gap-6">
              {/* Game Setup (slightly bigger) */}
              <div className="w-[220px] sm:w-[260px] md:w-[300px]">
                <Image
                  src="/howto/setup.png"
                  alt="Game setup"
                  width={300}
                  height={200}
                  className="w-full h-auto"
                />
              </div>

              {/* Before (slightly smaller) */}
              <div className="w-[200px] sm:w-[230px] md:w-[210px]">
                <Image
                  src="/howto/before.png"
                  alt="Before you start playing"
                  width={220}
                  height={140}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* LOWER ROW: GATHER | ARRANGE+SOFTWARE | PRINT */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full justify-items-center">
            {/* GATHER */}
            <div className="w-[240px] sm:w-[210px] md:w-[240px]">
              <Image
                src="/howto/gather.png"
                alt="Gather your friends"
                width={210}
                height={190}
                className="w-full h-auto"
              />
            </div>

            {/* ARRANGE + SOFTWARES (stacked in the middle, slightly bigger) */}
            <div className="flex flex-col items-center gap-3 w-[170px] sm:w-[190px] md:w-[210px]">
              <Image
                src="/howto/arrange.png"
                alt="Arrange your cards"
                width={210}
                height={120}
                className="w-full h-auto"
              />
              <Image
                src="/howto/softwares.png"
                alt="With Sonic Pi and p5.js"
                width={210}
                height={120}
                className="w-full h-auto"
              />
            </div>

            {/* PRINT */}
            <div className="w-[150px] sm:w-[170px] md:w-[190px]">
              <Image
                src="/howto/print.png"
                alt="Download bingo and card decks"
                width={190}
                height={190}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ⭐️ DIVIDER IMAGE — inserted here */}
      <div className="w-full flex justify-center my-4">
        <div className="relative w-[120px] sm:w-[150px] md:w-[680px] aspect-[200/10]">
          <Image
            src="/howto/div.png"
            alt="Divider"
            fill
            className="object-contain"
          />
        </div>
      </div>


      {/* SECTION 2: GAME ROLES / CHARACTERS SECTION */}
      <section className="relative w-full max-w-5xl mt-16 md:mt-20 flex flex-col gap-10">
  {/* Stars background */}
  <Image
    src="/howto/stars.png"
    alt=""
    aria-hidden="true"
    fill
    className="object-cover opacity-50 pointer-events-none"
  />

  <div className="relative z-10 flex flex-col gap-10">
    {/* TOP: ROLES HEADER + CHARACTER GRID */}
    <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
      {/* Left column: "GAME ROLES" graphic */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="relative w-[80px] sm:w-[100px] md:w-[160px] aspect-[200/500]">
          <Image
            src="/howto/roles.png"
            alt="Game roles text"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Character grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-8 justify-items-center">
          {/* Drift master */}
          <div className="relative w-[220px] sm:w-[260px] md:w-[320px] aspect-[4/3]">
            <Image
              src="/howto/dm.png"
              alt="Drift master"
              fill
              className="object-contain"
            />
          </div>
          {/* Shape shifter */}
          <div className="relative w-[220px] sm:w-[260px] md:w-[320px] aspect-[4/3]">
            <Image
              src="/howto/shape.png"
              alt="Shape shifter"
              fill
              className="object-contain"
            />
          </div>
          {/* Vizard */}
          <div className="relative w-[220px] sm:w-[260px] md:w-[320px] aspect-[4/3]">
            <Image
              src="/howto/vizard.png"
              alt="Vizard"
              fill
              className="object-contain"
            />
          </div>
          {/* Treble maker */}
          <div className="relative w-[220px] sm:w-[260px] md:w-[320px] aspect-[4/3]">
            <Image
              src="/howto/treble.png"
              alt="Treble maker"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>

    {/* BOTTOM ROW: pick | (anyNumber + atleastOneDM stacked) | roles-2 */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start justify-items-center">
      {/* Left column: pick.png */}
      <div className="relative w-[220px] sm:w-[260px] md:w-[280px]">
        <Image
          src="/howto/pick.png"
          alt="Pick a role based on your interests"
          width={280}
          height={210}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Middle column: anyNumber + atleastOneDM stacked with NO vertical gap */}
      <div className="flex flex-col items-center md:items-start">
        <div className="w-[220px] sm:w-[260px] md:w-[280px]">
          <Image
            src="/howto/anyNumber.png"
            alt="Any number of players can be vizards, treblemakers, and shapeshifters"
            width={280}
            height={210}
            className="w-full h-auto object-contain block"
          />
        </div>
        <div className="w-[220px] sm:w-[260px] md:w-[280px] ">
          {/* -mt-2 pulls it up a tiny bit so they visually touch */}
          <Image
            src="/howto/atleastOneDM.png"
            alt="There must be at least one driftmaster"
            width={280}
            height={210}
            className="w-full h-auto object-contain block"
          />
        </div>
      </div>

      {/* Right column: roles-2.png (bigger) */}
      <div className="relative w-[260px] sm:w-[320px] md:w-[380px]">
        <Image
          src="/howto/roles-2.png"
          alt="In the next phases of the game..."
          width={380}
          height={260}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  </div>
</section>



      
      {/* ⭐️ DIVIDER IMAGE — inserted here */}
      <div className="w-full flex justify-center mt-4 mb-16">
        <div className="relative w-[120px] sm:w-[150px] md:w-[680px] aspect-[200/10]">
          <Image
            src="/howto/div.png"
            alt="Divider"
            fill
            className="object-contain"
          />
        </div>
      </div>
  
{/* --- RULES  --- */}
<section
  className="w-full flex justify-center py-16"
  style={{
    backgroundImage: "url('/howto/bg.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "400px",
  }}
>
  {/* STACKED PINK RECTANGLES INSIDE SAME BG */}
  <div className="w-full flex flex-col items-center gap-12">
    {/* -- PINK RECTANGLE: RULES + PHASE 1 -- */}
    <div className="relative w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%]">
      {/* background blob */}
      <div className="absolute inset-0 bg-[#F7AFCB] rounded-[50px] z-0" />

      {/* content */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 flex flex-col gap-8">
        {/* RULES OF THE GAME */}
        <div className="relative w-[260px] sm:w-[320px] md:w-[600px] mx-auto">
          <Image
            src="/howto/rules.png"
            alt="Rules of the game"
            width={1800}
            height={300}
            className="object-contain"
          />
        </div>

        {/* GOAL TEXT */}
        <div className="relative w-[360px] sm:w-[460px] md:w-[520px] aspect-[16/5]">
          <Image
            src="/howto/goals.png"
            alt="Goal: players collect moments, images and sounds..."
            fill
            className="object-contain"
          />
        </div>

        {/* PHASE 1 IMAGE */}
        <div className="relative mt-6 md:w-[70%] lg:w-[60%] mx-auto">
          <Image
            src="/howto/phase1.png"
            alt="Phase 1: Collecting ingredients"
            width={900}
            height={1200}
            className="w-full h-auto object-contain mx-auto"
          />
        </div>
      </div>
    </div>
{/* WHITE RECTANGLE — CAFE */}
<div className="relative w-[80%] sm:w-[70%] md:w-[35%] lg:w-[35%] mx-auto">
  {/* White rounded rectangle */}
  <div className="absolute inset-0 bg-[#D4C36A] rounded-[35px] z-0" />

  {/* Content inside */}
  <div className="relative z-10 py-10 flex justify-center items-center">
    <div className="w-[75%] sm:w-[65%] md:w-[60%] lg:w-[95%] mx-auto">
      <Image
        src="/howto/cafe.png"
        alt="Café"
        width={900}
        height={900}
        className="w-full h-auto object-contain mx-auto"
      />
    </div>
  </div>
</div>

    {/* -- PINK RECTANGLE: PHASE 2 -- */}
    <div className="relative w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%]">
      {/* background blob */}
      <div className="absolute inset-0 bg-[#F7AFCB] rounded-[50px] z-0" />

      {/* content */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-10">
        <div className="w-full flex flex-col md:flex-row justify-center items-start gap-10">
          {/* LEFT IMAGE */}
          <div className="w-full md:w-4/7 flex justify-center">
            <Image
              src="/howto/phase2.png"
              alt="Phase 2 Part 1"
              width={900}
              height={1200}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-3/7 flex justify-center">
            <Image
              src="/howto/phase2-2.png"
              alt="Phase 2 Part 2"
              width={600}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>

        {/* -- PINK RECTANGLE: PHASE 3 -- */}
        <div className="relative w-[95%] sm:w-[85%] md:w-[70%] lg:w-[40%]">
      {/* background blob */}
      <div className="absolute inset-0 bg-[#F7AFCB] rounded-[50px] z-0" />

      {/* content */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-2 py-10">
        <div className="w-full flex flex-col md:flex-row justify-center items-start gap-10">
          {/* LEFT IMAGE */}
          <div className="w-full flex justify-center">
            <Image
              src="/howto/phase3.png"
              alt="Phase 3"
              width={900}
              height={1200}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




    </main>
  );
}
