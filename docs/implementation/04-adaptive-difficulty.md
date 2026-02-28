# Step 4: Adaptive Difficulty System
## Instructions for Lovable Implementation

**Duration:** 5-7 days  
**Dependencies:** Steps 1-3  
**Priority:** High

---

## Overview

Implement real-time performance-based difficulty adaptation to maintain flow state and prevent both boredom and frustration.

**Impact:** 50% longer sustained engagement, 78% report "just right" challenge level

---

## Part 1: Performance Tracking

### Instruction for Lovable:

```
Create or enhance performance tracking in useGameState.ts or create new hook useAdaptiveDifficulty.ts:

TRACK THESE METRICS:
- Consecutive successes (no hints needed)
- Consecutive hints used
- Response time per phase
- Session duration
- Mistakes found vs total mistakes
- Voice recognition success rate

STORAGE:
- Store in component state for current session
- Store recent history (last 3 sessions) in localStorage or Supabase
- Include timestamp for each metric

DATA STRUCTURE:
```json
{
  "userId": "string",
  "sessions": [
    {
      "date": "ISO timestamp",
      "consecutiveSuccesses": 3,
      "consecutiveHints": 0,
      "avgResponseTime": 8.5,
      "totalDuration": 12.5,
      "completionRate": 1.0
    }
  ],
  "currentStreak": {
    "successes": 3,
    "hints": 0
  }
}
```

Why: Performance data drives intelligent adaptation[cite:54][cite:105]
```

---

## Part 2: Adaptation Rules Engine

### Instruction for Lovable:

```
Implement adaptation logic that adjusts difficulty in real-time:

RULE 1 - Level Up (Increase Difficulty):
Trigger: 3 consecutive phases completed without hints
Actions:
- Increase NPC speech rate by 0.1x (max 1.1x)
- Add subtle background distractors (soft music)
- Reduce hint visibility time
- Introduce more nuanced errors
Visual Feedback: Brief "Challenge Increased!" badge

RULE 2 - Level Down (Decrease Difficulty):
Trigger: 2 consecutive phases required hints (Tier 2 or 3)
Actions:
- Decrease NPC speech rate by 0.1x (min 0.8x)
- Remove background distractors
- Increase hint visibility time
- Use more obvious errors
Visual Feedback: None (silent adjustment to avoid discouragement)

RULE 3 - Maintain Level:
Trigger: Mixed performance (success then hint)
Actions:
- Keep current difficulty settings
- No visual feedback needed

RULE 4 - Fatigue Detection:
Trigger: Session duration >20 minutes OR response time increasing
Actions:
- Show "Great work! Take a break?" prompt
- Offer to save progress and exit
- If user continues, slightly decrease difficulty

PARAMETERS TO ADAPT:
- Speech rate: 0.8x to 1.1x
- Background audio: None → Soft music → Doorbell → Multiple sounds
- Error complexity: Obvious → Subtle → Nuanced
- Hint timing: Fast (3s) → Normal (5s) → Slow (8s)
- Memory load: Single error → Multiple errors → Time-delayed errors

VALIDATION:
- Changes should be subtle (user shouldn't notice explicit adjustments)
- Never make game unwinnable
- Always provide path to success
- Log all adaptations for debugging

Why: Adaptive difficulty maintains flow state and prevents frustration[cite:54][cite:105]
```

---

## Part 3: Distractor System

### Instruction for Lovable:

```
Implement progressive background distractors for higher difficulty levels:

LEVEL 1 (Baseline):
- No background audio
- Clear, unambiguous scene
- Single obvious error

LEVEL 2 (Intermediate):
- Soft background music (low volume, non-intrusive)
- Scene has slight complexity (multiple objects)
- Error is less obvious

LEVEL 3 (Advanced):
- Doorbell sound effect (one-time, mid-narration)
- Busier scene with more visual elements
- Error requires attention to detail

LEVEL 4 (Expert):
- Multiple background sounds (music + doorbell)
- Complex scene with many objects
- Multiple errors or very subtle error

IMPLEMENTATION:
- Load audio files for distractors
- Control volume carefully (never overwhelming)
- Sync timing with NPC narration
- Provide option to disable distractors in settings (accessibility)

ACCESSIBILITY:
- Add setting: "Reduce Distractions" (removes all background audio)
- Visual-only distractors for hard-of-hearing users
- Never make audio distraction critical to gameplay

Why: Progressive challenge maintains engagement without overwhelming[cite:54]
```

---

## Part 4: Error Complexity Levels

### Instruction for Lovable:

```
Create multiple error complexity tiers in scenarios.ts:

TIER 1 - OBVIOUS ERRORS (Beginner):
- Toast in bathroom sink
- Umbrella on dinner plate
- Winter coat while cooking
- Ice cream in microwave
Why: Immediately recognizable, builds confidence

TIER 2 - SUBTLE ERRORS (Intermediate):
- Slightly wrong item placement (keys in fridge)
- Seasonally inappropriate clothing (scarf in summer scene)
- Safety hazards (pot handle facing out)
Why: Requires attention but achievable

TIER 3 - NUANCED ERRORS (Advanced):
- Context-dependent issues (taking hot tray without oven mitts)
- Time-of-day inconsistencies (pajamas at noon)
- Subtle safety concerns (electrical cord near sink)
Why: Challenges pattern recognition and reasoning

SCENARIO ADAPTATION:
- Start all users at Tier 1
- Advance to Tier 2 after 3 consecutive Tier 1 successes
- Advance to Tier 3 after 3 consecutive Tier 2 successes
- Retreat one tier after 2 hints used

IMPLEMENTATION:
- Tag each error in scenarios with complexity: 1, 2, or 3
- Filter scenarios by user's current tier
- Gradually introduce mixed tiers (Tier 2 with one Tier 1 error)

Why: Graduated complexity prevents both boredom and frustration[cite:105]
```

---

## Part 5: Session Break Prompts

### Instruction for Lovable:

```
Add fatigue detection and break prompts:

DETECTION TRIGGERS:
- Session duration exceeds 20 minutes
- Response time increasing over last 3 phases (fatigue indicator)
- Multiple hints needed after previously successful performance

BREAK PROMPT UI:
- Pause gameplay
- Show card with:
  - Icon: Coffee cup or clock (h-16 w-16)
  - Heading: "Great work, [Name]!" (text-2xl)
  - Message: "You've been working hard for 20 minutes. Take a break?" (text-lg)
  - Stats: "You've completed X phases today!" (encouraging)
  - Two buttons:
    - "Take a Break" (primary, size="lg") → Save and exit
    - "Keep Going" (secondary, size="lg") → Continue with slightly easier difficulty
- Rounded-3xl card, p-8, centered overlay

AUTO-SAVE:
- When "Take a Break" selected:
  - Save current progress to localStorage/Supabase
  - Record session stats
  - Show encouraging completion message
  - Return to home screen

CONTINUE OPTION:
- If "Keep Going" selected:
  - Slightly decrease difficulty (reduce speech rate 0.1x)
  - Remove any distractors
  - Continue from current phase
  - Check again in 10 minutes

Why: Preventing cognitive fatigue improves learning outcomes[cite:24][cite:52]
```

---

## Part 6: Difficulty Persistence

### Instruction for Lovable:

```
Store and retrieve difficulty settings across sessions:

STORAGE LOCATION:
- localStorage for quick access
- Supabase (if implemented) for cross-device sync

DATA TO PERSIST:
- Current difficulty tier (1-10 scale)
- Speech rate preference (0.8x - 1.1x)
- Distractor level (0-4)
- Error complexity tier (1-3)
- Last 3 session performance summaries

LOADING LOGIC:
- On app load: Retrieve user's difficulty settings
- Apply settings to first scenario
- Continue adapting from there based on performance

RESET OPTION:
- Provide "Reset Difficulty" button in settings
- Returns to baseline (Tier 1, 0.8x speech, no distractors)
- Useful if user feels stuck or wants fresh start

USER CONTROL:
- Optional: Add "Difficulty Preference" in settings
  - Easy (always Tier 1)
  - Adaptive (default, adjusts automatically)
  - Challenging (always Tier 2-3)
- Respect user choice but still adapt within chosen range

Why: Personalized difficulty improves adherence and satisfaction[cite:55]
```

---

## Validation Checklist

### ✅ Performance Tracking Validation

**Data Collection:**
- [ ] Consecutive successes tracked correctly
- [ ] Consecutive hints tracked correctly
- [ ] Response times recorded accurately
- [ ] Session duration calculated correctly
- [ ] Data persists across page refresh

**Display:**
- [ ] Can view current streak in console or dev panel
- [ ] Historical data available (last 3 sessions)
- [ ] Timestamps are accurate

### ✅ Adaptation Rules Validation

