import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer({ start }) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (start) {
      // Show all footer content together after a short delay
      const timer = setTimeout(() => setShowFooter(true), 400);
      return () => clearTimeout(timer);
    }
  }, [start]);

  return (
    <footer className="text-[9px] mx-[20px] mb-[21.5px] uppercase tracking-[1.6px] text-black leading-none font-medium">
      {showFooter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-[15px]"
        >
            <p>
              <a
                href="https://zimo.ws/legal/tpce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black no-underline cursor-pointer"
              >
                TERMS | PRIVACY
              </a>
            </p>

          {/* Bottom row: Copyright */}
          <div>© COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.</div>
        </motion.div>
      )}
    </footer>
  );
}

