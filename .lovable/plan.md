

# Step-by-Step Implementation Plan

I've reviewed all 5 uploaded documents and the full codebase. Here's the consolidated plan broken into focused implementation steps. Each step will be done one at a time, and I'll wait for your approval before moving to the next.

---

## Step 1: Save Reference Documents
Save all 5 implementation guides to `docs/implementation/` for ongoing reference.

**Files to create:** 5 markdown files in `docs/implementation/`

---

## Step 2: Core Screen — Index.tsx Redesign
- Hero icon 120px in larger circle, heading `text-4xl`, subtitle `text-xl`
- Name input 72px height, `text-xl`, `rounded-2xl`
- Profile card: stat icons 40px, stat values `text-3xl`, rank emoji `text-6xl`, padding `p-8`, 2-col grid
- Scenario cards: icon `text-5xl`, title `text-2xl`, description `text-lg`, padding `p-6`, selected `scale-[1.02]`, larger checkmark (48px circle)
- Start button: 96px height (`size="xl"`), `text-2xl`, ChevronRight icon, `shadow-xl`
- Section gaps `gap-8`, container `py-12`

**Files:** `src/pages/Index.tsx`

---

## Step 3: Core Screen — Play.tsx Simplification
- Phase indicator: 60px card with `rounded-2xl`, `text-xl`, Shield icon
- Hide conversation history during gameplay (reduce cognitive load)
- NPC container min-height 200px, text `text-xl`, padding `p-6`
- Voice button confirmed 96px (already done), mic icon 48px
- Ensure all scene element touch targets 60px+
- Single-focus layout: only phase indicator, NPC, scene, voice controls visible

**Files:** `src/pages/Play.tsx`

---

## Step 4: Core Screen — Summary.tsx Enhancement
- Trophy icon (80px) in colored circle (128px)
- Player name in `text-4xl` heading
- Skill breakdown with progress bars
- Star rating with 48px stars, sequential pop-in animation
- "Play Again" → 96px CTA, "Done" → 72px
- Growth-focused positive language throughout
- Johnny farewell in framed card

**Files:** `src/pages/Summary.tsx`

---

## Step 5: Voice Button & VoiceControls Enhancement
- Animated ping effect when listening (two-layer ping at bottom-right)
- Brief transcription overlay below mic (3s fadeout, `bg-primary/10`, `rounded-2xl`)
- States: idle=primary blue, listening=accent amber+pulse+ping, processing=disabled, error=red flash
- Haptic-like visual feedback (scale-95) on tap

**Files:** `src/components/game/VoiceControls.tsx`

---

## Step 6: Progressive Hint System (Errorless Learning)
- 3-tier hint system: subtle pivot → stronger self-correction → gentle direct guidance
- Tier 1: small lightbulb icon, 3s delay after no response
- Tier 2: larger lightbulb with glow, immediate after second miss
- Tier 3: gentle arrow/highlight near error, auto-advance after 5s
- Never use "wrong", "incorrect", red X marks
- Track hint tier in game state for adaptive difficulty

**Files:** `src/hooks/useGameState.ts`, `src/pages/Play.tsx`, `src/components/game/HintOverlay.tsx`

---

## Step 7: NPC Companion Enhancement
- Avatar 96px with `border-4 border-primary`
- Speech bubble min-height 120px, text `text-xl`, padding `p-6`, proper pointer/tail
- Typing indicator: three animated dots in speech bubble shape
- Mood-based subtle background tinting (warm glow happy, blue thinking)
- Name tag styled as detective badge

**Files:** `src/components/game/NPCCompanion.tsx`

---

## Step 8: Scene Container & Touch Phase Polish
- All tappable elements min 60px, small objects 80px
- Hover: scale 1.05x, tap: scale 0.95x
- Correct tap: green checkmark overlay + confetti burst
- Incorrect tap: gentle shake + "Try another" text (no penalty language)
- Min 16px gap between elements, no overlapping
- Speech rate adaptation: baseline 0.8x, increase after successes, decrease after hints

**Files:** `src/components/game/SceneContainer.tsx`, `src/components/game/CelebrationOverlay.tsx`

---

## Step 9: Adaptive Difficulty System
- Create `src/hooks/useAdaptiveDifficulty.ts` with performance tracking
- Track: consecutive successes, consecutive hints, response time, session duration
- Rule 1 (Level Up): 3 consecutive successes → increase speech rate, add distractors
- Rule 2 (Level Down): 2 consecutive hints → decrease rate, remove distractors (silent)
- Rule 4 (Fatigue): session >20min → show break prompt
- Create `src/components/game/BreakPrompt.tsx`
- Add `complexity` tags to scenario errors in `src/data/scenarios.ts`
- Persist difficulty tier to localStorage and database

**Files:** `src/hooks/useAdaptiveDifficulty.ts` (new), `src/components/game/BreakPrompt.tsx` (new), `src/data/scenarios.ts`, `src/hooks/useGameState.ts`, `src/pages/Play.tsx`, database migration

---

## Step 10: Accessibility Audit & Keyboard Navigation
- Add alt text to all images/icons, aria-labels to icon-only buttons
- Heading hierarchy H1→H2→H3 (no skips)
- Skip-to-content link
- Tab navigation through all interactive elements in logical order
- Enter/Space activates buttons, Escape closes overlays
- Focus management: modal focus trapping, return focus on close
- Focus on mic button during speak phase

**Files:** `src/pages/Index.tsx`, `src/pages/Play.tsx`, `src/pages/Summary.tsx`, `src/components/game/*.tsx`, `src/index.css`

---

## Step 11: Performance & Error Handling
- Lazy load Play and Summary pages with `React.lazy()` + `Suspense`
- Compress images to WebP
- CSS transforms for animations, `will-change` for animated elements
- Mic permission denied: friendly message + text fallback
- Network errors: retry button + save partial progress
- Error Boundary component wrapping App
- Loading skeletons for profile card, scenario list (show only if >500ms)

**Files:** `src/App.tsx`, `src/pages/Play.tsx`, `src/components/game/*.tsx`

---

## Step 12: Settings & Testing Mode
- Settings modal/page with: voice speed slider (0.8x-1.1x), animations toggle (Full/Reduced/Off), text size (Small/Medium/Large), reset progress
- Settings icon on home screen
- `?testmode=true` URL param: console logging, phase skipping, mock transcriptions
- Demo mode without mic

**Files:** `src/pages/Settings.tsx` (new) or settings modal, `src/pages/Index.tsx`, `src/App.tsx`

---

## Execution Order
Steps 1-4 (docs + screens) → Steps 5-8 (voice + gameplay) → Step 9 (adaptive) → Steps 10-12 (polish)

Each step will be implemented individually. After each one, I'll confirm completion and you can test before we proceed.

**Ready to start with Step 1: saving the reference documents?**