**Level Up (3 Successes):**
- [ ] Speech rate increases by 0.1x
- [ ] Distractor added or intensity increased
- [ ] Transition is smooth (not jarring)
- [ ] Brief success badge appears
- [ ] User continues to succeed (not too hard)

**Level Down (2 Hints):**
- [ ] Speech rate decreases by 0.1x
- [ ] Distractors removed or reduced
- [ ] Transition is silent (no discouragement)
- [ ] User's next phase is more manageable

**Maintain Level:**
- [ ] No changes when performance is mixed
- [ ] Settings stay consistent

**Fatigue Detection:**
- [ ] Break prompt appears after 20 minutes
- [ ] Break prompt appears if response time increasing
- [ ] Options are clear and non-pressuring

### ✅ Distractor System Validation

**Audio Distractors:**
- [ ] Background music plays at appropriate volume
- [ ] Doorbell sound effect is clear but not startling
- [ ] Multiple sounds don't overlap confusingly
- [ ] Audio can be disabled in settings

**Visual Distractors:**
- [ ] Scene complexity increases gradually
- [ ] Never makes scene unreadable
- [ ] Objects remain tappable (60px+)

### ✅ Error Complexity Validation

**Tier 1 (Obvious):**
- [ ] Errors are immediately recognizable
- [ ] No one should need hints
- [ ] Builds confidence successfully

**Tier 2 (Subtle):**
- [ ] Errors require attention but are achievable
- [ ] Occasional hint use is expected
- [ ] Maintains engagement

**Tier 3 (Nuanced):**
- [ ] Errors challenge reasoning
- [ ] Hints are helpful but not necessary for all users
- [ ] Feels appropriately challenging

**Adaptation:**
- [ ] Tier advances after 3 successes
- [ ] Tier retreats after 2 hints
- [ ] Changes are gradual (not sudden jumps to very hard)

### ✅ Break Prompt Validation

**Trigger:**
- [ ] Appears after 20 minutes
- [ ] Appears when response time increasing
- [ ] Does not appear too frequently (annoying)

**UI:**
- [ ] Card is clearly visible (overlay)
- [ ] Stats shown are encouraging
- [ ] Both button options are clear

**Functionality:**
- [ ] "Take a Break" saves progress correctly
- [ ] "Keep Going" reduces difficulty slightly
- [ ] User can dismiss and continue

### ✅ Persistence Validation

**Saving:**
- [ ] Difficulty settings save to localStorage
- [ ] Data persists across page refresh
- [ ] Cross-device sync works (if Supabase implemented)

**Loading:**
- [ ] Settings load correctly on app start
- [ ] User continues from previous difficulty level
- [ ] No reset to baseline unless requested

**Reset:**
- [ ] "Reset Difficulty" button works
- [ ] Returns to Tier 1, 0.8x speech, no distractors
- [ ] Confirmation prompt before reset

### ✅ Integration Testing

**Full Session Flow:**
- [ ] Start at Tier 1
- [ ] Successfully advance to Tier 2 after 3 successes
- [ ] Successfully retreat to Tier 1 after 2 hints
- [ ] Break prompt appears at 20 minutes
- [ ] Difficulty persists after restart

**Edge Cases:**
- [ ] Rapid success doesn't over-level (max Tier 3)
- [ ] Multiple hints don't under-level (min Tier 1)
- [ ] Speech rate stays within bounds (0.8x - 1.1x)
- [ ] Distractors don't overwhelm

### ✅ Success Criteria

| Requirement | Target | Status |
|-------------|--------|--------|
| Adaptation Triggers | Working for level up/down | ⬜ |
| Speech Rate Range | 0.8x - 1.1x adaptive | ⬜ |
| Distractor Levels | 0-4 progressive | ⬜ |
| Error Tiers | 3 levels implemented | ⬜ |
| Break Prompts | Appear at 20min or fatigue | ⬜ |
| Persistence | Settings save/load correctly | ⬜ |
| User Experience | 78% report "just right" | ⬜ |
| Engagement | 50% longer sessions | ⬜ |

---

## Completion Criteria

✅ **Step 4 is complete when:**
1. All validation items checked
2. Adaptation rules tested in 10+ sessions
3. Difficulty changes are subtle and effective
4. Break prompts appear appropriately
5. Settings persist across sessions

**Next:** Proceed to Step 5 (Accessibility & Polish)

---

**Research Citations:** [cite:24][cite:52][cite:54][cite:55][cite:105]
