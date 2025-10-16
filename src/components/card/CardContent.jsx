import React from 'react';

export default function CardContent() {
  return (
    <div className="card">
      <div className="line">
        <img src="/images/card/WS Chrome Line.svg" alt="line" />
      </div>

      <div className="link-card">
        <div className="card-header">
          <img src="icons/Group 34927.svg" alt="BBC" className="logo" />
          <a 
            href="https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="short-url"
          >
            zimo.ws/OFBxVT
          </a>
        </div>

        <h3 className="headline typewriter" id="headline">
          Deadly fighting erupts between Hamas and Palestinian clan in Gaza
        </h3>

        <a 
          href="https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo" 
          className="original-link typewriter" 
          id="originalLink"
        >
          https://www.bbc.co.uk/news/articles/c8jm2xlk1gdo
        </a>

        <div className="meta">
          <span>17:23</span>
          <span>06 October 2025</span>
        </div>

        <div className="action-icons">
          <img src="/images/card/Open in New Window.svg" alt="open window" />
          <img src="/images/card/Copy Icon B.svg" alt="copy" />
          <img src="/images/card/Share Icon B.svg" alt="share" />
          <img src="/images/Delete Icon W.svg" alt="delete" />
        </div>
      </div>
    </div>
  );
}

