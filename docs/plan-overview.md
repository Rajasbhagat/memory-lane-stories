# MindSet (Cogni-Companion) — Plan Overview

## Project Summary

MindSet is a cognitive exercise web app disguised as a detective/spy story. Players help **Johnny**, a friendly detective character, spot mistakes across 3 interactive scenarios. The app uses a **"Talk-then-Touch"** gameplay loop — users first describe what's wrong verbally, then tap the incorrect element in an interactive SVG scene.

Designed for **older adults / cognitive wellness**, with accessibility-first design, warm aesthetics, and zero clinical language.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Routing | React Router DOM v6 |
| Voice | Gemini Live API (WebSocket) with mock mode |
| State | React hooks (`useGameState`, `useVoiceSession`) |
| Font | Atkinson Hyperlegible (Google Fonts) |

---

## Design System

### Color Palette (HSL)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `40 33% 96%` | Warm cream page background |
| `--foreground` | `220 20% 25%` | Soft dark text |
| `--primary` | `153 30% 52%` | Sage green — NPC highlights, success states |
| `--primary-foreground` | `0 0% 100%` | White text on primary |
| `--accent` | `12 76% 61%` | Warm coral — CTAs, important actions |
| `--accent-foreground` | `0 0% 100%` | White text on accent |
| `--muted` | `40 20% 90%` | Subtle backgrounds, disabled states |
| `--muted-foreground` | `220 10% 50%` | Secondary text |
| `--card` | `40 25% 98%` | Card surfaces |
| `--card-foreground` | `220 20% 25%` | Card text |
| `--destructive` | `0 70% 55%` | Error states (rarely used — prefer gentle hints) |
| `--border` | `40 15% 85%` | Soft warm borders |
| `--ring` | `153 30% 52%` | Focus rings (sage green) |

### Typography

- **Font Family**: Atkinson Hyperlegible (loaded from Google Fonts)
- **Body minimum**: 22px
- **Headings**: 28–36px, bold
- **Speech bubbles**: 24px
- **Button text**: 20px, semi-bold
- **Line height**: 1.6 for body, 1.3 for headings

### Spacing & Layout

- **Touch targets**: Minimum 48×48px, preferred 56×56px
- **Border radius**: 16px for cards, 999px (full-round) for buttons
- **Page padding**: 24px mobile, 48px tablet+
- **Max content width**: 800px centered
- **Transitions**: 300ms ease-out for all interactions

### Accessibility Requirements

- WCAG 2.1 AA contrast ratios minimum
- All interactive elements keyboard-accessible
- Focus indicators visible (3px sage ring)
- No time pressure — users proceed at their own pace
- Text alternatives for all SVG scene elements
- Reduced motion support via `prefers-reduced-motion`

---

## Routing Structure

| Route | Page | Description |
|-------|------|-------------|
| `/` | Welcome Screen | Greeting, optional name input, "Start Mission" button |
| `/play` | Game Screen | Active gameplay — NPC + scene + voice controls |
| `/summary` | Session Summary | "Mission Complete" stats and replay option |
| `*` | Not Found | 404 page with link back to home |

---

## File Structure (Planned)

```
src/
├── components/
│   ├── game/
│   │   ├── NPCCompanion.tsx
│   │   ├── VoiceControls.tsx
│   │   ├── HintOverlay.tsx
│   │   ├── CelebrationOverlay.tsx
│   │   └── scenes/
│   │       ├── OperationsRoomScene.tsx
│   │       ├── SafehouseKitchenScene.tsx
│   │       └── EvidenceRunScene.tsx
│   ├── ui/ (shadcn components)
│   └── NavLink.tsx
├── hooks/
│   ├── useGameState.ts
│   └── useVoiceSession.ts
├── data/
│   └── scenarios.ts
├── pages/
│   ├── Index.tsx (Welcome)
│   ├── Play.tsx (Game)
│   ├── Summary.tsx
│   └── NotFound.tsx
└── lib/
    └── utils.ts
```
