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
    <footer className="text-[9px] mx-[20px] mb-[21.5px] uppercase tracking-[1.6px] leading-none">
      {showFooter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-[15px]"
        >
          {/* Top row: Links + Icons */}
          <div className="flex justify-between items-center text-black leading-none text-[12px] font-medium">
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
            <div className="flex gap-[10px]">
              <img
                src="/images/footer/ZIMO WS.svg"
                alt="Zimo Logo"
                className="h-[10px]"
              />
              <img
                src="/images/footer/Extension Chrome WS B.svg"
                alt="Chrome Extension Icon"
                className="h-[10px]"
              />
            </div>
          </div>

          {/* Bottom row: Copyright */}
          <div>© COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.</div>
        </motion.div>
      )}
    </footer>
  );
}

