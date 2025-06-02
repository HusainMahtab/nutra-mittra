"use client";

import { useEffect } from 'react';

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = { display: 'block' },
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
    <div className={`w-full max-w-full overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '100%',
          maxWidth: '100%',
          ...style 
        }}
        data-ad-client="ca-pub-6374749885061449"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdSenseBanner;