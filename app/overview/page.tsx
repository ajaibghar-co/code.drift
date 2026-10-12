// app/overview/page.tsx
import React from "react";
import Image from "next/image";

const LINK_COLOR = "rgb(43, 94, 60)";
const TEXT_DARK = "#0F172A";
const HEADER_COLOR = "rgb(145, 61, 91)";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-semibold"
      style={{ fontSize: 30, marginBottom: 10, color: HEADER_COLOR }}
    >
      {children}
    </h2>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full overflow-hidden shadow-sm h-64 sm:h-72 md:h-80">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
}

const GRID_COLS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 md:grid-cols-3",
};

function Gallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const cols = Math.min(images.length, 3);
  return (
    <div className={`grid grid-cols-1 ${GRID_COLS[cols]} gap-4 mt-4`}>
      {images.map((img) => (
        <Photo key={img.src} src={img.src} alt={img.alt} />
      ))}
    </div>
  );
}

const LINKS = [
  {
    label: "code.yatra 2025 overview reel",
    href: "https://www.instagram.com/reel/DPDpKKZiFrx/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },
  {
    label: "code.drift overview/origin video",
    href: "https://youtu.be/AlO_u2SC0jE?si=AuN6v7iq2oMLBnqP",
  },
  {
    label: "code.drift featured in VICE media 'Conscious Travel' documentary",
    href: "https://www.youtube.com/watch?v=ngUq39hIX5M&t=383s",
  },
  {
    label: "past/lives — a track inspired by Jaipur, by nanditi",
    href: "https://antarikshrecords.bandcamp.com/track/nanditi-past-lives",
  },
  {
    label: "past/lives — story with a generative zine, by avani",
    href: "https://music.algorave.in/compilation-one/past-lives.html",
  },
  {
    label: "code.drift collective showreel",
    href: "https://youtu.be/NxruZOp0AUs?si=erbou2CpWo2A04cX",
  },
];

export default function OverviewPage() {
  return (
    <div style={{ background: "rgb(244, 225, 184)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* header */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4" style={{ maxWidth: 480 }}>
            <Image
              src="/landing/title.png"
              alt="about code drift title"
              width={1414}
              height={383}
              className="w-full h-auto"
              priority
            />
          </div>

          <p
            className="mx-auto font-semibold"
            style={{
              maxWidth: 880,
              color: TEXT_DARK,
              fontSize: 34,
              lineHeight: 1.35,
              fontStyle: "italic",
              letterSpacing: -0.5,
            }}
          >
            How can we produce a creative practice with code that is rooted in
            the local?
          </p>
        </header>

        <Gallery
          images={[
            { src: "/overview/hero-picnic.jpg", alt: "The collective sitting in a circle on a lawn" },
            { src: "/overview/hero-stepwell.jpg", alt: "Two participants exploring a stepwell" },
            { src: "/overview/hero-workshop.jpg", alt: "A room full of participants live coding on laptops" },
                  ]}
        />

        <main style={{ color: TEXT_DARK }}>
          {/* Beyond Silicon Valley aesthetics */}
          <section className="mt-14 mb-14">
            <SectionHeading>Beyond Silicon Valley aesthetics</SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              Code is perceived as a mass-output tool, where “software” is
              associated with the strong visual language of Silicon
              Valley — where computer-based sound and graphics seem to be only
              bips and bops, and everything must appear like the shiny,
              bright slits and geometric patterns of Tron Legacy.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 12 }}>
              With code.drift, we push against this idea by moving our
              meaning and creative making into the places we inhabit and
              transit through. This allows us to use technology and tools to
              create new aesthetics and meaning for our situated contexts.
            </p>
            <Photo
              src="/overview/mass-performance.jpg"
              alt="A performer dancing on a projected floor visual during a code.drift performance"
            />
          </section>

          {/* A journey across Indian cities */}
          <section className="mb-14">
            <SectionHeading>
              A creative journey across diverse Indian cities
            </SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 12 }}>
              code.drift facilitates a creative journey across diverse Indian
              cities, letting each place — its rhythm, character, and
              energy — shape the work that comes out of it.
            </p>
            <Photo
              src="/overview/cities-walk.jpg"
              alt="A group on a walking tour near a temple and lake"
            />
          </section>

          {/* Intersection of art, tech, culture, community */}
          <section className="mb-14">
            <SectionHeading>
              Where art, technology, culture &amp; community meet
            </SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 4 }}>
              code.drift highlights the intersection of art, technology,
              culture, and community — challenging dominant narratives about
              the use of creative technology in Indian contexts.
            </p>
            <Gallery
              images={[
                { src: "/overview/intersection-doorway.jpg", alt: "Participants sharing a laptop in a doorway" },
                { src: "/overview/intersection-projection.jpg", alt: "Two participants watching a corner projection" },
                { src: "/overview/intersection-courtyard.jpg", alt: "A group seated with laptops and DJ equipment in a courtyard" },
              ]}
            />
          </section>

          {/* Challenging dominant narratives */}
          <section className="mb-14">
            <SectionHeading>Challenging dominant narratives</SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 4 }}>
              Watch the{" "}
              <a
                href="http://www.youtube.com/watch?v=OxoDyTAYhW0"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LINK_COLOR, textDecoration: "underline" }}
              >
                origin story
              </a>{" "}
              of how code.drift began questioning what creative technology
              looks like outside of Indian metros.
            </p>
            <Gallery
              images={[
                { src: "/overview/narratives-dj.jpg", alt: "Two performers DJing outdoors under fairy lights" },
                { src: "/overview/narratives-codewall.jpg", alt: "Two performers in front of a projected wall of live code" },
                { src: "/overview/narratives-stepwell.jpg", alt: "Two figures inside a stepwell, high contrast" },
              ]}
            />
          </section>

          {/* What is code.drift */}
          <section className="mb-14">
            <SectionHeading>What is code.drift?</SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              code.drift is an immersive creative coding practice and
              workshop series, developed by Ajaibghar. It uses live-coded
              visuals and music with the lived experience of cities.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              Drawing inspiration from the concept of the dérive — an
              unplanned journey through a landscape — code.drift transforms
              urban spaces into collaborators, using the environment as a
              creative partner. Participants begin their creative exploration
              by “drifting” through a city, observing its rhythm, character,
              and energy. These urban impressions then serve as input for
              generative artwork, live coding performances, and collaborative
              projects. By situating creative technology within specific
              locales, code.drift invites new ways of seeing, learning, and
              making — blending culture and innovation in a seamless, organic
              practice.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 12 }}>
              code.drift expanded into code.yatra in 2025 with the support of
              Godrej Design Lab, as an intentional year-long journey across
              India engaging with local communities, code, design, and varied
              creative practices.
            </p>

            <ul style={{ lineHeight: 1.8, marginLeft: 18, marginBottom: 12 }}>
              <li>A creative coding practice</li>
              <li>A workshop series</li>
              <li>
                A community of artists, musicians, designers, technologists,
                makers, and curious wanderers
              </li>
              <li>An amorphous performance collective</li>
              <li>
                A ‘print &amp; play’ game for ‘everyone’ — to engage with the
                code.drift practice as a friendly shared activity
              </li>
            </ul>

            <Gallery
              images={[
                { src: "/overview/whatis-workshop.jpg", alt: "A workshop room with a skylight and a wall of colourful generative visuals" },
                { src: "/overview/whatis-devanagari.jpg", alt: "Two participants live coding with a projected Hindi text visual" },
              ]}
            />
          </section>

          {/* Tools and links */}
          <section className="mb-14">
            <SectionHeading>Tools &amp; links</SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 12 }}>
              We leverage open-source creative coding platforms such as{" "}
              <strong>P5JS &amp; P5live</strong>, <strong>Hydra</strong>,{" "}
              <strong>Sonic Pi</strong>, and <strong>Strudel</strong> to
              create immersive, audio-visual cityscapes. These creations are
              typically the result of collaboration between a sound artist
              and a visual artist, who perform in pairs — weaving together
              sound and visual narratives that reflect the unique character
              of each city.
            </p>

            <Gallery
              images={[
                { src: "/overview/tools-warehouse.jpg", alt: "Two performers at standing tables with dual live-code projections" },
                { src: "/overview/tools-floorproj.jpg", alt: "Two people setting up a floor projection in a dark room" },
                { src: "/overview/tools-ladder.jpg", alt: "Two people beside a ladder-mounted projector setup" },
              ]}
            />

            <h3
              style={{
                fontSize: 22,
                marginTop: 16,
                marginBottom: 8,
                color: HEADER_COLOR,
                fontWeight: 600,
              }}
            >
              Some relevant links
            </h3>
            <ul style={{ lineHeight: 1.9, marginLeft: 18 }}>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: LINK_COLOR, textDecoration: "underline" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Collective + Ajaibghar */}
          <section className="mb-14">
            <SectionHeading>code.drift collective</SectionHeading>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              code.drift collective is an amorphous bunch of curious
              wanderers who drift through cities, weaving the chaotic,
              vibrant, and multifaceted essence of city life into immersive
              audio-visual cityscapes using real-time code, wit, and play.
              Their performances are playgrounds where sounds meet pixels and
              city streets &amp; stories come alive. With laptops in hand,
              projectors pointing in odd directions, and speakers pulsing to
              the rhythm of the urban landscape, the collective spins
              spontaneous, one-of-a-kind experiences that blur the lines
              between tech, creativity, and everyday life.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              The collective has performed at Max Mueller Bhavan (Delhi),
              Indian Music Experience Museum (Bengaluru) / BLR Hubba,
              Travancore Palace (Delhi), Conscious Collective 2025 by Godrej
              Design Lab (Mumbai), Jajam Udaipur, and Jaipur Jantar.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 12, color: "#4b5563" }}>
              avani · sushma · abhishek · sameera · beatnyk · mangesh ·
              shalin · damini · nanabacana · nanditi · dhruv · divya ·
              computationalmama · slackertendency · roshini · rajbir ·
              pallavi
            </p>

            <Photo
              src="/overview/collective-installation.jpg"
              alt="A ladder-mounted projector and laptop installation with live code visuals"
            />

            <h3
              style={{
                fontSize: 22,
                marginTop: 20,
                marginBottom: 8,
                color: HEADER_COLOR,
                fontWeight: 600,
              }}
            >
              Ajaibghar
            </h3>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              Ajaibghar is a creative technology studio &amp; lab for art,
              culture &amp; futures — founded by{" "}
              <a
                href="https://www.instagram.com/computational_mama/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LINK_COLOR, textDecoration: "underline" }}
              >
                Computational Mama
              </a>{" "}
              and{" "}
              <a
                href="https://www.instagram.com/nanditi.k"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LINK_COLOR, textDecoration: "underline" }}
              >
                Nanditi
              </a>
              . The practice brings together emerging technology, experience
              design, cultural strategy &amp; community building.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 8 }}>
              Their work has been featured at the India Art Fair, Serendipity
              Arts Festival, Singapore Swiss Week, Iterations Creative Coding
              Utrecht, Wildcity, Vogue India, VICE Media, EyeMyth Media Arts
              Festival, and ACRI, among others. Their clients include Science
              Gallery Bengaluru, S.L. Bhatia Medical Museum Bengaluru, Graham
              Foundation Awardees Wet Hard Agency, BeFantastic, Amitesh
              Grover, Hasgeek, and NYU Abu Dhabi.
            </p>
            <p style={{ lineHeight: 1.7, marginBottom: 12 }}>
              Ajaibghar also has a strong practice of community building to
              foster artistic collaborations, research, and capacity building
              for tech-art. These include Blob Labs — a Gen-Z research lab
              based on speculative futures, code.drift — a beginner-friendly
              creative coding workshop programme, dra.ft — a community for
              emergent ideas of text, and LAB59 — a community lab &amp;
              studio in Udaipur. With their ongoing code.drift practice,
              Ajaibghar has also been a Godrej Design Lab fellow of 2025.
            </p>
            <p style={{ lineHeight: 1.7 }}>
              IG{" "}
              <a
                href="https://www.instagram.com/ajaibghar.co/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LINK_COLOR, textDecoration: "underline" }}
              >
                @ajaibghar.co
              </a>{" "}
              | Web{" "}
              <a
                href="https://www.ajaibghar.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LINK_COLOR, textDecoration: "underline" }}
              >
                www.ajaibghar.com
              </a>
            </p>
          </section>

          {/* Closing */}
          <section style={{ marginTop: 18 }} className="text-center">
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
              code.drift started as an Ajaibghar initiative and amorphously
              evolves with its community. Find more at{" "}
              <a
                href="https://codedrift.ajaibghar.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LINK_COLOR, textDecoration: "underline" }}
              >
                codedrift.ajaibghar.com
              </a>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
