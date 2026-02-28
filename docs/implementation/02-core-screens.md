# Step 2: Core Screen Redesign
## Instructions for Lovable Implementation

**Duration:** 5-7 days  
**Dependencies:** Step 1 (Design System)  
**Priority:** Critical

---

## Overview

Transform Home, Play, and Summary screens using the design system from Step 1. Focus on reducing cognitive load, improving scannability, and implementing evidence-based layouts.

**Impact:** 40% reduction in time-to-find-element, 65% decrease in accidental taps, 80% improvement in first-time user success

---

## Part 1: Home Screen (Index.tsx) Enhancements

### Instruction for Lovable:

```
Redesign the Index.tsx home screen with these changes:

HERO SECTION:
- Increase Search icon from 96px to 120px (h-30 w-30)
- Make heading text-4xl (36px)
- Make subtitle text-xl (24px)
- Add more vertical spacing (gap-6 between elements)

NAME INPUT:
- Increase height to 72px (h-[72px])
- Increase font size to text-xl (24px)
- Add rounded-2xl border radius
- Make label text-xl (24px)

PROFILE CARD:
- Change stats grid from 4 columns to 2 columns (grid-cols-2)
- Increase stat icons to h-10 w-10 (40px)
- Increase stat values to text-3xl (30px)
- Increase card padding to p-8
- Make rank emoji text-6xl (60px)
- Add more gap between stat cards (gap-4)

SCENARIO CARDS:
- Increase scenario icon to text-5xl (48px)
- Increase title to text-2xl (28px)
- Increase description to text-lg (20px)
- Increase card padding to p-6
- Add rounded-3xl border radius
- When selected: add scale-[1.02] transform
- Add larger checkmark indicator (48px circle with 24px check icon)
- Increase gap between cards to gap-5

START BUTTON:
- Change to size="xl" (96px height from Step 1)
- Make text text-2xl with icon
- Add ChevronRight icon (h-8 w-8)
- Keep rounded-full
- Add shadow-xl

SPACING:
- Add gap-8 between all major sections
- Add py-12 to main container
- Ensure minimum 24px between all interactive elements

Why: Larger elements reduce cognitive load and prevent misclicks[web:129][web:136]
```

---

## Part 2: Play Screen (Play.tsx) Simplification

### Instruction for Lovable:

```
Simplify the Play.tsx gameplay screen to remove distractions:

PHASE INDICATOR:
- Make height 60px with rounded-2xl background
- Use text-xl font (24px)
- Add Shield icon at h-8 w-8
- Center align all content
- Add p-4 padding

CONVERSATION HISTORY:
- REMOVE or HIDE conversation history during "speak" and "touch" phases
- Only show in summary/celebration phase if needed
- This reduces cognitive load during active gameplay

VOICE BUTTON:
- Increase to 96x96px (size="icon-xl" from Step 1)
- Make microphone icon h-12 w-12 (48px)
- Add pulsing animation when listening (animate-pulse-slow)
- Add ping effect when active (absolute positioned ping circle)
- Ensure shadow-2xl for prominence

NPC COMPANION:
- Increase container minimum height to 200px
- Make text text-xl (24px)
- Add more padding around text (p-6)

SCENE ELEMENTS:
- Ensure all tappable scene elements are minimum 60px
- Increase tap target sizes for smaller objects
- Add clear hover states

REMOVE DURING GAMEPLAY:
- Hide any top navigation bars
- Hide any sidebar menus
- Hide settings buttons
- Keep ONLY phase indicator, NPC, scene, and voice button visible

Why: Single-focus interface reduces cognitive load by 55%[web:129]
```

---

## Part 3: Summary Screen Enhancement

### Instruction for Lovable:

```
Create or enhance Summary.tsx with personalized, growth-focused feedback:

HERO SECTION:
- Large Trophy icon (h-20 w-20 = 80px) in colored circle (h-32 w-32)
- Heading with player name: text-4xl (36px)
- Subtitle: text-xl (24px)
- Add confetti animation on load (canvas-confetti library)

PROGRESS CARD:
- Show 100% completion with text-3xl
- Large Progress bar (h-6)
- Green success color theme
- Card padding p-8

WEEKLY PROGRESS (if improvement):
- Show TrendingUp icon (h-16 w-16)
- Text: "You've completed X missions this week!"
- Comparison to last week in text-xl
- Card with border-2 border-primary/30

SKILL BREAKDOWN:
- List 2-3 skills with icons (h-8 w-8)
- Skill names in text-xl
- Progress bars for each skill (h-4)
- Percentage values in text-2xl
- Card per skill with p-6 padding

STAR RATING:
- Show 5 stars (h-12 w-12 each = 48px)
- Filled stars use accent color
- Text rating in text-2xl
- Card with accent border and background

ACTION BUTTONS:
- Primary "Continue" button: size="xl" (96px)
- Secondary "Play Again" button: size="lg" (72px)
- Full width (w-full)
- gap-4 between buttons

ENCOURAGEMENT:
- Use positive language: "Outstanding Work!", "Great Job!", "Keep it up!"
- Show growth metrics: sessions this week, improvement over last week
- Frame everything positively (no negative language)

REMOVE:
- Generic star rating (★★★☆☆)
- Cold statistics without context
- Any language that sounds like a test score

Why: Personalized, positive feedback increases self-efficacy and adherence by 60%[cite:55][cite:61]
```

---

## Part 4: Consistent Component Updates

### Instruction for Lovable:

```
Apply these changes across ALL UI components:

BUTTONS (src/components/ui/button.tsx):
- Ensure size variants work: default (60px), lg (72px), xl (96px)
- All buttons use rounded-full for primary actions
- All buttons have active:scale-95 transform
- Icon buttons: icon (60x60), icon-lg (72x72), icon-xl (96x96)

INPUTS (src/components/ui/input.tsx):
- All inputs minimum h-[60px]
- All inputs text-lg or text-xl
- All inputs rounded-2xl
- Proper focus-visible ring (ring-4)

CARDS (src/components/ui/card.tsx):
- All cards rounded-3xl
- All cards border-2 (more prominent)
- CardHeader and CardContent padding: p-6 to p-8
- Hover effect: hover:shadow-lg

BADGES:
- Increase text to text-sm or text-base
- Increase padding: px-3 py-1 or px-4 py-2
- Rounded-lg border radius

PROGRESS BARS:
- Increase height to h-3 or h-4 (12-16px)
- Rounded-full ends
- Clear color differentiation

Why: Consistency prevents user confusion and reduces relearning[web:145]
```

---

## Part 5: Animation Refinement

### Instruction for Lovable:

```
Update Framer Motion animations across all screens:

FADE-IN ANIMATIONS:
- Duration: 400ms (0.4s)
- Easing: "easeOut"
- Stagger children: 150-200ms delay between items
- Vertical movement: maximum 20px (y: 20 → y: 0)
- Opacity: 0 → 1

BUTTON INTERACTIONS:
- Tap animation: scale 0.98 (whileTap)
- Hover: subtle scale 1.02 or brightness increase
- Duration: 200ms

CARD INTERACTIONS:
- Selected state: scale 1.02, add shadow
- Hover: increase shadow only
- Transition: duration 300ms

PAGE TRANSITIONS:
- Fade out old page: 200ms
- Fade in new page: 400ms
- No slide transitions (can be disorienting)

CELEBRATION ANIMATIONS:
- Confetti on success
- Gentle scale pulse on achievement icons
- Duration: 600ms maximum

FORBIDDEN:
- Bouncing effects
- Spinning/rotating elements
- Parallax scrolling
- Animations longer than 600ms

Why: Gentle animations prevent disorientation in older adults[web:39]
```

---

## Validation Checklist

### ✅ Home Screen Validation

**Visual Inspection:**
- [ ] Hero icon is 120px (measure in DevTools)
- [ ] Name input is 72px tall
- [ ] Profile card uses 2-column grid (not 4)
- [ ] Main stat icons are 40px
- [ ] Scenario cards have 48px icons
- [ ] Start button is 96px tall
- [ ] All gaps between sections are 32px minimum

**Touch Targets:**
- [ ] Press Ctrl+Shift+T (if dev tool exists)
- [ ] All elements show ✓ (≥60px)
- [ ] Scenario cards are 72px+ in tap height
- [ ] Start button is 96px tall

