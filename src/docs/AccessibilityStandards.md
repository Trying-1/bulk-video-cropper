# Accessibility Standards and Visual Contrast Guidelines

## Overview

This document outlines the accessibility standards and visual contrast guidelines implemented across the Bulk Video Cropper application. These enhancements ensure compliance with WCAG (Web Content Accessibility Guidelines) 2.1 Level AA, improving usability for all users, including those with visual impairments.

## Contrast Requirements

All text and interactive elements should meet the following minimum contrast ratios:

- **Normal Text (< 18pt)**: 4.5:1 minimum contrast ratio against background
- **Large Text (≥ 18pt)**: 3:1 minimum contrast ratio against background
- **UI Components and Graphical Objects**: 3:1 minimum contrast ratio

## Implemented Contrast Improvements

### Typography

- **Headings**: Enhanced visibility with border-left accents and stronger font weights
- **Body Text**: Upgraded from gray-500 to gray-700 for better readability
- **Small Text**: Increased contrast by using darker colors (text-gray-700 instead of text-gray-500)
- **Links**: Improved contrast with underlines for non-button links

### Interactive Elements

- **Buttons**: Added border outlines to improve visibility
- **Status Pills**: Enhanced using high-contrast color combinations
- **Form Controls**: Improved input fields with stronger borders
- **Tab Selectors**: Better active state indication through color and weight

### Dark Mode Support

- Using `dark:text-gray-300` instead of `dark:text-gray-400` for better contrast
- Stronger interactive element borders in dark mode
- Higher contrast icons with increased stroke width
- Background colors adjusted for better foreground text legibility

### Tables and Cards

- Added borders to separate table rows and cards
- Improved cell padding for better readability
- Font weights upgraded from medium to semibold for headings
- Added aria-labels to improve screen reader compatibility

## Accessibility Enhancements

In addition to contrast improvements, we've added:

- **ARIA Attributes**: Applied role, aria-selected, aria-pressed, and aria-label attributes
- **Focus States**: Enhanced keyboard focus visibility 
- **Semantic Structure**: Used proper heading hierarchy
- **Button Labeling**: Improved labeling for actions with clear descriptions

## Component-Specific Guidelines

### MetricCard Component

```tsx
// High contrast version
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
  <div>
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
    <div className="mt-1 flex items-baseline">
      <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
      {renderTrend()}
    </div>
  </div>
</div>
```

### Status Indicators

```tsx
// High contrast status pill
<span className="px-2 py-1 text-xs font-bold text-yellow-800 bg-yellow-200 rounded-full border border-yellow-300">
  Pending
</span>
```

### Buttons

```tsx
// Accessible button with aria label
<button
  onClick={handleAction}
  className="text-sm px-3 py-2 bg-green-700 text-white rounded font-medium border border-green-600"
  aria-label="Approve testimonial"
>
  Approve
</button>
```

## Maintenance Guidelines

When implementing new features or modifying existing ones:

1. Test color contrast with tools like the WebAIM contrast checker
2. Ensure text is at least 16px (or relative equivalent) where possible
3. Add aria attributes for any non-standard or complex UI components
4. Test with keyboard navigation to ensure all interactive elements are accessible
5. Support both light and dark modes with appropriate contrast ratios

These standards should be followed across all pages in the application to maintain a consistent, accessible user experience.
