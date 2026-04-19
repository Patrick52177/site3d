"use client";
import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const SCROLL_HEIGHT = 6; // 600vh

export default function Hero({ onEnterMenu }) {
  const scrollProgress = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const containerRef = useRef(null);
  const triggered = useRef(false);

  const { scrollYProgress } = useScroll({ target: containerRef });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      scrollProgress.current = v;
      if (v >= 0.97 && !triggered.current) {
        triggered.current = true;
        onEnterMenu();
      }
    });
    return unsub;
  }, [scrollYProgress, onEnterMenu]);

  const handleMouseMove = useCallback((e) => {
    mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  const heroOpacity      = useTransform(scrollYProgress, [0, 0.12, 0.20], [1, 1, 0]);
  const heroY            = useTransform(scrollYProgress, [0, 0.22], ["0%", "-8%"]);
  const approachOpacity  = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0, 1, 1, 0]);
  const enterOpacity     = useTransform(scrollYProgress, [0.32, 0.38, 0.50, 0.56], [0, 1, 1, 0]);
  const insideOpacity    = useTransform(scrollYProgress, [0.52, 0.58, 0.70, 0.76], [0, 1, 1, 0]);
  const ctaOpacity       = useTransform(scrollYProgress, [0.82, 0.90], [0, 1]);
  const ctaY             = useTransform(scrollYProgress, [0.82, 0.90], [24, 0]);
  const hintOpacity      = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const vignetteOpacity  = useTransform(scrollYProgress, [0.30, 0.42, 0.52, 0.62], [0, 0.85, 0.85, 0]);
  const blurAmount       = useTransform(scrollYProgress, [0.36, 0.42, 0.48], [0, 7, 0]);
  const blurFilter       = useTransform(blurAmount, (v) => `blur(${v}px)`);
  const finalScale       = useTransform(scrollYProgress, [0.88, 1.0], [1, 1.14]);
  const progressWidth    = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_HEIGHT * 100}vh` }}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* 3D Canvas with final zoom */}
        <motion.div className="absolute inset-0" style={{ scale: finalScale }}>
          <Scene3D scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />
        </motion.div>

        {/* Blur at door */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ backdropFilter: blurFilter, WebkitBackdropFilter: blurFilter }}
        />

        {/* Door vignette */}
        <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: vignetteOpacity }} />

        {/* Radial vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.72) 100%)" }} />

        {/* STAGE 0 — Title */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="h-px w-14 bg-amber-400/55" />
              <span className="text-amber-400 text-[9px] tracking-[0.45em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                A Cinematic Dining Experience
              </span>
              <div className="h-px w-14 bg-amber-400/55" />
            </div>
            <h1 className="text-white leading-none mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(5rem, 13vw, 10rem)",
                fontWeight: 300,
                textShadow: "0 4px 60px rgba(0,0,0,0.9)",
              }}>
              Velour
            </h1>
            <p className="text-white/45 text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Fine Dining · Est. 2012
            </p>
          </motion.div>
        </motion.div>

        {/* STAGE 1 — Approaching */}
        <motion.div style={{ opacity: approachOpacity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="text-white/65 text-xs tracking-[0.38em] uppercase mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            You are approaching the entrance
          </p>
          <div className="w-px h-9 bg-gradient-to-b from-amber-400/55 to-transparent mx-auto" />
        </motion.div>

        {/* STAGE 2 — Welcome */}
        <motion.div style={{ opacity: enterOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="h-px w-20 bg-amber-400/50 mx-auto mb-6" />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "0.4em",
            }}>Welcome</p>
            <p className="text-amber-400/65 text-[9px] tracking-[0.5em] uppercase mt-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Please step inside
            </p>
          </div>
        </motion.div>

        {/* STAGE 3 — Interior */}
        <motion.div style={{ opacity: insideOpacity }}
          className="absolute top-14 left-14 pointer-events-none">
          <p className="text-white/28 text-[9px] tracking-[0.42em] uppercase mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            You are inside
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.7rem", fontWeight: 300,
            color: "rgba(255,255,255,0.72)",
          }}>
            The Dining Room
          </p>
        </motion.div>

        {/* STAGE 4 — CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
        >
          <p className="text-white/45 text-[9px] tracking-[0.42em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tonight's menu awaits
          </p>
          <motion.button
            onClick={onEnterMenu}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(251,191,36,0.45)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-amber-400 text-black text-[10px] tracking-[0.28em] uppercase font-semibold px-9 py-4 rounded-full overflow-hidden"
          >
            <span className="relative z-10">View the Menu</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-white/28 text-[9px] tracking-[0.42em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Scroll to enter
          </span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-amber-400/45 to-transparent"
          />
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-amber-400/40 pointer-events-none"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
}