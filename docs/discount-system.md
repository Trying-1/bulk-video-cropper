# Discount Management System Documentation

## Overview

The Bulk Video Cropper application includes a comprehensive discount management system that allows administrators to run promotional campaigns to attract new users. This system is completely configurable through an admin interface, eliminating the need for code changes when running promotions.

## Key Features

- **Admin Dashboard**: User-friendly interface for managing all discount settings
- **Real-time Updates**: Changes are reflected instantly on the landing page
- **Cloud Storage**: All settings are stored in Firebase Firestore
- **Dynamic Discount Display**: Shows original and discounted prices with visual strikethrough
- **Promotional Badges**: Highlights active offers with "Limited Offer" and "Flash Sale" badges
- **Countdown Timers**: Shows days remaining for each promotion
- **Promo Codes**: Automatically generated and passed through the authentication flow
- **Seasonal Banner**: Eye-catching promotional banner appears when discounts are active
- **Targeted CTAs**: Special call-to-action buttons for discount campaigns

## Using the Admin Interface

Access the discount management interface at `/admin/discounts` in your application. This interface provides:

1. **Premium Plan Settings**:
   - Toggle discount on/off (SUMMER20 promo code)
   - Set discount percentage (20% off default)
   - Configure original and discounted prices
   - Set end date for the promotion
   - Maximum video count: 40
   - Maximum video duration: 5 minutes
   - Maximum file size: 500MB

2. **Pro Plan Settings**:
   - Same features as Premium plan (PRO15 promo code)
   - Separate discount configuration (15% off default)
   - Different promo codes and end dates
   - Maximum video count: 120 
   - Maximum video duration: 30 minutes
   - Maximum file size: 2GB

3. **Real-time Preview**:
   - Changes are reflected immediately on the landing page
   - No need to redeploy the application
   - Automatic expiration based on end dates

## Discount Configuration (Admin Interface)

### Firestore Implementation

The discount system is implemented using Firestore collections to allow for real-time updates without code deployments:

```
Firestore Collections:
  - subscriptionPlans/
      - premium/
      - pro/
      - free/
  - promotionCodes/
      - summer20/
      - pro15/
```

### Premium Plan Settings

```jsx
// Premium Plan in Firestore (subscriptionPlans/premium)
{
  name: 'Premium',
  description: 'Professional video cropping for businesses',
  features: [
    'Everything in Pro',
    'Unlimited video length',
    '4K quality export',
    'Advanced filters and effects',
    'Cloud storage integration',
    'Team accounts',
    'API access'
  ],
  priceMonthly: 29.99,
  priceYearly: 299.99,
  currency: 'USD',
  isActive: true,
  trialDays: 14,
  maxVideoStorage: 100,
  maxProcessingHours: 50,
  priority: 3,
  hasPromotion: true,
  promotionCode: 'SUMMER20',
  discountPercentage: 20,
  promotionExpiry: [Timestamp('2025-08-31')],
  displayOriginalPrice: true,
}
```

### Pro Plan Settings

```jsx
// Pro Plan in Firestore (subscriptionPlans/pro)
{
  name: 'Pro',
  description: 'Enhanced features for content creators',
  features: [
    'Unlimited video crops',
    '30 mins max video length',
    'HD quality export',
    'All aspect ratios',
    'Batch processing',
    'Priority processing'
  ],
  priceMonthly: 9.99,
  priceYearly: 99.99,
  currency: 'USD',
  isActive: true,
  trialDays: 7,
  maxVideoStorage: 20,
  maxProcessingHours: 10,
  priority: 2,
  hasPromotion: false,
  promotionCode: 'PRO15',
  discountPercentage: 15,
  displayOriginalPrice: true,
}
```

### Promotion Codes in Firestore

```jsx
// SUMMER20 Promotion in Firestore (promotionCodes/summer20)
{
  code: 'SUMMER20',
  description: 'Summer promotion - 20% off Premium plan',
  discountPercentage: 20,
  currency: 'USD',
  isActive: true,
  applicablePlans: ['premium'],
  startDate: [Timestamp('2025-05-01')],
  endDate: [Timestamp('2025-08-31')],
  maxUses: 1000,
  currentUses: 0,
  displayOnPricingPage: true,
  promotionalText: 'Limited time offer - 20% off',
  badgeText: '20% OFF',
  badgeColor: '#ff6b6b',
}
```

## Managing Promotions

### Running a New Promotion

1. Go to `/admin/subscriptions` in your application
2. You can manage promotions in two ways:
   - Through the Subscription Plans tab to edit plan-specific discounts
   - Through the Promotion Codes tab to create and manage all promotions
3. To create a new promotion:
   - Enter a unique promotion code (e.g., SUMMER20)
   - Set discount percentage and applicable plans
   - Configure start and end dates
   - Set maximum usage limits and visual styling
   - Toggle "Active" status to make it live
4. The changes are stored in Firestore and immediately reflected on the pricing page

### Ending a Promotion

1. Either:
   - Let the promotion expire automatically based on the end date
   - Or manually toggle "Active" to OFF in the admin interface
2. Changes are reflected immediately on the landing page

### Best Practices for Promotions

1. **Timing**: Set appropriate end dates to create urgency
2. **Pricing**: Ensure discounted prices are competitive but sustainable
3. **Promo Codes**: Use clear, thematic codes (e.g., SUMMER20, BLACKFRIDAY)
4. **Communication**: Use the promotional banner to highlight special offers
5. **Testing**: Monitor conversion rates to optimize future promotions
6. **Firestore Security**: Ensure your Firestore security rules protect promotion data
7. **Admin Access**: Limit who can create and modify promotions
8. **URL Parameters**: All promotion codes are automatically passed to the authentication page via URL parameters

