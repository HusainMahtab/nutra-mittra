"use client";

import { useEffect } from 'react';

interface AdSenseResponsiveProps {
  adSlot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseResponsive: React.FC<AdSenseResponsiveProps> = ({
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
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6374749885061449"
        data-ad-slot={adSlot}
        data-ad-format="autorelaxed"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
      />
    </div>
  );
};

export default AdSenseResponsive;