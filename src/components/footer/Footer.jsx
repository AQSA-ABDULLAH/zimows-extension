import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="text-[9px] mx-[20px] mb-[21.5px] uppercase tracking-[1.6px] gap-[16px]">
        <div>
          © COPYRIGHT 2025 WS | ZIMO GROUP LIMITED. ALL RIGHTS RESERVED.
        </div>
        <div class="flex justify-between items-center text-black decoration-none text-[12px] font-medium">
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
          <div class="flex gap-[10px]">
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
      </footer>
    </div>
  );
}
