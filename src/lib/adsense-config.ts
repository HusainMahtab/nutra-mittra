// AdSense Configuration
export const ADSENSE_CONFIG = {
  publisherId: "ca-pub-6374749885061449",
  
  // Ad Slots - Replace these with your actual ad slot IDs from Google AdSense
  adSlots: {
    // Homepage ads
    homepageTop: "1234567890",
    homepageMiddle: "0987654321",
    
    // Fruit detail page ads
    fruitDetailSidebar: "1122334455",
    fruitDetailBanner: "5544332211",
    
    // General page ads
    headerBanner: "1111111111",
    footerBanner: "2222222222",
    sidebarSquare: "3333333333",
    
    // Mobile specific
    mobileTop: "4444444444",
    mobileBottom: "5555555555",
    
    // Article/Blog ads
    articleTop: "6666666666",
    articleMiddle: "7777777777",
    articleBottom: "8888888888",
    
    // Search results
    searchResults: "9999999999",
  },
  
  // Ad formats
  formats: {
    responsive: "auto",
    rectangle: "rectangle",
    banner: "banner",
    leaderboard: "leaderboard",
    skyscraper: "skyscraper",
  },
  
  // Common styles
  styles: {
    banner: { display: 'block', minHeight: '250px' },
    sidebar: { display: 'block', width: '300px', height: '600px' },
    square: { display: 'block', width: '300px', height: '250px' },
    responsive: { display: 'block' },
  }
};

// Helper function to get ad slot by name
export const getAdSlot = (slotName: keyof typeof ADSENSE_CONFIG.adSlots): string => {
  return ADSENSE_CONFIG.adSlots[slotName];
};

// Helper function to get ad style by type
export const getAdStyle = (styleType: keyof typeof ADSENSE_CONFIG.styles): React.CSSProperties => {
  return ADSENSE_CONFIG.styles[styleType];
};