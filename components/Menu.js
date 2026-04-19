"use client";
import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

// ─── Food background images (Unsplash, free) ─────────────────────────────────
// Each dish has a real food photo URL for the background reveal
const MENU_DATA = {
  Starters: [
    {
      id: 1, name: "Truffle Arancini", emoji: "🍄",
      desc: "Crispy risotto balls, black truffle shavings, 24-month parmesan foam, microgreens.",
      price: 18, badge: "Chef's Pick",
      img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&q=80&fit=crop",
    },
    {
      id: 2, name: "Bluefin Tartare", emoji: "🐟",
      desc: "Sashimi-grade tuna, yuzu gel, avocado mousse, nori crisp, toasted sesame.",
      price: 24, badge: null,
      img: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=1600&q=80&fit=crop",
    },
    {
      id: 3, name: "Burrata Royale", emoji: "🫙",
      desc: "Stracciatella burrata, heirloom tomatoes, aged balsamic reduction, basil oil.",
      price: 19, badge: "Seasonal",
      img: "https://images.unsplash.com/photo-1488477181228-c01c53ba11bf?w=1600&q=80&fit=crop",
    },
  ],
  Mains: [
    {
      id: 4, name: "A5 Wagyu Striploin", emoji: "🥩",
      desc: "Japanese A5 wagyu, smoked bone marrow jus, black garlic, pomme purée.",
      price: 72, badge: "Signature",
      img: "https://images.unsplash.com/photo-1558030006-450675393462?w=1600&q=80&fit=crop",
    },
    {
      id: 5, name: "Butter-Poached Lobster", emoji: "🦞",
      desc: "Cold-water lobster tail, saffron bisque, fennel confit, oscietra caviar.",
      price: 78, badge: null,
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&fit=crop",
    },
    {
      id: 6, name: "Wild Mushroom Risotto", emoji: "🍚",
      desc: "Aged carnaroli, porcini & chanterelle, white truffle oil, 36-month parmigiano.",
      price: 42, badge: "Vegetarian",
      img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1600&q=80&fit=crop",
    },
  ],
  Desserts: [
    {
      id: 7, name: "Valrhona Soufflé", emoji: "🍫",
      desc: "Warm 72% dark chocolate soufflé, Tahitian vanilla bean ice cream.",
      price: 16, badge: null,
      img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1600&q=80&fit=crop",
    },
    {
      id: 8, name: "Burnt Citrus Tart", emoji: "🍋",
      desc: "Lemon-yuzu curd, Italian meringue torch-kissed, gold leaf, shortbread.",
      price: 14, badge: "New",
      img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600&q=80&fit=crop",
    },
    {
      id: 9, name: "Mille-Feuille", emoji: "🥐",
      desc: "Caramelized puff layers, Chantilly, fresh berries, raspberry coulis.",
      price: 15, badge: null,
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1600&q=80&fit=crop",
    },
  ],
};

