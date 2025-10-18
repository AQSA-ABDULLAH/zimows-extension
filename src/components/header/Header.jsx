import React, { useState } from "react";
import { motion } from "framer-motion";

function Header({ setActivePage }) {
  const [showLogo, setShowLogo] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showExtension, setShowExtension] = useState(false);

  return (
    <div className="w-full flex justify-between items-center p-[40px]">
      {/* ✅ Logo */}
      <div>
        {showLogo && (
          <motion.img
            src="images/header/ZIMO WS Duo Chrome B.svg"
            alt="Zimo Logo"
            className="h-[20px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
             onAnimationComplete={() => setShowExtension(true)}
          />
        )}
      </div>

      {/* ✅ Icons */}
      <div className="flex gap-[40px]">
        {showHistory && (
          <motion.img
            src="images/header/History.svg"
            alt="History"
            id="history-btn"
            className="h-[20px] cursor-pointer"
            onClick={() => setActivePage("history")}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {showExtension && (
          <motion.img
            src="images/header/Chrome Extension Icon.svg"
            alt="Chrome Extension Icon"
            className="h-[20px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
             onAnimationComplete={() => setShowHistory(true)}
          />
        )}
      </div>
    </div>
  );
}

export default Header;


