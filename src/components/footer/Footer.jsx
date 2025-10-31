import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer({ start }) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (start) {
      const timer = setTimeout(() => setShowFooter(true), 400);
      return () => clearTimeout(timer);
    }
  }, [start]);

  // Parent & child animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, // delay between children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <footer className="text-[9px] mx-[20px] mb-[21.5px] uppercase tracking-[1.6px] text-black leading-none font-medium">
      {showFooter && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-[15px]"
        >
          {/* First: Terms | Privacy */}
          <motion.p variants={itemVariants}>
            <a
              href="https://zimo.ws/legal/tpce"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black no-underline cursor-pointer"
            >
              TERMS | PRIVACY
            </a>
          </motion.p>

          {/* Second: Copyright */}
          <motion.div variants={itemVariants}>
            © COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
}
