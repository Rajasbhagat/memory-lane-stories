# MindSet — Pages & Components

---

## Page 1: Welcome Screen (`/`)

### Layout
- **Full viewport**, centered content
- Warm cream background (`--background`)
- Max width: 480px, centered horizontally

### Layout Zones (top to bottom)
1. **Hero Illustration** (20% height) — Friendly detective/magnifying glass icon (SVG)
2. **Title** — "Welcome to MindSet!" or "Welcome back, [Name]!" (32px, bold)
3. **Subtitle** — "Help Detective Johnny spot the mistakes" (22px, muted)
4. **Name Input** (optional) — "What should I call you?" label + large input field
5. **CTA Button** — "Start Today's Mission" (coral, 56px height, full-round)
6. **Session indicator** — "Session #X" in muted text (bottom)

### Component Tree
```
<WelcomeScreen>
  <HeroIllustration />          — SVG detective icon
  <h1>Welcome to MindSet!</h1>
  <p>subtitle</p>
  <NameInput                    — controlled input, saves to localStorage
    value={name}
    onChange={setName}
  />
  <StartButton                  — navigates to /play
    onClick={() => navigate('/play')}
  />
  <SessionIndicator count={n} />
</WelcomeScreen>
```

### States
- **First visit**: Empty name input, generic greeting
- **Returning**: Pre-filled name, personalized greeting

### Animations
- Page fade-in on mount (300ms)
- Button: scale 1.05 on hover, 0.95 on press
- Transition out: fade + slight upward slide (400ms)

---

## Page 2: Game Screen (`/play`)

### Layout
- **Full viewport**, no scroll (content fits screen)
- 3 vertical zones

### Zone A — NPC Companion (top, ~15-20% height)
```
┌──────────────────────────────────────┐
│ [Avatar]  "Speech bubble text..."    │
│   🟢       with typing animation     │
└──────────────────────────────────────┘
```

- **Left**: Round avatar (64px) of Johnny — SVG illustration
- **Right**: Speech bubble with narrative text
- Background: `--card` with soft shadow
- Border-radius: 16px
- Padding: 16px 20px

### Zone B — Interactive Scene (center, ~50-55% height)
```
┌──────────────────────────────────────┐
│                                      │
│         [SVG Scene Area]             │
│    Interactive elements with         │
│    hover glow + tap feedback         │
│                                      │
└──────────────────────────────────────┘
```

- Full-width SVG, aspect ratio maintained
- Each clickable element is an SVG `<g>` group
- Hover: soft green outline glow (2px, sage)
- Tap correct: green highlight + bounce
- Tap wrong: brief shake (150ms) + red flash

### Zone C — Voice Controls (bottom, ~25-30% height)
```
┌──────────────────────────────────────┐
│        [Status: "Tap to speak"]      │
│                                      │
│            [ 🎤 MIC ]               │
│         (64px, pulsing ring)         │
│                                      │
│   ════════════════════════           │
│        (waveform visualizer)         │
│                                      │
│   [Type your answer here...]         │
└──────────────────────────────────────┘
```

- Mic button: 64px circle, sage green bg, white icon
- Pulse ring when listening (CSS animation)
- Waveform: horizontal bar with animated segments
- Text input: always visible, full width, 48px height

### Component Tree
```
<GameScreen>
  <NPCCompanion
    avatarSrc={johnny.svg}
    text={currentNarrative}
    isTyping={boolean}
    mood={"neutral" | "happy" | "thinking"}
  />
  
  <SceneContainer scenario={currentScenario}>
    {scenario === 1 && <OperationsRoomScene ... />}
    {scenario === 2 && <SafehouseKitchenScene ... />}
    {scenario === 3 && <EvidenceRunScene phase={phase} ... />}
  </SceneContainer>
  
  <VoiceControls
    state={"idle" | "listening" | "processing" | "speaking"}
    transcript={string}
    onStartListening={fn}
    onStopListening={fn}
    onTextSubmit={fn}
  />
  
  <HintOverlay
    isVisible={boolean}
    hintText={string}
    onDismiss={fn}
  />
  
  <CelebrationOverlay
    isVisible={boolean}
    message={string}
    onComplete={fn}
  />
</GameScreen>
```

