"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart({ isOpen, onClose, items, onUpdateQty, onRemove }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + 5.5; // delivery

  const backdropVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 30 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-[#0e0b07] border-l border-white/8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/6">
              <div>
                <h2
                  className="text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 300 }}
                >
                  Your Order
                </h2>
                <p className="text-white/30 text-xs tracking-widest uppercase mt-0.5">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full border border-white/10 hover:border-white/25 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 gap-4"
                  >
                    <div className="text-5xl opacity-30">🍽️</div>
                    <p className="text-white/25 text-sm tracking-widest uppercase">Your cart is empty</p>
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.03 }}
                      className="text-amber-400/60 hover:text-amber-400 text-xs tracking-widest uppercase border border-amber-400/20 hover:border-amber-400/40 px-5 py-2.5 rounded-full transition-all"
                    >
                      Browse Menu
                    </motion.button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="group flex items-center gap-4 bg-white/4 hover:bg-white/6 border border-white/6 rounded-xl p-4 transition-all duration-200"
                    >
                      {/* Emoji */}
                      <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-xl flex-shrink-0">
                        {item.emoji}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-white/90 truncate"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                        >
                          {item.name}
                        </p>
                        <p className="text-amber-400/80 text-xs mt-0.5">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => {
                            if (item.qty === 1) onRemove(item.id);
                            else onUpdateQty(item.id, -1);
                          }}
                          className="w-7 h-7 rounded-full border border-white/10 hover:border-amber-400/40 hover:text-amber-400 flex items-center justify-center text-white/40 transition-colors text-sm"
                        >
                          {item.qty === 1 ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          ) : (
                            "−"
                          )}
                        </motion.button>

                        <motion.span
                          key={item.qty}
                          initial={{ scale: 1.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-white w-4 text-center text-sm font-light"
                        >
                          {item.qty}
                        </motion.span>

                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-7 h-7 rounded-full border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-400 flex items-center justify-center text-white/40 transition-colors text-sm"
                        >
                          +
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="px-6 pb-6 pt-4 border-t border-white/6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-white/35 text-xs">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/35 text-xs">
                    <span>Delivery</span>
                    <span>$5.50</span>
                  </div>
                  <div className="flex justify-between text-white text-sm pt-3 border-t border-white/6">
                    <span
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                    >
                      Total
                    </span>
                    <span
                      className="text-amber-400"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(251,191,36,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-[0.2em] uppercase py-4 rounded-full transition-colors duration-300"
                >
                  Checkout — ${total.toFixed(2)}
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors text-center"
                >
                  Continue browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}