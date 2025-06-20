"use client";

import { useEffect } from 'react';

interface AdSenseSidebarProps {
  adSlot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseSidebar: React.FC<AdSenseSidebarProps> = ({
  adSlot,
  className = ""
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`sticky top-4 w-full max-w-[300px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          width: '100%', 
          maxWidth: '300px',
          minHeight: '250px'
        }}
        data-ad-client="ca-pub-6374749885061449"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseSidebar;