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
  'Something edible',
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
  'Loud Sound/Visual',
  'Textiles',
  'Rhythmic sounds',
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
  'Park',
  'Street signs'
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

  // animation state flags
  const [shuffleAnimating, setShuffleAnimating] = useState(false);
  const [downloadAnimating, setDownloadAnimating] = useState(false);

  const shuffle = useCallback(() => {
    // trigger animation
    setShuffleAnimating(true);
    // ensure animation flag resets even if something crashes
    window.setTimeout(() => setShuffleAnimating(false), 600);

    const copy = [...WORDS];
    const out: string[] = [];
    for (let i = 0; i < 9 && copy.length > 0; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    setGrid(out);
  }, []);

  const handleDownload = useCallback(async () => {
    setDownloadAnimating(true);
    window.setTimeout(() => setDownloadAnimating(false), 700);
  
    if (!printRef.current) return;
  
    const [
      { default: html2canvas },
      { jsPDF },
      { PDFDocument },
    ] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
      import('pdf-lib'),
    ]);
  
    /* ------------------------------
       1) Capture bingo as image
    ------------------------------ */
    const canvas = await html2canvas(printRef.current, {
      useCORS: true,
    } as any);
  
    const imgData = canvas.toDataURL('image/png');
  
    /* ------------------------------
       2) Create bingo PDF (jsPDF)
    ------------------------------ */
    const bingoPdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
  
    const pageWidth = bingoPdf.internal.pageSize.getWidth();
    const pageHeight = bingoPdf.internal.pageSize.getHeight();
  
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const y = (pageHeight - imgHeight) / 2;
  
    bingoPdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
  
    // IMPORTANT: get bytes instead of saving
    const bingoPdfBytes = bingoPdf.output('arraybuffer');
  
    /* ------------------------------
       3) Load Card deck.pdf
    ------------------------------ */
    const deckResponse = await fetch('/printables/Card deck.pdf');
    const deckBytes = await deckResponse.arrayBuffer();
  
    /* ------------------------------
       4) Merge using pdf-lib
    ------------------------------ */
    const mergedPdf = await PDFDocument.create();
  
    const deckDoc = await PDFDocument.load(deckBytes);
    const bingoDoc = await PDFDocument.load(bingoPdfBytes);
  
    const bingoPages = await mergedPdf.copyPages(
      bingoDoc,
      bingoDoc.getPageIndices()
    );
    bingoPages.forEach((p) => mergedPdf.addPage(p));
    
    const deckPages = await mergedPdf.copyPages(
      deckDoc,
      deckDoc.getPageIndices()
    );
    deckPages.forEach((p) => mergedPdf.addPage(p));
  
  
    /* ------------------------------
       5) Download combined PDF
    ------------------------------ */
    const mergedBytes = await mergedPdf.save();

    // Convert Uint8Array → ArrayBuffer (TS-safe)
    const pdfArrayBuffer = mergedBytes.buffer.slice(
      mergedBytes.byteOffset,
      mergedBytes.byteOffset + mergedBytes.byteLength
    );
    
    const blob = new Blob([pdfArrayBuffer as ArrayBuffer], {
      type: 'application/pdf',
    });
        const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'card-deck-with-bingo.pdf';
    a.click();
  
    URL.revokeObjectURL(url);
  }, []);
  

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: gridGap,
    width: cellW * 3 + gridGap * 2,
    padding: gridGap,
    boxSizing: 'border-box',
    transform: "scale(0.90)", 
    transformOrigin: "center center"
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
      {/* local styles for button animations */}
      <style jsx>{`
        .btn {
          transition: transform 180ms cubic-bezier(.2,.9,.3,1), filter 150ms;
          will-change: transform;
          cursor: pointer;
          display: block;
        }

        .btn:hover {
          transform: translateY(-6px) scale(1.03);
        }

        /* shuffle: short shake + spin effect */
        @keyframes shuffle-shake {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-12deg) scale(1.06); }
          50% { transform: rotate(12deg) scale(1.04); }
          75% { transform: rotate(-6deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }

        .shuffle-anim {
          animation: shuffle-shake 560ms cubic-bezier(.2,.9,.3,1);
        }

        /* download: pop + stretch 'elastic' feel */
        @keyframes download-pop {
          0% { transform: scale(1); }
          35% { transform: scale(1.18); }
          65% { transform: scale(0.94); }
          100% { transform: scale(1); }
        }

        .download-anim {
          animation: download-pop 700ms cubic-bezier(.2,.9,.3,1);
        }

.btn:focus {
  outline: none;
}

.btn:focus-visible {
  outline: 3px solid rgba(0,0,0,0.12);
  outline-offset: 4px;
}

      `}</style>

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

          <header className="text-center mb-6" style={{ marginTop: isMobile ? -10 : -10 }}>
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
                margin: isMobile ? '20px auto 0' : '32px auto 0',  
                marginTop: '60px',
                width: isMobile ? 200 : 330,
                height: 'auto',
              }}
            />
          </header>



          <div
            style={{
              padding: isMobile ? 12 : 18,
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
                  gap: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* SHUFFLE BUTTON PNG */}
                <img
                  src="/shapes/shuffle.png"
                  alt="Shuffle"
                  onClick={shuffle}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') shuffle(); }}
                  className={`btn ${shuffleAnimating ? 'shuffle-anim' : ''}`}
                  style={{
                    width: isMobile ? 52 : 170,
                    height: 'auto',
                  }}
                />

                {/* DOWNLOAD BUTTON PNG */}
                <img
                  src="/shapes/download.png"
                  alt="Download"
                  onClick={handleDownload}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDownload(); }}
                  className={`btn ${downloadAnimating ? 'download-anim' : ''}`}
                  style={{
                    width: isMobile ? 52 : 170,
                    height: 'auto',
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
