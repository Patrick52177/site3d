"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "hero" | "menu";

// MenuItem from Menu.tsx — no qty, that's added when put in cart
interface CartItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  badge: string | null;
  img: string;
  qty: number;
}

// ─── WARP SPEED TRANSITION ────────────────────────────────────────────────────
function WarpTransition({ onComplete }: { onComplete: () => void }) {
  const streakCount = 80;

  const streaks = Array.from({ length: streakCount }, (_, i) => {
    const angle = (i / streakCount) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 18 + Math.random() * 42;
    const length = 8 + Math.random() * 22;
    const cx = 50 + Math.cos(rad) * dist;
    const cy = 50 + Math.sin(rad) * dist;
    const ex = 50 + Math.cos(rad) * (dist + length);
    const ey = 50 + Math.sin(rad) * (dist + length);
    const delay = Math.random() * 0.18;
    const opacity = 0.3 + Math.random() * 0.7;
    const width = 0.5 + Math.random() * 1.5;
    return { cx, cy, ex, ey, delay, opacity, width };
  });

  const blueStreaks = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360 + 6;
    const rad = (angle * Math.PI) / 180;
    const dist = 5 + Math.random() * 30;
    const length = 14 + Math.random() * 28;
    const cx = 50 + Math.cos(rad) * dist;
    const cy = 50 + Math.sin(rad) * dist;
    const ex = 50 + Math.cos(rad) * (dist + length);
    const ey = 50 + Math.sin(rad) * (dist + length);
    const delay = 0.05 + Math.random() * 0.2;
    const opacity = 0.4 + Math.random() * 0.5;
    return { cx, cy, ex, ey, delay, opacity };
  });

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.75, times: [0, 0.08, 0.82, 1], ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
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
            x1={s.cx} y1={s.cy} x2={s.cx} y2={s.cy}
            stroke="#fbbf24"
            strokeWidth={s.width}
            strokeLinecap="round"
            opacity={0}
            animate={{ x2: [s.cx, s.ex], y2: [s.cy, s.ey], opacity: [0, s.opacity, 0] }}
            transition={{ duration: 0.55, delay: s.delay, ease: [0.2, 0, 0.8, 1] }}
          />
        ))}
        {blueStreaks.map((s, i) => (
          <motion.line
            key={`b${i}`}
            x1={s.cx} y1={s.cy} x2={s.cx} y2={s.cy}
            stroke="#e0f0ff"
            strokeWidth={0.4 + Math.random()}
            strokeLinecap="round"
            opacity={0}
            animate={{ x2: [s.cx, s.ex], y2: [s.cy, s.ey], opacity: [0, s.opacity, 0] }}
            transition={{ duration: 0.5, delay: s.delay, ease: [0.2, 0, 0.9, 1] }}
          />
        ))}
      </motion.svg>

      <motion.div
        className="absolute rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.6) 30%, rgba(251,191,36,0.1) 65%, transparent 100%)",
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: ["0px", "60px", "900px"], height: ["0px", "60px", "900px"], opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, times: [0, 0.25, 1], ease: [0.4, 0, 0.2, 1] }}
      />

      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9, 0] }}
        transition={{ duration: 0.4, times: [0, 0.55, 0.72, 1], ease: "easeOut" }}
      />
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState<View>("hero");
  const [heroKey, setHeroKey] = useState(0);
  const [warping, setWarping] = useState<boolean>(false);
  const [targetView, setTargetView] = useState<View | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const warpTo = useCallback((dest: View) => {
    if (warping) return;
    setTargetView(dest);
    setWarping(true);
  }, [warping]);

  const handleWarpComplete = useCallback(() => {
    if (!targetView) return;
    setWarping(false);
    setView(targetView);
    if (targetView === "hero") {
      setHeroKey(k => k + 1); // force Hero remount → fresh scroll state
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (targetView === "menu") {
      setTimeout(() => {
        cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
    setTargetView(null);
  }, [targetView]);

  const handleEnterMenu = useCallback(() => {
    warpTo("menu");
  }, [warpTo]);

  // In menu: scroll UP past top → warp back to hero
  useEffect(() => {
    if (view !== "menu") return;

    let active = false;
    let fired = false;
    const enableTimer = setTimeout(() => { active = true; }, 800);

    const onWheel = (e: WheelEvent) => {
      if (!active || fired) return;
      if (window.scrollY === 0 && e.deltaY < 0) {
        fired = true;
        warpTo("hero");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      clearTimeout(enableTimer);
      window.removeEventListener("wheel", onWheel);
    };
  }, [view, warpTo]);

  const handleAddToCart = useCallback((item: Omit<CartItem, "qty">) => {
    setCartItems((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      return ex
        ? prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
    });
    setToast(item.name);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const handleUpdateQty = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

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

        {/* Hero — key forces remount each visit, resetting all scroll state */}
        {view === "hero" && (
          <Hero key={heroKey} onEnterMenu={handleEnterMenu} />
        )}

        {view === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Menu onAddToCart={handleAddToCart} cardsRef={cardsRef} />
            <Footer />
          </motion.div>
        )}

        <AnimatePresence>
          {warping && (
            <WarpTransition key="warp" onComplete={handleWarpComplete} />
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