### States per Scenario
| State | NPC | Scene | Voice |
|-------|-----|-------|-------|
| `story` | Typing narrative | Static, non-interactive | Hidden/disabled |
| `speak` | Waiting | Static, non-interactive | Active (mic pulsing) |
| `touch` | "Show me!" | Interactive (glows on hover) | Disabled |
| `hint` | Showing hint text | Partially dimmed | Disabled |
| `celebrate` | "Great job!" | Correct item highlighted | Disabled |
| `transition` | — | Crossfade to next | — |

---

## Page 3: Session Summary (`/summary`)

### Layout
- Centered card on cream background
- Max width: 480px

### Layout Zones
1. **Heading**: "Mission Complete!" (32px, bold, sage green)
2. **Confetti animation** (subtle, 3 seconds)
3. **Stats Card** (card bg, rounded 16px, shadow):
   - Scenarios completed: X/3
   - Mistakes spotted: X
   - Hints used: X
   - Star rating: ⭐⭐⭐ (1-3, always encouraging)
4. **Johnny's message**: Speech bubble with wrap-up
5. **Action buttons** (stacked, full width):
   - "Play Again" (coral, primary)
   - "Done for Today" (muted, secondary)

### Component Tree
```
<SessionSummary>
  <h1>Mission Complete!</h1>
  <ConfettiEffect duration={3000} />
  <StatsCard
    completed={number}
    total={3}
    hintsUsed={number}
    stars={1|2|3}
  />
  <NPCCompanion
    text="Great work today, Detective!"
    mood="happy"
  />
  <Button variant="accent" onClick={replay}>Play Again</Button>
  <Button variant="muted" onClick={goHome}>Done for Today</Button>
</SessionSummary>
```

---

## Shared Components

### `NPCCompanion`
| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Current speech text |
| `isTyping` | `boolean` | Show typing animation |
| `mood` | `"neutral" \| "happy" \| "thinking"` | Avatar expression variant |
| `avatarSrc` | `string` | SVG source for avatar |

### `VoiceControls`
| Prop | Type | Description |
|------|------|-------------|
| `state` | `VoiceState` | Current voice UI state |
| `transcript` | `string \| null` | Last recognized text |
| `onStartListening` | `() => void` | Start recording |
| `onStopListening` | `() => void` | Stop recording |
| `onTextSubmit` | `(text: string) => void` | Text fallback submit |

### `HintOverlay`
| Prop | Type | Description |
|------|------|-------------|
| `isVisible` | `boolean` | Show/hide overlay |
| `hintText` | `string` | Hint message from NPC |
| `onDismiss` | `() => void` | Close hint |

### `CelebrationOverlay`
| Prop | Type | Description |
|------|------|-------------|
| `isVisible` | `boolean` | Show/hide celebration |
| `message` | `string` | Success message |
| `onComplete` | `() => void` | After animation ends |

---

## Scene Components

### `OperationsRoomScene` (Scenario 1)
- SVG desk with two labeled kit boxes
- 6 draggable/tappable items (phone, power bank, battery, folder, USB, note)
- Props: `onElementTap(elementId: string)`, `highlightedElement?: string`, `incorrectElements?: string[]`

### `SafehouseKitchenScene` (Scenario 2)
- SVG kitchen with appliances, documents, clock
- ~8 tappable objects
- Props: same pattern as above

### `EvidenceRunScene` (Scenario 3)
- 3 internal phases with different SVG layouts
- Props: `phase: "route" | "street" | "printshop"`, plus same tap/highlight props
- Phase A: Map with 3 clickable routes
- Phase B: Street with clickable distraction elements
- Phase C: Counter with 4 clickable envelopes
