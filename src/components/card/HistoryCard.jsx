// import React, { useState } from "react";
// import { motion } from "framer-motion";

// function HistoryCard({ icon, shortUrl, title, fullUrl, time, date, onDelete, id, clickCounter }) {
//   const [confirmDelete, setConfirmDelete] = useState(false);

//   const handleDeleteClick = () => {
//     if (confirmDelete) {
//       onDelete(id);
//     } else {
//       setConfirmDelete(true);
//       // 5 sec baad confirmation auto cancel
//       setTimeout(() => setConfirmDelete(false), 5000);
//     }
//   };

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//       transition={{
//         opacity: { duration: 0.25 },
//         y: { type: "spring", stiffness: 300, damping: 30 },
//         scale: { duration: 0.25 },
//         layout: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 },
//       }}
//       className="flex items-center gap-[20px] ml-[10px] mb-[48px]"
//     >
//       <div>
//         <img
//           src="/images/card/WS Chrome Line.svg"
//           alt="line"
//           className="w-[1px] h-[195px]"
//         />
//       </div>

//       <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline text-[#000] tracking-[1.2px] ml-[10px] leading-none">
//         {/* Top Section */}
//         <div className="flex items-center gap-[43px] h-[30px] mt-[5px]">
//           <img src={icon} alt="Logo" className="h-[30px] w-[30px]" />
//           <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-[14px]">
//             {shortUrl}
//           </a>
//         </div>

//         {/* Title */}
//         <h3 className="tracking-[1.5px] leading-[18px]">{title}</h3>

//         {/* Full Link */}
//         <p
//           className="break-all"
//         >
//           {fullUrl}
//         </p>

//         {/* Date & Time */}
//         <div className="flex gap-[30px]">
//           <span>{time}</span>
//           <span>{date}</span>
//         </div>

//         {/* Action Icons */}
//         <div className="flex gap-[50px]">
//           <img
//             src="/images/card/Open in New Window.svg"
//             alt="open window"
//             className="h-[22px] cursor-pointer"
//           />
//           <img
//             src="/images/card/Copy Icon B.svg"
//             alt="copy"
//             className="h-[22px] cursor-pointer"
//           />
//           <img
//             src="/images/card/Share Icon B.svg"
//             alt="share"
//             className="h-[22px] cursor-pointer"
//           />
//           <img
//             src={
//               confirmDelete
//                 ? "/images/card/Delete Icon Red.svg"
//                 : "/images/card/Delete Icon B.svg"
//             }
//             alt="delete"
//             className={`h-[22px] cursor-pointer transition-all duration-300 ease-in-out transform ${
//               confirmDelete ? "scale-110" : "scale-100"
//             }`}
//             onClick={handleDeleteClick}
//           />
//           <div className="flex gap-[5px]">
//              <img
//             src="/images/card/Counter - URL Clicks.svg"
//             alt="counter click"
//             className="h-[22px] cursor-pointer"
//           />
//             <p>{clickCounter}</p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default HistoryCard;



import React from "react"; // useState remove kar diya
import { motion } from "framer-motion";

// Props update ho gaye hain, ab state aur handlers parent se ayen ge
function HistoryCard({
  icon, shortUrl, title, fullUrl, time, date, clickCounter,
  onDeleteClick, onCopyClick, onShareClick, onShowResultClick,
  isConfirmingDelete, isCopied, isDeleting
}) {

  // Local state aur handler remove kar diye gaye hain
  // const [confirmDelete, setConfirmDelete] = useState(false);
  // const handleDeleteClick = () => { ... };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        opacity: { duration: 0.25 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        scale: { duration: 0.25 },
        layout: { type: "spring", stiffness: 200, damping: 25, duration: 0.6 },
      }}
      className="flex items-center gap-[20px] ml-[10px] mb-[48px]"
    >
      <div>
        <img
          src="/images/card/WS Chrome Line.svg"
          alt="line"
          className="w-[1px] h-[195px]"
        />
      </div>

      <div className="flex flex-col justify-between h-[192px] text-[12px] no-underline text-[#000] tracking-[1.2px] ml-[10px] leading-none">
        {/* Top Section */}
        <div className="flex items-center gap-[43px] h-[30px] mt-[5px]">
          <img
            src={icon}
            alt="Logo"
            className="h-[30px] w-[30px]"
            // Favicon fallback logic (from Sidebar.js)
            onError={(e) => {
              try {
                // 'fullUrl' prop ka istemal karein
                const domain = new URL(fullUrl).hostname;
                e.target.src = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
              } catch {
                // Make sure this default favicon path is correct in your project
                e.target.src = "/assets/default-favicon.png";
              }
            }}
          />
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-[14px]">
            {shortUrl}
          </a>
        </div>

        {/* Title */}
        <h3 className="tracking-[1.5px] leading-[18px] line-clamp-2">{title}</h3>

        {/* Full Link */}
        <p className="break-all line-clamp-2">{fullUrl}</p>

        {/* Date & Time */}
        <div className="flex gap-[30px]">
          <span>{time}</span>
          <span>{date}</span>
        </div>

        {/* Action Icons (ab props se chal rahe hain) */}
        <div className="flex gap-[50px]">
          <img
            src="/images/card/Open in New Window.svg"
            alt="open window"
            className="h-[22px] cursor-pointer"
            onClick={onShowResultClick} // Prop se handler
            title="Show in main view"
          />
          <img
            src="/images/card/Copy Icon B.svg"
            alt="copy"
            className={`h-[22px] cursor-pointer transition-all duration-200 ${
              isCopied ? 'opacity-60 scale-95' : 'hover:scale-105' // State from prop
            }`}
            onClick={onCopyClick} // Prop se handler
            title={isCopied ? "Copied!" : "Copy URL"} // State from prop
          />
          <img
            src="/images/card/Share Icon B.svg"
            alt="share"
            className="h-[22px] cursor-pointer"
            onClick={onShareClick} // Prop se handler
            title="Share URL"
          />
          <img
            src={
              isConfirmingDelete // State from prop
                ? "/images/card/Delete Icon Red.svg"
                : "/images/card/Delete Icon B.svg"
            }
            alt="delete"
            className={`h-[22px] cursor-pointer transition-all duration-300 ease-in-out transform ${
              isConfirmingDelete ? "scale-110" : "scale-100" // State from prop
            } ${isDeleting ? "opacity-50 pointer-events-none" : "opacity-100"}`} // State from prop
            onClick={onDeleteClick} // Prop se handler
            title={
              isConfirmingDelete // State from prop
                ? "Click again to confirm delete"
                : "Delete"
            }
          />
          <div className="flex gap-[5px] items-center">
            <img
              src="/images/card/Counter - URL Clicks.svg"
              alt="counter click"
              className="h-[22px]" // cursor-pointer hata diya agar clickable nahi hai
            />
            <p>{clickCounter}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default HistoryCard;