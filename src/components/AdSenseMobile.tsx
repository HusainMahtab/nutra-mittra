"use client";

import { useEffect } from 'react';

interface AdSenseMobileProps {
  adSlot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseMobile: React.FC<AdSenseMobileProps> = ({
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
    <div className={`block lg:hidden w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          maxWidth: '100%',
          minHeight: '150px'
        }}
        data-ad-client="ca-pub-6374749885061449"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseMobile;