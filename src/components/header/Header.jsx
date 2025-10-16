import React from 'react'

function Header() {
  return (
    <div>
       <div className="w-full flex justify-between items-center m-[40px]">
      <div>
        <img src="images/header/ZIMO WS Duo Chrome B.svg" alt="Zimo Logo" className='h-[20px]' />
      </div>
      <div class="flex gap-[40px]">
        <img src="images/header/History.svg" alt="History" id="history-btn" className='h-[20px] cursor-pointer' />
        <img src="images/header/Chrome Extension Icon.svg" alt="Chrome Extension Icon" className='h-[20px]' />
      </div>
    </div>

    </div>
  )
}

export default Header
