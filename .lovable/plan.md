

## Plan: Add 5 Scenario Cards on Home Screen with Selection

### 1. Add 2 new scenarios to `src/data/scenarios.ts`

Currently there are 3 scenarios. Add 2 more:

**Scenario 4: "Witness Interview Room"** — Johnny is reviewing witness statements before an interview. One statement has inconsistent details (wrong date, mismatched description, or contradicting alibi). Single phase, randomized error type.

**Scenario 5: "Parking Lot Surveillance"** — Johnny is reviewing security camera footage of a parking lot. He needs to spot which car doesn't match the suspect vehicle description. Single phase, randomized error type (wrong color, wrong plate format, wrong car model).

Also add metadata to the `Scenario` interface: `description`, `icon` (emoji), `difficulty` (1-3), and `phaseCount`.

### 2. Update `src/pages/Index.tsx` — Add scenario selection grid

Below the profile card and above the CTA, add a "Choose Your Mission" section with 5 scenario cards in a scrollable list. Each card shows:
- Emoji icon + title
- Short description
- Difficulty badge (Easy/Medium/Hard)
- Phase count
- Locked/unlocked state (all unlocked for now)

Tapping a card selects it (highlighted border). The CTA button updates to "Start: [Selected Mission]".

### 3. Update routing to pass selected scenario

- Store selected scenario ID in localStorage or pass via route state to `/play`
- Update `/play` route to `/play?scenario=3` or use navigation state

### 4. Update `src/hooks/useGameState.ts`

- Accept an optional `scenarioId` parameter
- Filter `scenarios` to only play the selected scenario (instead of all 3 sequentially)
- Game completes after the selected scenario's phases finish

### 5. Update `src/pages/Play.tsx`

- Read selected scenario from route state/search params
- Pass it to `useGameState`

### Files to change:
- `src/data/scenarios.ts` — Add 2 scenarios + metadata fields
- `src/pages/Index.tsx` — Scenario selection UI
- `src/hooks/useGameState.ts` — Accept scenario filter
- `src/pages/Play.tsx` — Read selected scenario
- `src/App.tsx` — No changes needed

