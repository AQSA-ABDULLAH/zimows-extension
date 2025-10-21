import { useState, useCallback } from 'react';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text) => {
    if (!text) return false;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      return true;
    } catch (err) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return true;
      } catch (fallbackErr) {
        console.error('Copy failed:', fallbackErr);
        return false;
      }
    }
  }, []);

  return { copyToClipboard, copied };
};
