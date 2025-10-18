import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Footer({ start }) {
  const [showCopyright, setShowCopyright] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    if (start) {
      setTimeout(() => setShowCopyright(true), 200);
      setTimeout(() => setShowLinks(true), 800); // copyright ke baad
    }
  }, [start]);

  return (
    <footer className="text-[9px] mx-[20px] mb-[21.5px] uppercase tracking-[1.6px] leading-none">
      {showCopyright && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          © COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.
        </motion.div>
      )}

      {showLinks && (
        <motion.div
          className="flex justify-between items-center mt-[10px] text-black leading-none text-[12px] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
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
        </motion.div>
      )}
    </footer>
  );
}
