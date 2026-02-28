

## Create Planning Documentation Files

### Files to Create

1. **`docs/plan-overview.md`** — High-level project overview, design system, and tech stack
2. **`docs/user-journeys.md`** — Complete user journey flows for all 3 scenarios with step-by-step interactions
3. **`docs/pages-and-components.md`** — Detailed page layouts, component hierarchy, and props/states
4. **`docs/scenarios-data.md`** — All 3 scenario narratives, wrong elements, hints, and success messages from the MindSet document
5. **`docs/voice-ui-architecture.md`** — Voice UI hook design, Gemini Live API integration plan, and mock mode specs

### Content Coverage

Each file will include:
- **Overview doc**: Design tokens (colors, fonts, spacing), accessibility requirements, routing structure
- **User journeys**: Welcome → Scenario 1 (Mission Kits) → Scenario 2 (Safehouse Kitchen) → Scenario 3 (Evidence Run) → Summary, with branching paths for hints/retries
- **Pages doc**: Layout zones per page, component tree, interaction states, animations
- **Scenarios doc**: Full narrative text, SVG element lists, wrong element IDs, hint sequences, celebration messages
- **Voice doc**: `useVoiceSession` hook interface, state machine, Gemini WebSocket integration points