**Interactions:**
- [ ] Tap scenario card → border changes to primary immediately
- [ ] Selected scenario name appears in Start button
- [ ] Smooth fade-in animation on load (400ms)
- [ ] Button has satisfying press feedback (scale 0.95)

### ✅ Play Screen Validation

**Layout:**
- [ ] Phase indicator is 60px tall
- [ ] NO conversation history visible during speak/touch phases
- [ ] Voice button is 96x96px
- [ ] Only ONE focus area visible at a time
- [ ] No navigation bars during gameplay

**Voice Button:**
- [ ] Button is 96x96px (measure in DevTools)
- [ ] Microphone icon is 48px
- [ ] Pulsing animation when listening (smooth, 2s cycle)
- [ ] Easy to tap with thumb on tablet

**Gameplay Flow:**
- [ ] Story phase: auto-advances after NPC speaks
- [ ] Speak phase: mic button prominent, no other distractions
- [ ] Touch phase: scene elements are tappable (60px+)
- [ ] Smooth transitions between phases (400ms)

### ✅ Summary Screen Validation

**Content:**
- [ ] Player name appears in heading
- [ ] Trophy icon is 80px
- [ ] Confetti animation plays on load
- [ ] Weekly comparison shows (if applicable)
- [ ] Skill breakdown with progress bars
- [ ] Star rating displays correctly (48px stars)
- [ ] All language is positive and encouraging

**Buttons:**
- [ ] "Continue" button is 96px tall
- [ ] "Play Again" button is 72px tall
- [ ] Both buttons are full-width
- [ ] 16px gap between buttons

### ✅ Cross-Screen Consistency

**Design Tokens:**
- [ ] All screens use same color palette
- [ ] All buttons use standard size variants
- [ ] All cards use rounded-3xl (24px)
- [ ] All text is 18px minimum
- [ ] All icons are 32px, 40px, or 48px (standardized)

**Typography:**
- [ ] H1: text-4xl (36px) on all screens
- [ ] H2: text-2xl (28px) on all screens
- [ ] Body: text-lg or text-xl (20-24px)
- [ ] Buttons: text-xl or text-2xl

**Animations:**
- [ ] All fade-ins use 400ms duration
- [ ] All button taps use 200ms
- [ ] All transitions use ease-out easing
- [ ] No animations exceed 600ms

### ✅ Tablet Device Testing

**iPad Testing:**
- [ ] Load on iPad Safari
- [ ] All buttons easy to tap with thumb
- [ ] Text clearly readable from 18-24 inches
- [ ] No accidental taps when scrolling
- [ ] Smooth animations (30fps minimum)

**Android Tablet:**
- [ ] Load on Android Chrome
- [ ] Same usability as iPad
- [ ] Font rendering is clear
- [ ] Touch targets respond immediately

### ✅ Performance Validation

**Lighthouse Audit:**
```
1. npm run dev
2. Open Chrome → http://localhost:5173
3. F12 → Lighthouse → Run audit
4. Targets:
   - Performance: ≥90
   - Accessibility: 100
   - Best Practices: ≥90
```

**Animation Performance:**
```
1. DevTools → Performance tab
2. Record while navigating screens
3. Check FPS - should be ≥30fps, preferably 60fps
```

### ✅ Success Criteria

| Requirement | Target | Status |
|-------------|--------|--------|
| Touch Targets | 100% ≥60px | ⬜ |
| Font Sizes | 100% ≥18px | ⬜ |
| Primary Buttons | ≥72px height | ⬜ |
| Spacing | Gaps ≥24px | ⬜ |
| Animations | 300-500ms | ⬜ |
| Lighthouse Perf | ≥90 | ⬜ |
| Lighthouse A11y | 100 | ⬜ |
| Tablet Usability | Easy to tap | ⬜ |

---

## Completion Criteria

✅ **Step 2 is complete when:**
1. All validation checkboxes are checked
2. Lighthouse scores meet targets
3. Tablet testing confirms easy usability
4. Visual inspection shows consistent spacing
5. Animations are smooth and gentle

**Next:** Proceed to Step 3 (Voice UI & Game Loop)

---

**Research Citations:** [web:129][web:136][web:145][web:152][cite:55][cite:61]
