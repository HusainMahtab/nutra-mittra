# Google AdSense Setup Guide for Nutra Mitra

## Current Implementation Status ✅

Your Google AdSense has been successfully implemented with the following features:

### 1. AdSense Script Integration
- ✅ AdSense script added to `layout.tsx`
- ✅ Publisher ID: `ca-pub-6374749885061449`
- ✅ Meta tag added for account verification

### 2. Responsive Ad Components Created
- ✅ `AdSenseBanner` - For banner ads
- ✅ `AdSenseSidebar` - For sidebar ads (desktop only)
- ✅ `AdSenseMobile` - For mobile-specific ads
- ✅ `AdSenseResponsive` - For responsive ads

### 3. Ad Placements Added
- ✅ Homepage: 2 banner ads (top and middle)
- ✅ Fruit detail pages: Sidebar ad + banner ad
- ✅ Mobile-specific ads for better mobile experience
- ✅ Responsive CSS fixes to prevent layout breaking

## Next Steps - Setting Up Real Ad Units

### Step 1: Create Ad Units in Google AdSense Dashboard

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Navigate to **Ads** → **By ad unit**
3. Click **Create new ad unit**

### Step 2: Create These Ad Units

Create the following ad units and replace the placeholder slot IDs:

#### Homepage Ads
- **Homepage Top Banner**
  - Type: Display ad
  - Size: Responsive
  - Current placeholder: `"1234567890"`
  
- **Homepage Middle Banner**
  - Type: Display ad
  - Size: Responsive
  - Current placeholder: `"0987654321"`

#### Fruit Detail Page Ads
- **Fruit Detail Sidebar**
  - Type: Display ad
  - Size: Medium Rectangle (300x250) or Responsive
  - Current placeholder: `"1122334455"`
  
- **Fruit Detail Banner**
  - Type: Display ad
  - Size: Responsive
  - Current placeholder: `"5544332211"`

#### Mobile Ads
- **Mobile Banner**
  - Type: Display ad
  - Size: Mobile banner (320x50) or Responsive
  - Current placeholder: `"4444444444"`

### Step 3: Update Ad Slot IDs

After creating ad units, update the slot IDs in these files:

1. **Homepage** (`src/app/page.tsx`):
   ```tsx
   // Line 369: Replace "1234567890" with your actual slot ID
   adSlot="YOUR_HOMEPAGE_TOP_SLOT_ID"
   
   // Line 592: Replace "0987654321" with your actual slot ID
   adSlot="YOUR_HOMEPAGE_MIDDLE_SLOT_ID"
   ```

2. **Fruit Detail Page** (`src/app/fruits/[id]/page.tsx`):
   ```tsx
   // Line 244: Replace "1122334455" with your actual slot ID
   adSlot="YOUR_SIDEBAR_SLOT_ID"
   
   // Line 252: Replace "5544332211" with your actual slot ID
   adSlot="YOUR_FRUIT_BANNER_SLOT_ID"
   
   // Line 151: Replace "4444444444" with your actual slot ID
   adSlot="YOUR_MOBILE_SLOT_ID"
   ```

3. **Configuration File** (`src/lib/adsense-config.ts`):
   Update all placeholder slot IDs with your real ones.

### Step 4: Test Your Implementation

1. Deploy your changes to Vercel
2. Visit your live site: https://nutra-mittra.vercel.app/
3. Check that ads are loading properly
4. Test on both desktop and mobile devices

### Step 5: AdSense Approval Process

1. **Submit for Review**: In your AdSense dashboard, submit your site for review
2. **Wait for Approval**: This can take 1-14 days
3. **Fix Issues**: If rejected, address the feedback and resubmit

## Responsive Design Fixes Applied ✅

To fix the responsiveness issues you mentioned, I've implemented:

### 1. CSS Fixes in `globals.css`
```css
/* AdSense responsive fixes */
.adsbygoogle {
  max-width: 100% !important;
  overflow: hidden !important;
}

/* Mobile-specific fixes */
@media (max-width: 768px) {
  .adsbygoogle {
    width: 100% !important;
    max-width: 100% !important;
    min-height: 150px !important;
  }
}
```

### 2. Component Updates
- All ad components now use `width: 100%` and `max-width: 100%`
- Added proper responsive classes
- Reduced padding on mobile devices
- Fixed grid layouts to be mobile-friendly

### 3. Layout Improvements
- Changed fruit detail page from 3-column to 4-column layout
- Added mobile-specific ad components
- Improved spacing and margins for mobile

## Best Practices Implemented ✅

1. **Performance**: Ads load asynchronously
2. **SEO**: Proper meta tags and structured data
3. **User Experience**: Ads don't interfere with content
4. **Mobile-First**: Responsive design prioritizes mobile users
5. **Error Handling**: Graceful fallbacks if ads fail to load

## Monitoring and Optimization

After approval, monitor your AdSense performance:

1. **AdSense Dashboard**: Track earnings and performance
2. **Google Analytics**: Monitor user behavior impact
3. **Page Speed**: Ensure ads don't slow down your site
4. **A/B Testing**: Test different ad placements

## Support

If you need help with:
- Creating ad units
- Updating slot IDs
- Troubleshooting issues

Feel free to ask for assistance!