### Admin Dashboard Metrics

The admin dashboard provides metrics to monitor promotion effectiveness:

1. **Active Promotions**: Count of currently active promotions
2. **Promotion Usage**: Track how many times each code has been used
3. **Conversion Rate**: Percentage of users who subscribe after using a promo code
4. **Revenue Impact**: Comparison of revenue with/without promotions
5. **Plan Distribution**: How promotions affect the distribution across plans

## User Experience

1. **Visitor Arrives**: If discounts are active, they see:
   - Promotional banner with countdown timer
   - Discount badges on plan cards
   - Strikethrough pricing showing savings
   - Special CTA buttons
2. **Clicks Discount CTA**: When a user clicks a discount button:
   - They're directed to the auth page
   - Promo code is automatically included in URL parameters
3. **Sign Up Process**: After registration:
   - The discount is automatically applied
   - Promo code is tracked for analytics

## Technical Implementation

The system uses:

- **Firebase Firestore**: For storing discount configurations
- **Real-time Updates**: Through Firestore subscriptions
- **Admin Authentication**: To protect the discount management interface
- **URL Parameters**: For passing promo codes to the auth flow

## Example Campaigns

### Summer Sale

```jsx
{
  active: true,
  percentage: 20,
  originalPrice: 9.99,
  discountedPrice: 7.99,
  endDate: new Date('2025-08-31'),
  promoCode: 'SUMMER20'
}
```

### Black Friday Deal

```jsx
{
  active: true,
  percentage: 40,
  originalPrice: 9.99,
  discountedPrice: 5.99,
  endDate: new Date('2025-11-30'),
  promoCode: 'BLACKFRIDAY40'
}
```

### New Year Offer

```jsx
{
  active: true,
  percentage: 25,
  originalPrice: 29.99,
  discountedPrice: 22.49,
  endDate: new Date('2026-01-15'),
  promoCode: 'NEWYEAR25'
}
```

## Future Enhancements

- **First-time Visitor Modal**: Show a special popup to first-time visitors
- **Countdown Email Reminders**: Send reminders as the offer end date approaches
- **Referral Bonuses**: Combine discounts with referral incentives
- **Annual Plan Discounts**: Add similar discount functionality for annual subscriptions
- **Abandoned Cart Recovery**: Re-engage users who didn't complete signup after viewing discounts
- **Analytics Integration**: Track conversion rates for different promotions
- **Multi-language Support**: Add support for different languages in promotional messaging
- **Custom Themes**: Allow different visual themes for promotions

## Support

If you encounter any issues with the discount system or need help configuring a promotional campaign, please contact the development team.

## Customization Options

### Visual Elements

- **Discount Badges**: Edit the badge colors and messages in the pricing component
- **Promotional Banner**: Customize the gradient, messaging, and countdown timer style
- **CTA Buttons**: Modify the button text and colors to match your campaign theme

### Discount Logic

- **Discount Calculation**: You can modify the discount logic to offer fixed amounts instead of percentages
- **Countdown Timer**: Customize how remaining time is displayed (days, hours, minutes)
- **Promotional Messaging**: Edit the text to highlight specific features or seasonal themes

## Best Practices

1. **Limited-Time Offers**: Always include an end date to create urgency
2. **Meaningful Discounts**: Offer substantial discounts (15-30%) to drive conversions
3. **Clear Communication**: Clearly show both original and discounted prices
4. **Seasonal Themes**: Tie discounts to holidays or seasons when possible
5. **Promo Codes**: Use memorable, thematic promo codes (e.g., SUMMER20, BLACKFRIDAY)
6. **A/B Testing**: Test different discount percentages and messaging to optimize conversions

## Integration with Authentication

The discount system integrates with the authentication flow by adding the promo code as a URL parameter:

```jsx
<Link
  href={`/auth?promo=${activeDiscounts.premium.promoCode}`}
  className="block w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-center text-white font-medium rounded-lg transition-colors shadow-md relative overflow-hidden group"
>
  <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer"></span>
  Claim Discount Now
</Link>
```

The authentication page can access this parameter using Next.js's `useSearchParams` hook:

```jsx
const searchParams = useSearchParams();
const promoCode = searchParams.get('promo');
```

## Example Campaigns

### Summer Sale

```jsx
{
  active: true,
  percentage: 20,
  originalPrice: 9.99,
  discountedPrice: 7.99,
  endDate: new Date('2025-08-31'),
  promoCode: 'SUMMER20'
}
```

### Black Friday Deal

```jsx
{
  active: true,
  percentage: 40,
  originalPrice: 9.99,
  discountedPrice: 5.99,
  endDate: new Date('2025-11-30'),
  promoCode: 'BLACKFRIDAY40'
}
```

### New Year Offer

```jsx
{
  active: true,
  percentage: 25,
  originalPrice: 29.99,
  discountedPrice: 22.49,
  endDate: new Date('2026-01-15'),
  promoCode: 'NEWYEAR25'
}
```

## Future Enhancements

- **First-time Visitor Modal**: Show a special popup to first-time visitors
- **Countdown Email Reminders**: Send reminders as the offer end date approaches
- **Referral Bonuses**: Combine discounts with referral incentives
- **Annual Plan Discounts**: Add similar discount functionality for annual subscriptions
- **Abandoned Cart Recovery**: Re-engage users who didn't complete signup after viewing discounts

## Support

If you encounter any issues with the discount system or need help configuring a promotional campaign, please contact the development team.
