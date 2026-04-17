"use client";
import { useRef, useState } from "react";
import { motion, useInView, useSpring } from "framer-motion";

// ─── Menu data ────────────────────────────────────────────────────────────────
const MENU_DATA = {
  Starters: [
    {
      id: 1, name: "Truffle Arancini", emoji: "🍄",
      desc: "Crispy risotto balls, black truffle shavings, 24-month parmesan foam, microgreens.",
      price: 18, badge: "Chef's Pick",
    },
    {
      id: 2, name: "Bluefin Tartare", emoji: "🐟",
      desc: "Sashimi-grade tuna, yuzu gel, avocado mousse, nori crisp, toasted sesame.",
      price: 24, badge: null,
    },
    {
      id: 3, name: "Burrata Royale", emoji: "🫙",
      desc: "Stracciatella burrata, heirloom tomatoes, aged balsamic reduction, basil oil.",
      price: 19, badge: "Seasonal",
    },
  ],
  Mains: [
    {
      id: 4, name: "A5 Wagyu Striploin", emoji: "🥩",
      desc: "Japanese A5 wagyu, smoked bone marrow jus, black garlic, pomme purée.",
      price: 72, badge: "Signature",
    },
    {
      id: 5, name: "Butter-Poached Lobster", emoji: "🦞",
      desc: "Cold-water lobster tail, saffron bisque, fennel confit, oscietra caviar.",
      price: 78, badge: null,
    },
    {
      id: 6, name: "Wild Mushroom Risotto", emoji: "🍚",
      desc: "Aged carnaroli, porcini & chanterelle, white truffle oil, 36-month parmigiano.",
      price: 42, badge: "Vegetarian",
    },
  ],
  Desserts: [
    {
      id: 7, name: "Valrhona Soufflé", emoji: "🍫",
      desc: "Warm 72% dark chocolate soufflé, Tahitian vanilla bean ice cream.",
      price: 16, badge: null,
    },
    {
      id: 8, name: "Burnt Citrus Tart", emoji: "🍋",
      desc: "Lemon-yuzu curd, Italian meringue torch-kissed, gold leaf, shortbread.",
      price: 14, badge: "New",
    },
    {
      id: 9, name: "Mille-Feuille", emoji: "🥐",
      desc: "Caramelized puff layers, Chantilly, fresh berries, raspberry coulis.",
      price: 15, badge: null,
    },
  ],
};

// ─── 3D tilt card ─────────────────────────────────────────────────────────────
function MenuCard({ item, onAdd, index }) {
  const cardRef = useRef(null);
  const [added, setAdded] = useState(false);

  const rotX = useSpring(0, { stiffness: 220, damping: 26 });
  const rotY = useSpring(0, { stiffness: 220, damping: 26 });
  const scale = useSpring(1, { stiffness: 260, damping: 22 });

  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    rotX.set(((e.clientY - rect.top) / rect.height - 0.5) * -14);
    rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 14);
    scale.set(1.02);
  };
  const onMouseLeave = () => { rotX.set(0); rotY.set(0); scale.set(1); };

  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, scale, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white/[0.035] hover:bg-white/[0.06] backdrop-blur-sm border border-white/[0.07] hover:border-amber-400/20 rounded-2xl p-6 transition-colors duration-300"
    >
      {item.badge && (
        <span className="absolute top-4 right-4 text-[8px] tracking-[0.22em] uppercase bg-amber-400/12 text-amber-400 border border-amber-400/22 px-2.5 py-1 rounded-full">
          {item.badge}
        </span>
      )}

      <div className="text-[2.6rem] mb-4 select-none">{item.emoji}</div>

      <h3
        className="text-white mb-2 leading-tight"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400 }}
      >
        {item.name}
      </h3>

      <p
        className="text-white/38 text-xs leading-relaxed mb-5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {item.desc}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-amber-400"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem" }}
        >
          ${item.price}
        </span>

        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
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

      {/* Bottom glow line on hover */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

// ─── Tab selector ─────────────────────────────────────────────────────────────
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
                layoutId="menu-tab"
                className="absolute inset-0 rounded-full bg-amber-400"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-200 ${active === tab ? "text-black font-semibold" : "text-white/40 hover:text-white/65"}`}>
              {tab}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-px w-10 bg-amber-400/50" />
        <span className="text-amber-400 text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
        <em
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontStyle: "italic",
          }}
        >
          Menu
        </em>
      </h2>
      <p
        className="text-white/30 text-xs tracking-[0.2em] uppercase mt-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Crafted daily from seasonal ingredients
      </p>
    </motion.div>
  );
}

// ─── Main Menu component ──────────────────────────────────────────────────────
export default function Menu({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState("Starters");

  return (
    <section
      id="menu"
      className="relative py-36 bg-[#060401]"
    >
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#050401] to-transparent pointer-events-none" />

      {/* Subtle ambient glow in background */}
      <div
        className="absolute inset-x-0 top-1/3 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(200,136,10,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionIntro />
        <Tabs active={activeTab} onChange={setActiveTab} />

        {/* Cards */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {MENU_DATA[activeTab].map((item, i) => (
            <MenuCard key={item.id} item={item} onAdd={onAddToCart} index={i} />
          ))}
        </motion.div>

        {/* Reservation strip */}
        <ReservationStrip />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#060401] to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Reservation call-to-action strip ────────────────────────────────────────
function ReservationStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 relative rounded-2xl overflow-hidden border border-white/[0.06] p-10 text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(200,136,10,0.07) 0%, rgba(10,8,4,0) 60%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 65%)",
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      </div>

      <p
        className="text-white/35 text-[9px] tracking-[0.4em] uppercase mb-3"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Reserve your evening
      </p>
      <h3
        className="text-white mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300 }}
      >
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