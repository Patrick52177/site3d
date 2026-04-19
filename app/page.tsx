"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

// ─── WARP SPEED TRANSITION ────────────────────────────────────────────────────
// CSS-only star streaks drawn on a canvas-like SVG, then a flash
function WarpTransition({ onComplete }) {
  const streakCount = 80;

  const streaks = Array.from({ length: streakCount }, (_, i) => {
    const angle = (i / streakCount) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 18 + Math.random() * 42; // % from center
    const length = 8 + Math.random() * 22; // % length
    const cx = 50 + Math.cos(rad) * dist;
    const cy = 50 + Math.sin(rad) * dist;
    const ex = 50 + Math.cos(rad) * (dist + length);
    const ey = 50 + Math.sin(rad) * (dist + length);
    const delay = Math.random() * 0.18;
    const opacity = 0.3 + Math.random() * 0.7;
    const width = 0.5 + Math.random() * 1.5;
    return { cx, cy, ex, ey, delay, opacity, width };
  });

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.75, times: [0, 0.08, 0.82, 1], ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Star streak SVG — lines shoot from centre outward */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1, 2.5] }}
        transition={{ duration: 0.75, times: [0, 0.4, 1], ease: [0.4, 0, 1, 1] }}
      >
        {streaks.map((s, i) => (
          <motion.line
            key={i}
            x1={s.cx} y1={s.cy}
            x2={s.cx} y2={s.cy}
            stroke="#fbbf24"
            strokeWidth={s.width}
            strokeLinecap="round"
            opacity={0}
            animate={{
              x2: [s.cx, s.ex],
              y2: [s.cy, s.ey],
              opacity: [0, s.opacity, 0],
            }}
            transition={{
              duration: 0.55,
              delay: s.delay,
              ease: [0.2, 0, 0.8, 1],
            }}
          />
        ))}

        {/* Blue-white streaks mixed in for depth */}
        {Array.from({ length: 30 }, (_, i) => {
          const angle = (i / 30) * 360 + 6;
          const rad = (angle * Math.PI) / 180;
          const dist = 5 + Math.random() * 30;
          const length = 14 + Math.random() * 28;
          const cx = 50 + Math.cos(rad) * dist;
          const cy = 50 + Math.sin(rad) * dist;
          const ex = 50 + Math.cos(rad) * (dist + length);
          const ey = 50 + Math.sin(rad) * (dist + length);
          return (
            <motion.line
              key={`b${i}`}
              x1={cx} y1={cy} x2={cx} y2={cy}
              stroke="#e0f0ff"
              strokeWidth={0.4 + Math.random()}
              strokeLinecap="round"
              opacity={0}
              animate={{
                x2: [cx, ex],
                y2: [cy, ey],
                opacity: [0, 0.4 + Math.random() * 0.5, 0],
              }}
              transition={{
                duration: 0.5,
                delay: 0.05 + Math.random() * 0.2,
                ease: [0.2, 0, 0.9, 1],
              }}
            />
          );
        })}
      </motion.svg>

      {/* Central tunnel vortex glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.6) 30%, rgba(251,191,36,0.1) 65%, transparent 100%)",
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width: ["0px", "60px", "900px"],
          height: ["0px", "60px", "900px"],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 0.7, times: [0, 0.25, 1], ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Pure white flash at peak */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9, 0] }}
        transition={{ duration: 0.4, times: [0, 0.55, 0.72, 1], ease: "easeOut" }}
      />
    </motion.div>
  );
}

export default function Home() {
  const [view, setView] = useState("hero");       // "hero" | "menu"
  const [warping, setWarping] = useState(false);
  const [targetView, setTargetView] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const cardsRef = useRef(null);
  const heroScrollRef = useRef(null); // saves hero scroll position

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  // ── Trigger warp then switch view ────────────────────────────────────────
  const warpTo = useCallback((dest) => {
    if (warping) return;
    setTargetView(dest);
    setWarping(true);
  }, [warping]);

  const handleWarpComplete = useCallback(() => {
    setWarping(false);
    setView(targetView);
    if (targetView === "menu") {
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => {
        cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setTargetView(null);
  }, [targetView]);

  // ── Hero scroll reaching end → warp to menu ───────────────────────────────
  const handleEnterMenu = useCallback(() => {
    warpTo("menu");
  }, [warpTo]);

  // ── Menu: when user scrolls to very top (scrollY ~ 0) → warp back ────────
  useEffect(() => {
    if (view !== "menu") return;

    let lastY = window.scrollY;
    let topCount = 0; // how many frames we've been at 0

    const onScroll = () => {
      const currentY = window.scrollY;
      const goingUp = currentY < lastY;
      lastY = currentY;

      if (currentY === 0 && goingUp) {
        topCount++;
        if (topCount >= 2) warpTo("hero");
      } else {
        topCount = 0;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [view, warpTo]);

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      return ex
        ? prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
    });
    setToast(item.name);
    setTimeout(() => setToast(null), 2600);
  };

  const handleUpdateQty = (id, delta) =>
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );

  const handleRemove = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        html { scroll-behavior: smooth; }
        body {
          background: #050401;
          color: white;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        ::selection { background: rgba(251,191,36,0.22); color: #fbbf24; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.18); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(251,191,36,0.38); }
      `}</style>

      <div className="bg-[#050401]">
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        {/* Hero — kept in DOM but hidden during menu to preserve 3D state */}
        <div style={{ display: view === "hero" ? "block" : "none" }}>
          <Hero onEnterMenu={handleEnterMenu} />
        </div>

        {/* Menu */}
        {view === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Menu
              onAddToCart={handleAddToCart}
              cardsRef={cardsRef}
            />
            <Footer />
          </motion.div>
        )}

        {/* ── Warp transition overlay ── */}
        <AnimatePresence>
          {warping && (
            <WarpTransition
              key="warp"
              onComplete={handleWarpComplete}
            />
          )}
        </AnimatePresence>

        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
        />

        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-[#1a1309] border border-amber-400/22 px-5 py-3.5 rounded-full shadow-2xl shadow-black/60 backdrop-blur-xl whitespace-nowrap"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white/75 text-xs tracking-wide">
                <span className="text-amber-400">{toast}</span> added to your order
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}