"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

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

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
          -moz-osx-font-smoothing: grayscale;
        }

        ::selection {
          background: rgba(251,191,36,0.22);
          color: #fbbf24;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(251,191,36,0.18);
          border-radius: 99px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(251,191,36,0.38);
        }
      `}</style>

      <div className="min-h-screen bg-[#050401]">
        {/* Navbar overlaid on top */}
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

        {/* Immersive Hero: 600vh scroll-driven 3D experience */}
        <Hero onOrderClick={scrollToMenu} />

        {/* Menu section appears after the journey */}
        <div ref={menuRef}>
          <Menu onAddToCart={handleAddToCart} />
        </div>

        <Footer />

        {/* Cart drawer */}
        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
        />

        {/* Add-to-cart toast */}
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
              <span className="text-white/75 text-xs tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="text-amber-400">{toast}</span>{" "}added to your order
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}