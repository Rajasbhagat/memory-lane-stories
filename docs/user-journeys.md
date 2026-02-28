# MindSet — User Journeys

## Overview

All journeys follow the **Talk-then-Touch** loop:
1. **Story** — Johnny narrates the situation
2. **Speak** — User describes the mistake verbally (or types)
3. **Touch** — User taps the wrong element in the SVG scene
4. **Feedback** — Celebration or gentle hint → next scenario

---

## Journey 1: Welcome → Start

### Entry
User opens the app for the first time (or returns).

### Flow
1. **Landing** (`/`): Warm cream background, friendly illustration
2. User sees: "Welcome to MindSet!" (or "Welcome back, [Name]!" if returning)
3. Optional: Text input "What should I call you?" — large, friendly input field
4. User enters name → stored in `localStorage`
5. Large coral button: **"Start Today's Mission"**
6. Button has gentle scale animation on hover/tap
7. Click → smooth fade transition to `/play`

### Edge Cases
- No name entered → defaults to "Detective"
- Returning user → name pre-filled, greeting personalized

---

## Journey 2: Scenario 1 — Mission Control Kits (Home Prep)

### Context
Johnny is in his operations room preparing two daily kits before leaving on a case.

### Flow

#### Phase 1: Story
1. Screen loads with SVG operations room scene (desk, two kit boxes)
2. Johnny's avatar appears top-left with speech bubble
3. Typing animation: *"Alright, I'm heading out on a case today. I need to pack my two kits — Tech and Evidence. Can you check them for me? Something doesn't look right..."*
4. Speech bubble completes → 1.5s pause

#### Phase 2: Speak
5. Mic button pulses with green ring, status text: "Tap to speak"
6. User taps mic → status: "Listening..."
7. User says something like: "The battery is in the evidence kit" or "The folder is missing"
8. Waveform visualizer animates during speech
9. Transcript appears: *"I heard: The battery is in the evidence kit"*
10. Johnny responds: *"Good eye! Now show me which item is wrong."*

**Alt path — Text fallback:**
- User types answer in text input below mic
- Same flow continues

**Alt path — Skip speak:**
- After 15s of no input, Johnny says: *"No worries, just tap what looks wrong!"*
- Proceeds to Touch phase

#### Phase 3: Touch
11. SVG scene becomes interactive — items glow softly on hover
12. **Tech Kit** contains: phone, power bank, spare battery
13. **Evidence Kit** contains: folder, USB, signed note
14. One item is wrong (e.g., spare battery is in Evidence kit instead of Tech kit)
15. User taps the wrong item

**Correct tap:**
16. Item glows green, gentle bounce animation
17. Johnny: *"That's it! Nice catch, Detective [Name]!"*
18. Confetti/sparkle overlay for 2 seconds
19. → Transition to Scenario 2

**Wrong tap (attempt 1):**
16. Item does brief shake animation
17. Johnny: *"Hmm, not quite. Take another look at the kits."*
18. User tries again

**Wrong tap (attempt 2) — Hint:**
16. Item shakes
17. Hint overlay appears with Johnny: *"Think about which items belong in the Tech kit vs. the Evidence kit. One of them is in the wrong box."*
18. Incorrect items become slightly dimmed
19. User tries again

**Wrong tap (attempt 3+):**
16. Johnny: *"Let me help — look at this one."*
17. Correct item gets a gentle pulsing highlight
18. User taps highlighted item → success flow

---

## Journey 3: Scenario 2 — Safehouse Kitchen (Leaving Safely)

### Context
Johnny is at the safehouse kitchen, making coffee and a snack before heading out.

### Flow

#### Phase 1: Story
1. Scene crossfades to SVG safehouse kitchen (kettle, pan, toaster, thermos, documents, clock, note)
2. Johnny: *"Quick stop at the safehouse — made some coffee and a bite. I need to head out soon. Before I go, does everything look safe to leave?"*
3. Speech bubble completes → 1.5s pause

#### Phase 2: Speak
4. Mic pulses, user describes hazard
5. Example: "The kettle is still on" or "The thermos is too close to the papers"
6. Johnny: *"Let me see... show me what's off!"*

