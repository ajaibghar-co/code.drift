'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const INSTRUCTIONS_ANIMATION_MS = 520;
const INSTRUCTIONS_FILTER_BASE =
  'drop-shadow(0 20px 44px rgba(15, 23, 42, 0.22)) blur(0px) saturate(1) contrast(1)';
const INSTRUCTIONS_FILTER_SINGULARITY =
  'drop-shadow(0 0 32px rgba(15, 23, 42, 0.58)) blur(2.4px) saturate(0.82) contrast(1.08)';

type InstructionsPopupProps = {
  imageSrc: string;
  imageAlt: string;
  dialogLabel: string;
  infoIconSrc?: string;
  closeIconSrc?: string;
  background?: string;
  borderColor?: string;
};

// Instructions modal that opens on load and collapses into a floating info button.
export default function InstructionsPopup({
  imageSrc,
  imageAlt,
  dialogLabel,
  infoIconSrc = '/printables/info.png',
  closeIconSrc = '/printables/close.gif',
  background = '#F4E1B8',
  borderColor = 'rgba(167, 103, 38, 0.28)',
}: InstructionsPopupProps) {
  const [vw, setVw] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const instructionsCardRef = useRef<HTMLDivElement | null>(null);
  const infoButtonRef = useRef<HTMLButtonElement | null>(null);
  const instructionsTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = vw <= 640;
  const instructionsModalRadius = isMobile ? 20 : 28;
  const infoButtonSize = isMobile ? 58 : 76;

  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [instructionsPhase, setInstructionsPhase] = useState<
    'open' | 'opening' | 'closing' | 'closed'
  >('open');
  const [instructionsTransform, setInstructionsTransform] = useState(
    'translate3d(0, 0, 0) scale(1)'
  );
  const [instructionsOpacity, setInstructionsOpacity] = useState(1);
  const [instructionsBorderRadius, setInstructionsBorderRadius] = useState(
    `${instructionsModalRadius}px`
  );
  const [instructionsFilter, setInstructionsFilter] = useState(
    INSTRUCTIONS_FILTER_BASE
  );
  const [instructionsBackdropOpacity, setInstructionsBackdropOpacity] =
    useState(1);

  const clearInstructionsTimer = useCallback(() => {
    if (instructionsTimerRef.current !== null) {
      window.clearTimeout(instructionsTimerRef.current);
      instructionsTimerRef.current = null;
    }
  }, []);

  const prefersReducedMotion = useCallback(() => {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const getInstructionsTarget = useCallback(() => {
    const cardRect = instructionsCardRef.current?.getBoundingClientRect();
    const infoRect = infoButtonRef.current?.getBoundingClientRect();

    if (!cardRect || !infoRect) {
      return { x: 0, y: 0, scale: 0.16 };
    }

    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    const infoCenterX = infoRect.left + infoRect.width / 2;
    const infoCenterY = infoRect.top + infoRect.height / 2;
    const scale = Math.max(
      0.14,
      Math.min(
        infoRect.width / cardRect.width,
        infoRect.height / cardRect.height
      )
    );

    return {
      x: infoCenterX - cardCenterX,
      y: infoCenterY - cardCenterY,
      scale,
    };
  }, []);

  const buildSingularityTransform = useCallback(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      const squeezeX = Math.max(scale * 0.5, 0.085);
      const squeezeY = Math.max(scale * 0.04, 0.018);
      const driftX = x + (x >= 0 ? 28 : -28);
      const driftY = y + (y >= 0 ? -20 : 20);

      return `translate3d(${driftX}px, ${driftY}px, 0) rotate(17deg) skew(-26deg, 9deg) scale(${squeezeX}, ${squeezeY})`;
    },
    []
  );

  useEffect(() => {
    setInstructionsBorderRadius(`${instructionsModalRadius}px`);
  }, [instructionsModalRadius]);

  useEffect(() => {
    return () => clearInstructionsTimer();
  }, [clearInstructionsTimer]);

  const resetInstructionsState = useCallback(() => {
    setInstructionsTransform('translate3d(0, 0, 0) scale(1)');
    setInstructionsOpacity(1);
    setInstructionsBackdropOpacity(1);
    setInstructionsBorderRadius(`${instructionsModalRadius}px`);
    setInstructionsFilter(INSTRUCTIONS_FILTER_BASE);
  }, [instructionsModalRadius]);

  const finishClosingInstructions = useCallback(() => {
    setInstructionsVisible(false);
    setInstructionsPhase('closed');
    resetInstructionsState();
    instructionsTimerRef.current = null;
  }, [resetInstructionsState]);

  const closeInstructions = useCallback(() => {
    if (!instructionsVisible || instructionsPhase === 'closing') {
      return;
    }

    clearInstructionsTimer();

    if (prefersReducedMotion()) {
      finishClosingInstructions();
      return;
    }

    const singularityTransform = buildSingularityTransform(
      getInstructionsTarget()
    );

    setInstructionsPhase('closing');
    setInstructionsTransform(singularityTransform);
    setInstructionsOpacity(0.1);
    setInstructionsBackdropOpacity(0);
    setInstructionsBorderRadius('999px');
    setInstructionsFilter(INSTRUCTIONS_FILTER_SINGULARITY);

    instructionsTimerRef.current = window.setTimeout(
      finishClosingInstructions,
      INSTRUCTIONS_ANIMATION_MS
    );
  }, [
    clearInstructionsTimer,
    buildSingularityTransform,
    finishClosingInstructions,
    getInstructionsTarget,
    instructionsPhase,
    instructionsVisible,
    prefersReducedMotion,
  ]);

  const openInstructions = useCallback(() => {
    if (instructionsVisible) {
      return;
    }

    clearInstructionsTimer();
    setInstructionsTransform('translate3d(0, 0, 0) scale(0.18)');
    setInstructionsOpacity(0);
    setInstructionsBackdropOpacity(0);
    setInstructionsBorderRadius('999px');
    setInstructionsFilter(INSTRUCTIONS_FILTER_SINGULARITY);
    setInstructionsVisible(true);
    setInstructionsPhase('opening');
  }, [clearInstructionsTimer, instructionsVisible]);

  useEffect(() => {
    if (!instructionsVisible) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeInstructions();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeInstructions, instructionsVisible]);

  useEffect(() => {
    if (!instructionsVisible || instructionsPhase !== 'opening') {
      return;
    }

    clearInstructionsTimer();

    if (prefersReducedMotion()) {
      resetInstructionsState();
      setInstructionsPhase('open');
      return;
    }

    const singularityTransform = buildSingularityTransform(
      getInstructionsTarget()
    );

    setInstructionsTransform(singularityTransform);
    setInstructionsOpacity(0.1);
    setInstructionsBackdropOpacity(0);
    setInstructionsBorderRadius('999px');
    setInstructionsFilter(INSTRUCTIONS_FILTER_SINGULARITY);

    const frame = window.requestAnimationFrame(() => {
      resetInstructionsState();
    });

    instructionsTimerRef.current = window.setTimeout(() => {
      setInstructionsPhase('open');
      instructionsTimerRef.current = null;
    }, INSTRUCTIONS_ANIMATION_MS);

    return () => window.cancelAnimationFrame(frame);
  }, [
    clearInstructionsTimer,
    buildSingularityTransform,
    getInstructionsTarget,
    instructionsPhase,
    instructionsVisible,
    prefersReducedMotion,
    resetInstructionsState,
  ]);

  const showInfoButton =
    !instructionsVisible || instructionsPhase === 'closing';
  const infoAnchorInset = (isMobile ? 16 : 24) + infoButtonSize / 2;
  const instructionsTransition =
    instructionsPhase === 'opening' || instructionsPhase === 'closing'
      ? `transform ${INSTRUCTIONS_ANIMATION_MS}ms cubic-bezier(0.12, 0.88, 0.16, 1), opacity ${Math.round(
          INSTRUCTIONS_ANIMATION_MS * 0.75
        )}ms ease, border-radius ${INSTRUCTIONS_ANIMATION_MS}ms cubic-bezier(0.12, 0.88, 0.16, 1), filter ${Math.round(
          INSTRUCTIONS_ANIMATION_MS * 0.82
        )}ms ease`
      : undefined;
  const backdropTransition =
    instructionsPhase === 'opening' || instructionsPhase === 'closing'
      ? `opacity ${Math.round(INSTRUCTIONS_ANIMATION_MS * 0.72)}ms ease`
      : undefined;
  const singularityBackdrop =
    instructionsPhase === 'opening' || instructionsPhase === 'closing'
      ? `radial-gradient(circle at calc(100% - ${infoAnchorInset}px) ${infoAnchorInset}px, rgba(8, 8, 14, 0.96) 0 18px, rgba(18, 18, 28, 0.88) 18px, rgba(22, 24, 38, 0.72) 42px, rgba(15, 23, 42, 0.38) 110px, rgba(15, 23, 42, 0.2) 180px, rgba(15, 23, 42, 0.16) 100%)`
      : 'rgba(15, 23, 42, 0.28)';

  return (
    <>
      <style jsx>{`
        .floating-info-btn {
          transition: opacity 220ms ease, transform 220ms ease, filter 220ms ease;
        }

        .floating-info-btn:hover {
          transform: translateY(-4px) scale(1.04);
        }
      `}</style>

      <button
        ref={infoButtonRef}
        type="button"
        aria-label="Open instructions"
        onClick={openInstructions}
        className="floating-info-btn"
        style={{
          position: 'fixed',
          top: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 70,
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: instructionsVisible ? 'default' : 'pointer',
          opacity: showInfoButton ? 1 : 0,
          transform: showInfoButton
            ? instructionsPhase === 'closing'
              ? 'translate3d(0, 0, 0) scale(1.14)'
              : 'translate3d(0, 0, 0) scale(1)'
            : 'translate3d(0, -10px, 0) scale(0.72)',
          filter:
            instructionsPhase === 'closing'
              ? 'drop-shadow(0 0 16px rgba(8, 8, 14, 0.56))'
              : 'none',
          pointerEvents: instructionsVisible ? 'none' : 'auto',
        }}
      >
        <img
          src={infoIconSrc}
          alt="Instructions"
          style={{
            width: infoButtonSize,
            height: 'auto',
            display: 'block',
          }}
        />
      </button>

      {instructionsVisible && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
          style={{
            pointerEvents: instructionsPhase === 'closing' ? 'none' : 'auto',
          }}
        >
          <button
            type="button"
            aria-label="Close instructions overlay"
            onClick={closeInstructions}
            style={{
              position: 'absolute',
              inset: 0,
              background: singularityBackdrop,
              backdropFilter:
                instructionsPhase === 'opening' ||
                instructionsPhase === 'closing'
                  ? 'blur(8px)'
                  : 'blur(4px)',
              opacity: instructionsBackdropOpacity,
              transition: backdropTransition,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />

          <div
            ref={instructionsCardRef}
            role="dialog"
            aria-modal="true"
            aria-label={dialogLabel}
            style={{
              position: 'relative',
              zIndex: 1,
              width: 'fit-content',
              padding: isMobile ? '24px 14px 14px' : '30px 18px 18px',
              transform: instructionsTransform,
              opacity: instructionsOpacity,
              borderRadius: instructionsBorderRadius,
              transition: instructionsTransition,
              transformOrigin: 'center center',
              willChange: 'transform, opacity, filter',
              overflow: 'hidden',
              background,
              border: `3px solid ${borderColor}`,
              filter: instructionsFilter,
            }}
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              style={{
                display: 'block',
                width: 'auto',
                height: 'auto',
                maxWidth: isMobile ? 'calc(100vw - 64px)' : 'min(80vw, 760px)',
                maxHeight: '75vh',
              }}
            />

            <button
              type="button"
              aria-label="Close instructions"
              onClick={closeInstructions}
              style={{
                position: 'absolute',
                top: isMobile ? 10 : 14,
                right: isMobile ? 10 : 14,
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <img
                src={closeIconSrc}
                alt="Close"
                style={{
                  width: isMobile ? 86 : 120,
                  height: 'auto',
                  display: 'block',
                }}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
