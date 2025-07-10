# Design Style Documentation

> **Update (2025):** Neumorphic/soft UI is now the primary style, with glassmorphism and blob design as accents. The Poppins font is used throughout, with a centralized color system. The footer and its links are feature-flagged and may be hidden. The cookie consent banner is minimal and modern.

## Overview
This application utilizes a modern design style that combines several contemporary UI trends to create a clean, approachable, and professional interface.

## Key Design Elements

### 1. Glassmorphism
- Translucent backgrounds with backdrop blur effects
- Subtle borders and shadows
- Layered UI elements with depth
- Frosted glass-like containers

### 2. Soft UI/Neumorphism
- Rounded corners and soft edges
- Subtle shadows and highlights
- Gentle color transitions
- Soft, tactile feel

### 3. Blob Design
- Floating gradient elements in background
- Animated decorative elements
- Organic shape patterns
- Soft color gradients

### 4. Modern UI Patterns
- Gradient microinteractions
- Animated transitions
- Clean typography hierarchy
- Responsive layout system

## Implementation Details

### Background Elements
```tsx
<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
  <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
  <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-700"></div>
  <div className="absolute bottom-40 right-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
</div>
```

### Container Styling
- Frosted glass effect: `backdrop-blur-sm`
- Subtle borders: `border-teal-100 dark:border-teal-900`
- Gradient backgrounds: `bg-gradient-to-br`
- Rounded corners: `rounded-lg`

### Color Palette
- Primary: Teal shades
- Secondary: Orange and Purple
- Accent: Blue and Pink
- Background: Soft gradients

## Design Principles

1. **Clean Hierarchy**
   - Clear visual separation between elements
   - Consistent spacing and alignment
   - Logical grouping of related components

2. **Accessibility**
   - Maintained contrast ratios
   - Clear focus states
   - Interactive elements easily identifiable

3. **Responsiveness**
   - Flexible layout system
   - Adaptive spacing
   - Mobile-friendly components

## Design Trends Combined
- Glassmorphism (2020-2023)
- Soft UI/Neumorphism
- Blob Design
- Gradient UI
- Organic Shapes

This design style creates a modern, approachable interface that maintains professional aesthetics while providing a pleasant user experience.
