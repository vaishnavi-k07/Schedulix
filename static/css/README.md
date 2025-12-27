# Schedulix CSS Framework

A comprehensive, professional CSS framework and styling system for the Schedulix timetable management application.

## File Structure

```
static/css/
├── variables.css      # Design System Variables
├── typography.css     # Typography System
├── layout.css         # Layout System (Grid, Flexbox, Spacing)
├── components.css     # Reusable UI Components
├── animations.css     # Animations & Transitions
├── utilities.css      # Utility Classes
├── responsive.css     # Responsive Design (Mobile-First)
└── style.css          # Main Stylesheet (imports all modules)
```

## Quick Start

Import the main stylesheet in your HTML:

```html
<link rel="stylesheet" href="/static/style.css">
```

## CSS Custom Properties (Variables)

All design tokens are defined as CSS custom properties for easy theming:

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  
  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* ... and more */
}
```

## Color Palette

### Primary Colors (Blue)
```css
--color-primary-50: #eff6ff;
--color-primary-500: #3b82f6;
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
```

### Semantic Colors
```css
--color-primary: var(--color-primary-600);
--color-success: var(--color-success-500);
--color-warning: var(--color-warning-500);
--color-danger: var(--color-danger-500);
```

## Typography

### Font Families
- `--font-family-sans`: Inter, system fonts
- `--font-family-mono`: Fira Code, monospace

### Font Sizes
```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem;  /* 36px */
--font-size-5xl: 3rem;     /* 48px */
```

## Components

### Buttons

```html
<!-- Primary -->
<button class="btn btn-primary">Primary</button>

<!-- Secondary -->
<button class="btn btn-secondary">Secondary</button>

<!-- Danger -->
<button class="btn btn-danger">Danger</button>

<!-- Ghost -->
<button class="btn btn-ghost">Ghost</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-md">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Loading State -->
<button class="btn btn-primary btn-loading">Loading...</button>
```

### Forms

```html
<!-- Input -->
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-input" placeholder="Enter email">
</div>

<!-- Select -->
<select class="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Checkbox -->
<label class="form-checkbox">
  <input type="checkbox">
  <span class="form-checkbox-label">Remember me</span>
</label>

<!-- With Validation -->
<div class="form-group">
  <input type="text" class="form-input form-input-error" placeholder="Error state">
  <span class="form-error">This field is required</span>
</div>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    Card content goes here
  </div>
  <div class="card-footer">
    Card footer
  </div>
</div>

<!-- Hoverable -->
<div class="card card-hover">Hover me</div>
```

### Tables

```html
<div class="table-wrapper">
  <table class="table table-striped table-hover">
    <thead>
      <tr><th>Name</th><th>Email</th></tr>
    </thead>
    <tbody>
      <tr><td>John</td><td>john@example.com</td></tr>
      <tr><td>Jane</td><td>jane@example.com</td></tr>
    </tbody>
  </table>
</div>
```

### Modals

```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">Modal Title</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      Modal content
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Alerts

```html
<div class="alert alert-success">
  <span class="alert-icon">✓</span>
  <div class="alert-content">
    <strong class="alert-title">Success!</strong>
    <p class="alert-message">Operation completed successfully.</p>
  </div>
</div>
```

### Badges

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Inactive</span>
```

### Loaders

```html
<!-- Spinner -->
<div class="spinner spinner-primary"></div>

<!-- Loading Overlay -->
<div class="loading-overlay">
  <div class="spinner spinner-lg"></div>
</div>

<!-- Skeleton -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-title"></div>
```

### Toast Notifications

```html
<div class="toast-container">
  <div class="toast toast-success">
    <span class="toast-icon">✓</span>
    <div class="toast-content">
      <div class="toast-title">Success</div>
      <div class="toast-message">Saved successfully</div>
    </div>
    <button class="toast-close">&times;</button>
  </div>
