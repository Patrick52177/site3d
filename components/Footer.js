"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const links = {
    Explore: ["Menu", "Story", "Reservations", "Private Events"],
    Connect: ["Instagram", "Facebook", "Twitter", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Allergen Info"],
  };

  return (
    <footer ref={ref} className="relative bg-[#06050302] border-t border-white/5 pt-20 pb-10">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#080604] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-black font-black text-xs">V</span>
              </div>
              <span
                className="text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", letterSpacing: "0.2em" }}
              >
                VELOUR
              </span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed max-w-[200px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              A temple of refined cuisine, where every detail is crafted with intention.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([category, items], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * (ci + 1) }}
            >
              <h4 className="text-white/60 text-[9px] tracking-[0.3em] uppercase mb-5">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/35 hover:text-white/70 text-xs transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-white/20 text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} Velour Restaurant. All rights reserved.
          </p>
          <p className="text-white/15 text-[10px] tracking-widest uppercase">
            Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  );
}