#### Phase 3: Touch
7. SVG kitchen scene becomes interactive
8. **Objects in scene**: kettle (on/off), pan on stove, toaster, thermos near documents, clock showing time, sticky note with departure time
9. **Possible errors**:
   - Appliance left on for something already done (kettle still on, coffee already made)
   - Hot thermos placed directly on important documents
   - Clock time doesn't match the departure note
10. User taps the hazard

**Correct tap:**
11. Item highlights green, Johnny celebrates
12. *"Phew, good thing you caught that! Could have been a disaster."*
13. → Transition to Scenario 3

**Wrong tap → Hint flow** (same pattern as Scenario 1):
- Attempt 1: Gentle redirect
- Attempt 2: Verbal hint about safety
- Attempt 3+: Visual highlight of correct item

---

## Journey 4: Scenario 3 — Evidence Run Across Town

### Context
Johnny has limited time to pick up an evidence envelope from a print shop and deliver it to the police station.

### Flow — Phase A: Route Selection

#### Phase 1: Story
1. Scene: Simple SVG town map with 3 route lines
2. Johnny: *"I've got 30 minutes to get to the print shop and back to the station. Which route should I take?"*

#### Phase 2: Speak
3. User describes their choice: "Take the direct route" / "Avoid the roadworks"

#### Phase 3: Touch
4. Map shows 3 routes:
   - **Route A**: Direct path (correct — fastest, safest)
   - **Route B**: Scenic detour through park (too long)
   - **Route C**: "Shortcut" through roadworks (risky, unpredictable)
5. User taps a route

**Correct (Route A):**
6. Route highlights green, Johnny: *"Smart choice! Let's go."*
7. → Phase B

**Wrong route:**
6. Route flashes orange, Johnny explains why it's risky
7. User picks again (same hint escalation pattern)

### Flow — Phase B: Street Distractions

#### Phase 1: Story
1. Scene: SVG street with storefronts, signs, people
2. Johnny: *"Almost there, but some things on the way might slow me down. What should I watch out for?"*

#### Phase 2: Speak
3. User identifies distractions

#### Phase 3: Touch
4. **Distractions in scene**:
   - Coffee shop with "Quick Stop!" sign (tempting but wastes time)
   - Misleading shortcut sign pointing down alley
   - Street performer crowd blocking sidewalk
5. User taps distraction(s)
6. Success → Johnny avoids them, moves on to Phase C

### Flow — Phase C: Print Shop Envelope

#### Phase 1: Story
1. Scene: Print shop counter with 3-4 similar envelopes
2. Johnny: *"Here we are. I need the envelope for case #4712. Let me check my note..."*
3. Johnny's note appears: **Case #4712, filed by Officer Martinez**

#### Phase 2: Speak
3. User reads envelope labels, identifies the right one

#### Phase 3: Touch
4. **Envelopes**:
   - Envelope A: Case #4712 — Officer Martinez ✓ (correct)
   - Envelope B: Case #4712 — Officer Martin (wrong name)
   - Envelope C: Case #4721 — Officer Martinez (transposed digits)
   - Envelope D: Case #4712 — Officer Martinez, COPY (wrong — it's a copy)
5. User taps correct envelope

**Correct:**
6. Johnny: *"Perfect match! Let's get this to the station."*
7. → Transition to Summary

---

## Journey 5: Session Summary

### Flow
1. Smooth transition to `/summary`
2. Screen: "Mission Complete!" heading with gentle confetti
3. Stats card:
   - Scenarios completed: X/3
   - Mistakes found: X
   - Hints used: X
   - Simple star rating (1-3 stars, always encouraging)
4. Johnny: *"Great work today, Detective [Name]! Your attention to detail is getting sharper."*
5. Two large buttons:
   - **"Play Again"** → `/play` (resets to Scenario 1)
   - **"Done for Today"** → `/` (returns to welcome)
6. No failure language, no clinical scores — always positive

---

## Hint Escalation Pattern (All Scenarios)

| Attempt | Response |
|---------|----------|
| 1 wrong | Gentle verbal redirect: "Not quite, look again" |
| 2 wrong | Specific hint: NPC describes what to look for |
| 3+ wrong | Visual highlight: correct item pulses softly |

Users are **never penalized** — hints are framed as Johnny thinking out loud together with the user.