// ─── Individual Menu Card ─────────────────────────────────────────────────────
function MenuCard({ item, onAdd, index, onHover, onLeave }) {
  const cardRef = useRef(null);
  const [added, setAdded] = useState(false);

  // 3D tilt via springs
  const rotX = useSpring(0, { stiffness: 200, damping: 24 });
  const rotY = useSpring(0, { stiffness: 200, damping: 24 });
  const scaleS = useSpring(1, { stiffness: 250, damping: 22 });

  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    rotX.set(((e.clientY - rect.top) / rect.height - 0.5) * -12);
    rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    scaleS.set(1.025);
  };

  const onMouseEnter = () => {
    onHover(item);
    scaleS.set(1.025);
  };

  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    scaleS.set(1);
    onLeave();
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        scale: scaleS,
        transformPerspective: 900,
      }}
      // ← Slide in from LEFT to RIGHT per card, staggered
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative cursor-default"
    >
      {/* Glass card */}
      <div className="relative bg-black/30 hover:bg-black/20 backdrop-blur-md border border-white/8 hover:border-amber-400/25 rounded-2xl p-6 overflow-hidden transition-colors duration-300">
        {/* Inner shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.04) 0%, transparent 60%)" }} />

        {/* Top badge */}
        {item.badge && (
          <span className="absolute top-4 right-4 text-[8px] tracking-[0.22em] uppercase bg-amber-400/12 text-amber-400 border border-amber-400/22 px-2.5 py-1 rounded-full">
            {item.badge}
          </span>
        )}

        {/* Emoji */}
        <div className="text-4xl mb-4 select-none">{item.emoji}</div>

        {/* Name */}
        <h3
          className="text-white mb-2 leading-snug"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400 }}
        >
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-white/38 text-xs leading-relaxed mb-5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {item.desc}
        </p>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <span
            className="text-amber-400"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem" }}
          >
            ${item.price}
          </span>

          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.09 }}
            whileTap={{ scale: 0.88 }}
            className={`flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase px-4 py-2 rounded-full transition-all duration-300 ${
              added
                ? "bg-emerald-500/18 border border-emerald-500/30 text-emerald-400"
                : "bg-amber-400/10 hover:bg-amber-400 border border-amber-400/22 text-amber-400 hover:text-black"
            }`}
          >
            {added ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓ Added</motion.span>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </motion.button>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/22 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

// ─── Tab pill selector ────────────────────────────────────────────────────────
function Tabs({ active, onChange }) {
  return (
    <div className="flex justify-center mb-14">
      <div className="inline-flex p-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm">
        {Object.keys(MENU_DATA).map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className="relative px-7 py-2.5 rounded-full text-[10px] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {active === tab && (
              <motion.div
                layoutId="menu-pill"
                className="absolute inset-0 rounded-full bg-amber-400"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-200 ${
              active === tab ? "text-black font-semibold" : "text-white/40 hover:text-white/65"
            }`}>
              {tab}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-px w-10 bg-amber-400/50" />
        <span className="text-amber-400 text-[9px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Tonight's Selection
        </span>
        <div className="h-px w-10 bg-amber-400/50" />
      </div>
      <h2
        className="text-white leading-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(3rem, 6vw, 5.5rem)",
          fontWeight: 300,
        }}
      >
        The{" "}
        <em style={{
          background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontStyle: "italic",
        }}>
          Menu
        </em>
      </h2>
      <p className="text-white/28 text-xs tracking-[0.22em] uppercase mt-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Crafted daily from seasonal ingredients
      </p>
    </motion.div>
  );
}

// ─── Reservation strip ────────────────────────────────────────────────────────
function ReservationStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 relative rounded-2xl overflow-hidden border border-white/[0.06] p-10 text-center"
      style={{ background: "linear-gradient(135deg, rgba(200,136,10,0.07) 0%, rgba(10,8,4,0) 60%)" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <p className="text-white/30 text-[9px] tracking-[0.42em] uppercase mb-3"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Reserve your evening
      </p>
      <h3 className="text-white mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300 }}>
        Join us for an{" "}
        <em style={{ color: "#fbbf24", fontStyle: "italic" }}>unforgettable</em>{" "}
        experience
      </h3>
      <motion.a
        href="#reservations"
        whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(251,191,36,0.3)" }}
        whileTap={{ scale: 0.97 }}
        className="inline-block border border-amber-400/40 hover:border-amber-400 text-amber-400 text-[10px] tracking-[0.28em] uppercase px-9 py-4 rounded-full transition-all duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Make a Reservation
      </motion.a>
    </motion.div>
  );
}

// ─── Main Menu export ─────────────────────────────────────────────────────────
export default function Menu({ onAddToCart, cardsRef }) {
  const [activeTab, setActiveTab] = useState("Starters");
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleHover = useCallback((item) => setHoveredItem(item), []);
  const handleLeave = useCallback(() => setHoveredItem(null), []);

  const handleTabChange = (tab) => {
    setHoveredItem(null);
    setActiveTab(tab);
  };

  return (
    <section id="menu" className="relative min-h-screen py-36 bg-[#060401] overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          BACKGROUND IMAGE — switches instantly when card is hovered
      ══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#060401]" />

        {/* Food image crossfade — one per item, only active one is visible */}
        {Object.values(MENU_DATA).flat().map((item) => (
          <motion.div
            key={item.id}
            animate={{ opacity: hoveredItem?.id === item.id ? 1 : 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Dark overlay so cards stay readable */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: hoveredItem
              ? "linear-gradient(to right, rgba(6,4,1,0.92) 0%, rgba(6,4,1,0.75) 40%, rgba(6,4,1,0.55) 100%)"
              : "rgba(6,4,1,0.0)",
          }}
        />

        {/* Vignette always */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(6,4,1,0.7) 100%)",
          }}
        />
      </div>

      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#050401] to-transparent pointer-events-none z-10" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionIntro />
        <Tabs active={activeTab} onChange={handleTabChange} />

        {/* Anchor scrolled to on mount — lands right at the cards */}
        <div ref={cardsRef} style={{ scrollMarginTop: "80px" }} />

        {/* Cards grid — animate key change for tab switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {MENU_DATA[activeTab].map((item, i) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={onAddToCart}
                index={i}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Hovered dish name watermark */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              key={hoveredItem.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-10 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-right"
            >
              <p className="text-white/12 text-[9px] tracking-[0.4em] uppercase mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Currently viewing
              </p>
              <p
                className="text-white/25"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                }}
              >
                {hoveredItem.name}
              </p>
              <p className="text-amber-400/40 text-sm mt-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ${hoveredItem.price}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <ReservationStrip />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#060401] to-transparent pointer-events-none z-10" />
    </section>
  );
}