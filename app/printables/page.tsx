'use client';

import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const TEXT_COLOR = '#0F172A';

const WORDS = [
'Somehing edible',
'Sharp edges',
'Repeating motif',
'Patterns',
'Shop signs ',
'Building signs',
'Movie Posters',
'A distant sound',
'A nearby sound',
'Hawker sounds',
'Street food',
'Speakings in local dialect',
'Everyday Sounds',
'Loud Sound/ visual',
'Textiles',
'Rhythmic sounds ',
'Nature sounds',
'Behind the scenes',
'Typography',
'Wall paintings',
'Architecture',
'Houses',
'Toys ',
'Something uninteresting',
'A pastel colored something',
'Chalkboard signs',
'Daily Special Boards',
'Animals on the street',
'Trees',
'Vegetables and Fruits',
'A clinking sound',
'Drain Covers',
'Clusters of Wires',
'A cacaphony',
'Graffiti',
'Birds',
'Source of Water',
'Sound of Freedom',
'Market scenes',
'Places of play',
'Park'
];

function hashStr(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
  return h;
}

function fontSizeForText(text: string, cellW: number) {
  const len = text.length;
  const base = cellW > 220 ? 22 : cellW > 180 ? 20 : 18;
  if (len <= 18) return base;
  if (len <= 30) return Math.max(14, base - 2);
  if (len <= 50) return Math.max(13, base - 4);
  if (len <= 80) return Math.max(12, base - 6);
  return Math.max(11, base - 8);
}

const SHAPE_COUNT = 8;
function shapeIndexForCell(word: string, idx: number) {
  const h = hashStr(`${word}|${idx}`);
  return (h % SHAPE_COUNT) + 1;
}

function rotationForCell(word: string, idx: number) {
  const h = hashStr(`rot|${word}|${idx}`);
  return ((h % 15) - 7) * 0.5;
}

// dimensions of your template PNG (change if different)
const TEMPLATE_WIDTH = 1447;
const TEMPLATE_HEIGHT = 2048;

// where the bingo grid should go inside the template
const PRINT_GRID_LEFT = 130;
const PRINT_GRID_TOP = 420;
const PRINT_GRID_RIGHT_MARGIN = 130;
const PRINT_GRID_GAP = 24;

// PRINT SCALE — only used for the PDF (hidden print layout)
const PRINT_SCALE = 0.9;

