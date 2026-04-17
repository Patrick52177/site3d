"use client";
import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy-load 3D scene (avoids SSR issues)
const Scene3D = dynamic(() => import("./Scene3d"), { ssr: false });

// How many viewport-heights the scroll container spans
const SCROLL_HEIGHT = 6; // 600vh

export default function Hero({ onOrderClick }) {
  // Refs passed as plain objects to the 3D scene — no re-renders
  const scrollProgress = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const containerRef = useRef(null);

  // useScroll over the tall container
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Write to ref (not state) so the canvas reads it per-frame without triggering React
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      scrollProgress.current = v;
    });
    return unsub;
  }, [scrollYProgress]);

  // Mouse parallax
  const handleMouseMove = useCallback((e) => {
    mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  // ── Framer Motion: UI layers keyed to scroll ──────────────────────────────
  // Hero text: visible 0–0.18
  const heroOpacity = useTransform(scrollYProgress, [0, 0.14, 0.22], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], ["0%", "-6%"]);

  // "Approaching" label: visible 0.15–0.35
  const approachOpacity = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0, 1, 1, 0]);

  // "Entering" doorway pulse: 0.35–0.5
  const enterOpacity = useTransform(scrollYProgress, [0.32, 0.38, 0.48, 0.55], [0, 1, 1, 0]);

  // Inside label: 0.5–0.65
  const insideOpacity = useTransform(scrollYProgress, [0.5, 0.56, 0.64, 0.7], [0, 1, 1, 0]);

  // Vignette: gets stronger mid-journey (door transition)
  const vignetteOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.5, 0.62], [0, 0.85, 0.85, 0]);

  // Scroll indicator: fades out after first scroll
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // FOV blur effect at door threshold
  const blurAmount = useTransform(scrollYProgress, [0.36, 0.42, 0.48], [0, 6, 0]);
  const blurFilter = useTransform(blurAmount, (v) => `blur(${v}px)`);

  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_HEIGHT * 100}vh` }}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      {/* ── Sticky 3D Canvas ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Scene fills entire viewport */}
        <div className="absolute inset-0">
          <Scene3D
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </div>

        {/* ── Blur overlay at door transition ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ backdropFilter: blurFilter, WebkitBackdropFilter: blurFilter }}
        />

        {/* ── Black vignette for door pass-through ── */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: vignetteOpacity }}
        />

        {/* ── Radial vignette always present ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 0: Exterior hero text
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-amber-400/60" />
              <span className="text-amber-400 text-[9px] tracking-[0.4em] uppercase">
                A Cinematic Dining Experience
              </span>
              <div className="h-px w-12 bg-amber-400/60" />
            </div>

            <h1
              className="text-white text-center leading-none mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(4rem, 11vw, 9rem)",
                fontWeight: 300,
                textShadow: "0 2px 40px rgba(0,0,0,0.8)",
              }}
            >
              Velour
            </h1>
            <p
              className="text-white/50 text-sm tracking-[0.25em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Fine Dining · Est. 2012
            </p>
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 1: Approach label
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: approachOpacity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        >
          <p
            className="text-white/70 text-xs tracking-[0.35em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            You are approaching the entrance
          </p>
          <div className="mt-3 mx-auto w-px h-8 bg-gradient-to-b from-amber-400/60 to-transparent" />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 2: Entering overlay
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: enterOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <div
              className="text-white/90 tracking-[0.5em] uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.2rem, 4vw, 2.2rem)",
                fontWeight: 300,
              }}
            >
              Welcome
            </div>
            <div className="mt-2 text-amber-400/80 text-[9px] tracking-[0.45em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Please step inside
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 3: Interior greeting
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: insideOpacity }}
          className="absolute top-10 left-10 md:top-14 md:left-14 pointer-events-none"
        >
          <div
            className="text-white/40 text-[9px] tracking-[0.4em] uppercase mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            You are inside
          </div>
          <div
            className="text-white/70"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 300,
            }}
          >
            The dining room
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Scroll hint (first viewport only)
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span
            className="text-white/30 text-[9px] tracking-[0.4em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Scroll to enter
          </span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-amber-400/50 to-transparent"
          />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            Order CTA — appears in final stage (menu area)
        ════════════════════════════════════════════════════════════════════ */}
        <FinalCTA scrollYProgress={scrollYProgress} onOrderClick={onOrderClick} />
      </div>
    </div>
  );
}

// ─── Final CTA that appears when user reaches the table ──────────────────────
function FinalCTA({ scrollYProgress, onOrderClick }) {
  const opacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);
  const y = useTransform(scrollYProgress, [0.82, 0.9], [20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
    >
      <p
        className="text-white/50 text-[9px] tracking-[0.4em] uppercase"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Tonight's menu awaits
      </p>
      <motion.button
        onClick={onOrderClick}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(251,191,36,0.4)" }}
        whileTap={{ scale: 0.96 }}
        className="group relative bg-amber-400 text-black text-[10px] tracking-[0.25em] uppercase font-semibold px-9 py-4 rounded-full overflow-hidden"
      >
        <span className="relative z-10">View the Menu</span>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </motion.div>
  );
}