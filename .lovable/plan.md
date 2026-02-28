

## What's Missing — Docs vs. Implementation Gap Analysis

### 1. SVG Scene Illustrations (HIGH priority)
**Doc spec**: Three dedicated SVG scene components — `OperationsRoomScene.tsx`, `SafehouseKitchenScene.tsx`, `EvidenceRunScene.tsx` — with illustrated environments, hover glows, and contextual visuals.
**Current**: `SceneContainer.tsx` renders a flat grid of emoji buttons for all scenarios. No SVG illustrations, no scene-specific components, no visual context.

### 2. Scenario Data Mismatches
**Doc spec**: Scenario 1 has randomized error types (wrong placement, duplicate, missing item). Scenario 3 Route A (Direct/Main Road) is correct. Print shop envelope details include Officer Martinez, ORIGINAL/COPY distinction, and case #4712.
**Current**: `scenarios.ts` uses simplified static data — no randomization, Route "Park Route" is marked correct (contradicts docs), envelope labels don't match doc spec (wrong case numbers, missing Officer name/COPY details).

### 3. Hint Escalation System
**Doc spec**: 3-tier escalation — attempt 1: gentle redirect, attempt 2: specific verbal hint, attempt 3+: correct item auto-highlights with pulsing glow. Each scenario has unique hint text per tier.
**Current**: Single hint button opens an overlay with one static hint. No attempt tracking, no escalation tiers, no auto-highlighting on 3+ wrong taps.

### 4. Text-to-Speech (NPC speaks aloud)
**Doc spec**: Johnny narrates via TTS. `playNarration()` function in voice hook. `speaking` voice state. Waveform animates during NPC speech.
**Current**: No TTS implementation. Johnny's text is displayed only visually. `speaking` state exists but is never entered.

### 5. NPC Avatar — SVG Illustration
**Doc spec**: Round 64px SVG avatar of Johnny the detective, with mood-based expression variants (neutral, happy, thinking).
**Current**: Emoji placeholders (🕵️, 😄, 🤔) instead of illustrated avatar.

### 6. Personalization with Player Name
**Doc spec**: Johnny addresses user as "Detective {name}" in success messages and summary. Welcome screen stores name in localStorage.
**Current**: Name is stored in localStorage on welcome screen, but never passed to game or used in NPC dialogue or summary messages.

### 7. Skip-Speak Timeout
**Doc spec**: After 15 seconds of no voice/text input in speak phase, Johnny says "No worries, just tap what looks wrong!" and auto-advances to touch.
**Current**: No timeout. User stays stuck in speak phase indefinitely if they don't interact.

### 8. Confetti/Particle Effects
**Doc spec**: Summary page has "subtle confetti" animation for 3 seconds. Celebration overlay has confetti/sparkle particles.
**Current**: Both use a single 🎉 emoji. No particle/confetti animation system.

### 9. Star Rating with Titles
**Doc spec**: 0 hints = ⭐⭐⭐ "Master Detective!", 1-3 hints = ⭐⭐ "Sharp Investigator!", 4+ hints = ⭐ "Good Work, Rookie!"
**Current**: Star calculation exists but rating titles are missing.

### 10. `prefers-reduced-motion` Support
**Doc spec**: All animations respect `prefers-reduced-motion` media query.
**Current**: No reduced motion handling. All Framer Motion animations play regardless.

### 11. Waveform During NPC Speech
**Doc spec**: Waveform visualizer animates during both `listening` and `speaking` states.
**Current**: Waveform only shows during `listening`.

### 12. Error Handling for Voice
**Doc spec**: Mic permission denied shows fallback message. No speech detected resets to idle with message. Auto-retry on disconnect.
**Current**: Basic `onerror` sets state to idle. No user-facing error messages, no mic permission handling UI.

### 13. Session Persistence / Data Storage
**Doc spec** (implied by Cloud setup): No database tables for storing session results.
**Current**: Stats are passed via router state only — lost on refresh. No persistence.

### 14. Gemini API Still Returning 404
The edge function is still broken. The model `gemini-2.5-flash` may not be available via the `v1beta` endpoint with a direct API key. Need to verify the correct model identifier or switch to using Lovable AI's built-in model support (which doesn't require an API key).

---

### Implementation Priority Order

1. **Fix Gemini API 404** — Switch to Lovable AI built-in model support (no API key needed) or correct the model endpoint
2. **Fix scenario data** to match docs (route/envelope corrections, add randomization)
3. **Add hint escalation** with attempt tracking and auto-highlight on 3+ wrong taps
4. **Add skip-speak timeout** (15s auto-advance)
5. **Add player name** to NPC dialogue and summary
6. **Add star rating titles** to summary
7. **Create SVG scene components** for all 3 scenarios
8. **Add TTS** for Johnny's narration
9. **Add confetti particles** to celebration and summary
10. **Add NPC SVG avatar** with mood variants
11. **Add reduced motion support**
12. **Add voice error handling UI**
13. **Add session persistence** to database