export default function PrintablesPage() {
  const [grid, setGrid] = useState<string[]>(() => WORDS.slice(0, 9));

  const [vw, setVw] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = vw <= 640;

  const containerWidth = Math.min(780, Math.max(320, Math.floor(vw * 0.92)));
  const gridGap = isMobile ? 6 : 10;
  const cellW = Math.floor((containerWidth - gridGap * 2) / 3);
  const cellH = Math.round(cellW * 0.7);

  const shuffle = useCallback(() => {
    const copy = [...WORDS];
    const out: string[] = [];
    for (let i = 0; i < 9 && copy.length > 0; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    setGrid(out);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!printRef.current) return;

    // dynamic imports so this still works in Next.js
    const [{ default: html2canvas }, { jsPDF }] =
      await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

    // 1) capture the hidden print layout (PNG + bingo grid) as image
    const canvas = await html2canvas(printRef.current, {
      useCORS: true,
    } as any);

    const imgData = canvas.toDataURL('image/png');

    // 2) create a one-page PDF from that image using jsPDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);

    // directly trigger download of the bingo-only PDF
    pdf.save('potion ingredient list.pdf');
  }, []);

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: gridGap,
    width: cellW * 3 + gridGap * 2,
    padding: gridGap,
    boxSizing: 'border-box',
  };

  // styles used for the hidden print layout
  const printGridWidth =
    TEMPLATE_WIDTH - PRINT_GRID_LEFT - PRINT_GRID_RIGHT_MARGIN;
  const printCellW = Math.floor(
    (printGridWidth - PRINT_GRID_GAP * 2) / 3
  );
  const printCellH = Math.round(printCellW * 0.7);

  // compute full (unscaled) print grid height so we can offset when scaling
  const printGridHeight = printCellH * 3 + PRINT_GRID_GAP * 2;

  // when we scale the grid about its top-left, it will shrink towards top-left.
  // to keep the *center* of the scaled grid matching the center of the original,
  // offset left/top by half the difference.
  const adjustedPrintLeft =
    PRINT_GRID_LEFT + (printGridWidth - printGridWidth * PRINT_SCALE) / 2;
  const adjustedPrintTop =
    PRINT_GRID_TOP + (printGridHeight - printGridHeight * PRINT_SCALE) / 2;

  return (
    <>
      {/* VISIBLE PAGE – unchanged layout */}
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: '#F4E1B8',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="max-w-6xl w-full px-4 py-8 flex flex-col items-center"
          style={{ position: 'relative', zIndex: 2 }}
        >

<header className="text-center mb-6" style={{ marginTop: isMobile ? -10 : -30 }}>
  {/* MAIN HEADING */}
  <img
    src="/printables/heading.png"
    alt="Printables"
    style={{
      display: 'block',
      margin: '0 auto',
      width: isMobile ? 240 : 400,
      height: 'auto',
    }}
  />

  {/* SUBHEADING */}
  <img
    src="/printables/subHead.png"
    alt="Subheading"
    style={{
      display: 'block',
      margin: isMobile ? '20px auto 0' : '32px auto 0',  // ← increased spacing
      marginTop: '60px',
      width: isMobile ? 200 : 330,
      height: 'auto',
    }}
  />
</header>



          <div
            style={{
              padding: isMobile ? 12 : 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? 12 : 20,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? 12 : 20,
              }}
            >
              {/* GRID (screen) */}
              <div style={gridStyle}>
                {grid.map((word, idx) => {
                  const shapeIndex = shapeIndexForCell(word, idx);
                  const rot = rotationForCell(word, idx);
                  const fontSize = fontSizeForText(word, cellW);

                  return (
                    <div
                      key={`${word}-${idx}`}
                      className="relative flex items-center justify-center"
                      style={{
                        height: cellH,
                        transform: `rotate(${rot}deg)`,
                        padding: 4,
                        boxSizing: 'border-box',
                      }}
                    >
                      <img
                        src={`/shapes/shape${shapeIndex}.png`}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transform: 'scale(1.1)',
                          pointerEvents: 'none',
                        }}
                      />

                      <div
                        style={{
                          position: 'relative',
                          zIndex: 4,
                          pointerEvents: 'none',
                          fontFamily: inter.style.fontFamily,
                          color: TEXT_COLOR,
                          fontSize,
                          textAlign: 'center',
                          padding: '4px 6px',
                          width: '70%',
                          wordBreak: 'break-word',
                        }}
                      >
                        {word}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  gap: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* SHUFFLE BUTTON PNG */}
                <img
                  src="/shapes/shuffle.png"
                  alt="Shuffle"
                  onClick={shuffle}
                  style={{
                    width: isMobile ? 52 : 170,
                    height: 'auto',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                />

                {/* DOWNLOAD BUTTON PNG */}
                <img
                  src="/shapes/download.png"
                  alt="Download"
                  onClick={handleDownload}
                  style={{
                    width: isMobile ? 52 : 170,
                    height: 'auto',
                    cursor: 'pointer',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIDDEN PRINT LAYOUT – template PNG + bingo grid (scaled only for PDF) */}
      <div
        ref={printRef}
        style={{
          all: 'initial',
          position: 'fixed',
          left: -9999,
          top: 0,
          width: TEMPLATE_WIDTH,
          height: TEMPLATE_HEIGHT,
          backgroundImage: "url('/printables/bingo_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          display: 'block',
        }}
      >
        {/* wrapper is offset so the scaled inner grid stays centered */}
        <div
          style={{
            position: 'absolute',
            left: adjustedPrintLeft,
            top: adjustedPrintTop,
            width: printGridWidth,
            height: printGridHeight,
            boxSizing: 'border-box',
            // we scale the *inner* content from top-left, while having already offset
            transform: `scale(${PRINT_SCALE})`,
            transformOrigin: 'top left',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: PRINT_GRID_GAP,
          }}
        >
          {grid.map((word, idx) => {
            const shapeIndex = shapeIndexForCell(word, idx);
            const rot = rotationForCell(word, idx);
            const fontSize = fontSizeForText(word, printCellW);

            return (
              <div
                key={`print-${word}-${idx}`}
                className="relative flex items-center justify-center"
                style={{
                  height: printCellH,
                  transform: `rotate(${rot}deg)`,
                  padding: 4,
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={`/shapes/shape${shapeIndex}.png`}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: 'scale(1.1)',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 4,
                    pointerEvents: 'none',
                    fontFamily: inter.style.fontFamily,
                    color: TEXT_COLOR,
                    fontSize,
                    textAlign: 'center',
                    padding: '4px 6px',
                    width: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  {word}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
