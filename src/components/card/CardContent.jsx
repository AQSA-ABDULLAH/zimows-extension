import React from 'react';

export default function CardContent() {
  return (
    <div className="flex item-center gap-[20px] ml-[10px] mb-[48px]">
      <div className="">
        <img src="/images/card/WS Chrome Line.svg" alt="line" className='w-[1px] h-[195px]' />
      </div>

      <div className="flex flex-col font-[12px] tracking-[1px] ml-[10px] leading-none">
        <div className="flex items-center gap-[43px]">
          <img src="images/card/logo/bbc-log.png" alt="BBC" className="h-[30px]" />
          <a 
            href="https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#000] decoration-none text-[12px] leading-none"
          >
            zimo.ws/OFBxVT
          </a>
        </div>

        <h3 className="tracking-[1.8px] leading-[18px] mt-[19.8px] text-[12px]">
          Deadly fighting erupts between Hamas and Palestinian clan in Gaza
        </h3>

        <a 
          href="https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo" 
          className="tracking-[1.5px] text-[#000000] break-all no-underline" 
        >
          https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo
        </a>

        <div className="flex gap-[30px] mt-[18px] text-[12px] leading-[10px]">
          <span>17:23</span>
          <span>06 October 2025</span>
        </div>

        <div className="flex mt-[20px] gap-[50px]">
          <img src="/images/card/Open in New Window.svg" alt="open window" className='h-[22px] cursor-pointer' />
          <img src="/images/card/Copy Icon B.svg" alt="copy" className='h-[22px] cursor-pointer' />
          <img src="/images/card/Share Icon B.svg" alt="share" className='h-[22px] cursor-pointer' />
        </div>
      </div>
    </div>
  );
}