</div>
```

## Layout

### Grid System

```html
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-1">Column 1</div>
  <div class="col-span-2">Column 2</div>
  <div class="col-span-1">Column 3</div>
</div>
```

### Flexbox

```html
<div class="flex flex-wrap gap-4">
  <div class="flex-1">Flex Item 1</div>
  <div class="flex-1">Flex Item 2</div>
</div>
```

### Spacing Utilities

```html
<!-- Margin -->
<div class="m-4">Margin 1rem</div>
<div class="mx-auto">Horizontal auto margin</div>
<div class="mt-6">Margin top 1.5rem</div>

<!-- Padding -->
<div class="p-4">Padding 1rem</div>
<div class="px-6">Horizontal padding 1.5rem</div>
<div class="py-8">Vertical padding 2rem</div>
```

## Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px;  /* Mobile landscape */
--breakpoint-md: 768px;  /* Tablet portrait */
--breakpoint-lg: 1024px; /* Tablet landscape / Desktop */
--breakpoint-xl: 1280px; /* Desktop */
```

### Responsive Classes
```html
<!-- Mobile first - shown on all screens -->
<div class="text-center">Centered text</div>

<!-- Tablet and up -->
<div class="md:text-left">Left aligned on tablet+</div>

<!-- Desktop only -->
<div class="lg:grid-cols-4">4 columns on desktop</div>

<!-- Hide on mobile -->
<div class="hide-on-mobile">Hidden on mobile</div>
```

### Mobile Navigation

```html
<button class="mobile-menu-btn" aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>

<div class="mobile-menu-overlay"></div>
<nav class="mobile-menu">
  <!-- Navigation items -->
</nav>
```

## Animations

### Keyframe Animations

```html
<div class="animate-fade-in">Fade In</div>
<div class="animate-fade-in-up">Fade In Up</div>
<div class="animate-scale-in">Scale In</div>
<div class="animate-bounce">Bounce</div>
<div class="animate-pulse">Pulse</div>
<div class="animate-spin">Spinner</div>
```

### Transitions

```html
<div class="transition hover-lift">Hover Lift</div>
<div class="transition hover-scale">Hover Scale</div>
<div class="transition hover-shadow">Hover Shadow</div>
```

### Utility Classes

```css
.transition { transition: all 0.2s ease-in-out; }
.transition-colors { transition: background-color, border-color, color; }
.transition-fast { transition-duration: 150ms; }
.transition-slow { transition-duration: 300ms; }
```

## Dark Mode

The framework automatically supports dark mode via CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #f9fafb;
    --color-bg-primary: #111827;
    /* Colors automatically adjust */
  }
}
```

## Reduced Motion

Animations are disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Print Styles

Print styles are included for printing timetables:

```css
@media print {
  .navbar, .sidebar, .footer { display: none; }
  .card { box-shadow: none; border: 1px solid #000; }
  /* Tables break nicely across pages */
}
```

## Accessibility Features

- **Focus Visible**: Clear focus indicators on all interactive elements
- **Skip Link**: Skip to main content link for keyboard users
- **Color Contrast**: WCAG AA compliant color ratios
- **Reduced Motion**: Respects user preferences
- **Semantic HTML**: Proper heading hierarchy and ARIA support

## Timetable-Specific Styles

```html
<!-- Timetable grid cells -->
<div class="timetable-cell break">Break</div>
<div class="timetable-cell filled">Mathematics</div>

<!-- Schedule entries -->
<div class="schedule-entry">9:00 AM - 10:00 AM</div>

<!-- Day headers -->
<div class="day-header">Monday</div>
```

## Customization

### Overriding Variables

```css
:root {
  --color-primary: #your-color;
  --font-family-sans: 'Your Font', sans-serif;
  --radius-lg: 0.5rem;
}
```

### Adding New Components

Add new components to `components.css` following the existing pattern:

```css
.component-name {
  display: flex;
  padding: var(--space-4);
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This CSS framework is part of the Schedulix project.
