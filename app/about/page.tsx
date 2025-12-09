// app/about/page.tsx
import React from "react";
import NavSidebar from "../components/NavSidebar";

const BAUHAUS_RED = "#FF3B30";
const TEXT = {
  intro:
    "code.drift is a creative coding practice rooted in the local and built on a foundation of community, friendship, and play. code.drift positions creating as a shared activity, a way to connect with people, and to co-learn.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "#F2F0EF", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* header */}
        <header className="mb-8 text-center">
          <svg
            width="480"
            height="64"
            viewBox="0 0 480 64"
            className="mx-auto mb-4"
            aria-hidden
            role="img"
          >
            <path
              d="M8 44 C120 6,360 6,472 44"
              fill="none"
              stroke={BAUHAUS_RED}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>

          <h1
            className="font-semibold"
            style={{
              fontSize: 36,
              letterSpacing: 6,
              color: "#000",
              marginBottom: 10,
            }}
          >
            ABOUT
          </h1>

          <p
            className="mx-auto"
            style={{
              maxWidth: 820,
              color: "#0F172A",
              fontSize: 16,
              lineHeight: 1.6,
              opacity: 0.95,
            }}
          >
            {TEXT.intro}
          </p>
        </header>

        {/* main content */}
        <main style={{ color: "#0F172A" }}>
          <section className="mb-8">
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>About Code Drift</h2>

            <h3 style={{ marginTop: 10, marginBottom: 6, fontSize: 18 }}>
              What is a dérive?
            </h3>

            <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
              A dérive (French for “drift”) is a playful, spontaneous journey
              through urban space — a way of letting the city guide you rather
              than the other way around. Instead of moving with a goal or
              destination, you wander with curiosity, tuning into landscape,
              architecture, people, sounds, and unexpected ambiences.
            </p>

            <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
              Coined by the Situationist International in the 1960s, the dérive
              invited people to drop their motives for movement, tune into
              surroundings, and experience the city as an ever-shifting,
              creative playground.
            </p>

            <ul style={{ lineHeight: 1.6, marginLeft: 18 }}>
              <li>Rapid passage through varied ambiences</li>
              <li>Being deliberately playful and instinctive</li>
              <li>Letting terrain, chance, and encounters guide you</li>
              <li>Immersing yourself in the “now-space”</li>
              <li>Observation, discovery, and creative openness</li>
            </ul>

            <p style={{ marginTop: 8, lineHeight: 1.6 }}>
              It is a way of experiencing a place as if for the first time —
              embracing surprise, disorientation, and intuition.
            </p>
          </section>

          <section className="mb-8">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>What is Code Drift?</h3>
            <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
              Code Drift is a digital reinterpretation of the dérive — a way of
              drifting through code, interfaces, and virtual spaces the same
              way Situationists drifted through cities.
            </p>

            <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
              Just as a dérive invites wandering without purpose, Code Drift
              encourages moving through computational space with curiosity,
              playfulness, and attention to ambience. Instead of predefined
              routes, linear tasks, or typical “productivity-driven” UX, Code
              Drift becomes an experience that evolves as you explore it.
            </p>

            <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
              Code Drift treats code as:
            </p>

            <ul style={{ lineHeight: 1.6, marginLeft: 18 }}>
              <li>A landscape to wander through</li>
              <li>A system that influences your movement</li>
              <li>An environment that reacts to presence</li>
              <li>A space where chance, glitch, and randomness matter</li>
            </ul>

            <p style={{ marginTop: 8, lineHeight: 1.6 }}>
              It is not about arriving somewhere — it’s about experiencing how
              the digital world shapes you as you move through it.
            </p>
          </section>

          <section className="mb-8">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>
              How Code Drift uses the dérive
            </h3>

            <div style={{ lineHeight: 1.6 }}>
              <p style={{ marginBottom: 8 }}>
                <strong>Environment-led movement</strong>
                <br />
                Instead of choosing your path, the system subtly nudges you.
                Visual cues, generative patterns, or algorithmic randomness
                influence how you drift.
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Playfulness over productivity</strong>
                <br />
                There is no goal, no point system, no “end.” Your experience is
                shaped entirely by exploration.
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Ambience as information</strong>
                <br />
                Colors, motion, sound, and code-generated forms become the
                “terrain” that pulls you in different directions — just like
                city streets, light, or crowds would in a physical dérive.
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Letting go of intention</strong>
                <br />
                You navigate not to complete a task, but to see what the system
                reveals next.
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Creative possibility</strong>
                <br />
                Each drift is a unique, ephemeral trace — a tiny narrative
                created by wandering through a living, evolving code
                environment.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Why Code Drift exists</h3>

            <p style={{ lineHeight: 1.6, marginBottom: 8 }}>
              In today’s hyper-structured digital world — where everything is
              optimized, gamified, or designed to capture attention — Code
              Drift makes space for unstructured wandering.
            </p>

            <p style={{ lineHeight: 1.6 }}>
              It is an invitation to:
            </p>

            <ul style={{ lineHeight: 1.6, marginLeft: 18 }}>
              <li>slow down</li>
              <li>drift</li>
              <li>explore</li>
              <li>notice</li>
              <li>play</li>
            </ul>

            <p style={{ marginTop: 8, lineHeight: 1.6 }}>
              Code Drift reclaims digital space as something creative, surprising,
              and deeply human — restoring a sense of wonder to everyday
              interaction, the same way the dérive once transformed everyday life.
            </p>
          </section>

          <section style={{ marginTop: 18 }}>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
              code.drift started as an Ajaibghar initiative and amorphously evolves
              with its community.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
