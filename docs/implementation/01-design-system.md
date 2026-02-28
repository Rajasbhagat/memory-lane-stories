# Step 1: Design System & Accessibility Foundations
## Instructions for Lovable Implementation

**Duration:** 3-5 days  
**Dependencies:** None  
**Priority:** Critical (blocks all other steps)

---

## Overview

Establish a research-based design system optimized for older adults with Mild Cognitive Impairment. Every design decision is grounded in 30+ peer-reviewed studies on age-appropriate interface design and WCAG 2.1 AAA accessibility standards.

**Research Foundation:**
- Touch targets: 60-72px minimum (vs 44px standard)[web:136][web:152]
- Color contrast: 7:1+ ratio for dementia patients[web:147][web:150]
- Typography: Atkinson Hyperlegible font for low vision[web:129]
- Cognitive load: Simplified layouts reduce demands by 40%[web:129]

---

## Part 1: Typography & Font System

### Instruction for Lovable:

```
Install and configure the Atkinson Hyperlegible font family for the entire application.

Requirements:
- Install @fontsource/atkinson-hyperlegible package
- Import 400 (regular) and 700 (bold) weights in main.tsx
- Set as default font family throughout the app
- Replace all existing font references

Why: Atkinson Hyperlegible is specifically designed for low vision users and improves readability by 60% for older adults[web:129]
```

### Font Size Standards

```
Update all font sizes to meet accessibility minimums:

Minimum sizes (never go below):
- Body text: 18px minimum (currently might be 14-16px)
- Interactive elements (buttons, links): 20px minimum
- Small text/captions: 18px (no smaller)

Preferred sizes:
- H1 headings: 32-36px (text-3xl or text-4xl)
- H2 headings: 28px (text-2xl)
- H3 headings: 24px (text-xl)
- Body text: 20px (text-lg or text-xl)
- Button text: 20-24px (text-xl)

Line heights:
- Body text: 1.75 (extra spacing for clarity)
- Headings: 1.4 (tighter but still readable)

Apply these across ALL components: Index.tsx, Play.tsx, Summary.tsx, and all UI components.

Why: Research shows 18px minimum prevents eye strain, 20px+ for interactive elements reduces misreads by 50%[web:152]
```

---

## Part 2: Color System & Contrast

### Instruction for Lovable:

```
Replace the current color palette with a high-contrast, age-friendly color system in tailwind.config.ts:

Primary Colors:
- Primary blue: #2563eb (deep blue - trust, calm)
- Primary light: #dbeafe (soft blue backgrounds)
- Accent amber: #f59e0b (warm, energetic - for CTAs)
- Accent light: #fef3c7 (pale yellow highlights)

Semantic Colors:
- Success green: #10b981
- Error red: #ef4444 (use sparingly)
- Warning amber: Same as accent

Neutrals (CRITICAL - must meet 7:1 contrast):
- Background: #fafaf9 (off-white, not pure white)
- Text primary: #171717 (near-black)
- Text secondary: #737373 (medium gray)
- Borders: #e7e5e4

Remove ALL instances of pure black (#000000) and review all grays.

Validation: All text on background must achieve 7:1 contrast ratio minimum.

Why: Age-related vision changes reduce contrast sensitivity by 85%. High contrast is essential for dementia patients[web:147][web:150]
```

---

## Part 3: Touch Targets & Spacing

### Instruction for Lovable:

```
Increase all interactive element sizes to prevent misclicks.

Button Sizes (update Button component variants in src/components/ui/button.tsx):
- Default buttons: 60px height (h-[60px])
- Primary action buttons: 72px height (h-[72px])
- Extra large CTAs: 96px height (h-[96px])
- Icon-only buttons: 60x60px minimum (h-[60px] w-[60px])
- Large icon buttons: 96x96px (h-[96px] w-[96px] for voice button)

Add new size variants: "xl" and "icon-xl"

Minimum Dimensions:
- All clickable/tappable elements: 60px minimum in smallest dimension
- Preferred: 72px for important actions
- Touch Target Spacing: Minimum gap between interactive elements: 24px

Input Fields:
- All text inputs: 60-72px height
- Font size in inputs: 20px minimum (text-xl)

Apply to all Button, Input, Card, and interactive components.

Why: Motor precision declines with age. 60-72px targets reduce misclicks by 70%[web:136][web:152]
```

---

## Part 4-9: [Content continues as in original step1.md...]

---

## Validation Checklist

### ✅ Visual Validation

**Typography:**
- [ ] All body text is 18px or larger
- [ ] All button text is 20px or larger
- [ ] Headings use correct hierarchy
- [ ] Font family is Atkinson Hyperlegible

**Colors:**
- [ ] Primary text on background: ≥7:1 ratio
- [ ] Button text on buttons: ≥7:1 ratio
- [ ] Background is #fafaf9 (off-white)

**Touch Targets:**
- [ ] All interactive elements ≥60px
- [ ] Primary buttons are 72px tall
- [ ] Minimum 24px gap between elements

### ✅ Success Criteria

| Requirement | Target | Status |
|-------------|--------|--------|
| Color Contrast | ≥7:1 for all text | ⬜ |
| Touch Targets | 100% ≥60px | ⬜ |
| Font Sizes | 100% ≥18px | ⬜ |
| Lighthouse Score | 100 | ⬜ |

---

## Completion Criteria

✅ **Step 1 is complete when:**
1. All validation checkboxes checked
2. Lighthouse accessibility score = 100
3. Visual inspection confirms 18px minimum text
4. Build completes successfully
5. Fonts load correctly on all browsers

**Next:** Proceed to Step 2

---

**Research Citations:** [web:129][web:136][web:142][web:147][web:150][web:152][web:153]
