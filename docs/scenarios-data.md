# MindSet — Scenarios Data

All narrative text, interactive elements, error conditions, hints, and success messages for each scenario.

---

## Scenario 1: Mission Control Kits (Home Prep)

### Narrative

> "Alright, I'm heading out on a case today. I need to pack my two kits — Tech and Evidence. Can you check them for me? Something doesn't look right..."

### Scene: Operations Room

**SVG Elements:**

| Element ID | Label | Correct Kit | Visual |
|-----------|-------|-------------|--------|
| `phone` | Mobile Phone | Tech Kit | Smartphone icon |
| `power-bank` | Power Bank | Tech Kit | Rectangular battery pack |
| `spare-battery` | Spare Battery | Tech Kit | Small battery |
| `folder` | Case Folder | Evidence Kit | Manila folder |
| `usb-drive` | USB Drive | Evidence Kit | USB stick |
| `signed-note` | Signed Note | Evidence Kit | Paper with signature |
| `tech-kit-box` | Tech Kit Box | — | Open box labeled "TECH" |
| `evidence-kit-box` | Evidence Kit Box | — | Open box labeled "EVIDENCE" |
| `desk` | Desk Surface | — | Background desk (non-interactive) |
| `lamp` | Desk Lamp | — | Ambient element (non-interactive) |

### Error Configuration (randomized per session)

Pick ONE error type per play:

**Error Type A — Wrong Kit Placement:**
- `spare-battery` appears inside the Evidence Kit box
- Wrong element ID: `spare-battery`
- User must tap the battery in the wrong box

**Error Type B — Duplicate Item:**
- `folder` appears in BOTH kits
- Wrong element ID: `folder-duplicate` (the one in Tech Kit)
- User must tap the duplicate

**Error Type C — Missing Item:**
- `usb-drive` is missing from Evidence Kit, replaced by a second `signed-note`
- Wrong element ID: `signed-note-duplicate`
- User must tap the extra note

### Hint Sequence

| Attempt | Johnny Says |
|---------|------------|
| 1 wrong | *"Hmm, not quite. Take another look at what's in each kit."* |
| 2 wrong | *"Think about which items belong in the Tech kit versus the Evidence kit. One of them seems out of place."* |
| 3+ wrong | *"Let me help — look at this one."* (correct item pulses with green glow) |

### Success Messages

- *"That's it! Nice catch, Detective {name}!"*
- *"Sharp eyes! Johnny's kits are good to go."*
- *"Perfect — every item in its right place now."*

---

## Scenario 2: Safehouse Kitchen (Leaving Safely)

### Narrative

> "Quick stop at the safehouse — made some coffee and a bite to eat. I need to head out soon. Before I go, does everything look safe to leave?"

### Scene: Safehouse Kitchen

**SVG Elements:**

| Element ID | Label | State | Visual |
|-----------|-------|-------|--------|
| `kettle` | Electric Kettle | ON (light glowing) | Kettle with steam / indicator light |
| `pan` | Frying Pan | On stove (off) | Pan on burner, no flame |
| `toaster` | Toaster | Off, bread inside | Toaster with bread visible |
| `thermos` | Hot Thermos | Placed on documents | Thermos sitting on papers |
| `documents` | Important Documents | Under thermos | Stack of papers |
| `coffee-mug` | Coffee Mug | Filled, on counter | Steaming mug |
| `clock` | Wall Clock | Shows 2:45 | Analog clock face |
| `sticky-note` | Departure Note | "Leave by 2:30" | Sticky note on fridge |
| `fridge` | Refrigerator | Closed | Background element |
| `counter` | Kitchen Counter | — | Background surface |
| `stove` | Stove/Cooktop | Off | Background element |
| `window` | Kitchen Window | Open | Window with curtains |

### Error Configuration (randomized per session)

Pick ONE error type per play:

**Error Type A — Appliance Left On:**
- `kettle` is still ON (indicator light glowing) but coffee is already made
- Wrong element ID: `kettle`
- Hazard: electrical/fire risk

**Error Type B — Heat Damage Risk:**
- `thermos` (hot) placed directly on `documents`
- Wrong element ID: `thermos`
- Hazard: heat could damage/stain important papers

**Error Type C — Time Mismatch:**
- `clock` shows 2:45 but `sticky-note` says "Leave by 2:30"
- Wrong element ID: `clock` (Johnny is already late!)
- Issue: time awareness — he should have left 15 minutes ago

### Hint Sequence

| Attempt | Johnny Says |
|---------|------------|
| 1 wrong | *"Close, but that's not the problem. What could go wrong if I leave right now?"* |
| 2 wrong | *"Think about what's still running, or what might get damaged if left like this."* |
| 3+ wrong | *"Here, let me point it out..."* (correct item pulses) |

### Success Messages

- *"Phew, good thing you caught that! Could have been a disaster."*
- *"Crisis averted! The safehouse stays safe thanks to you."*
- *"That's why I need you on my team, Detective {name}!"*

---

## Scenario 3: Evidence Run Across Town (Outside Errand)

### Phase A — Route Selection

#### Narrative

> "I've got 30 minutes to get to the print shop on Baker Street and deliver the envelope to the station. Which route should I take?"

#### SVG Elements: Town Map

| Element ID | Label | Description | Correct? |
|-----------|-------|-------------|----------|
| `route-direct` | Main Road | Direct path, clear traffic | ✅ Yes |
| `route-scenic` | Park Detour | Goes through park, adds 20 min | ❌ Too long |
| `route-shortcut` | Construction Shortcut | Through roadworks, unpredictable | ❌ Risky |
| `print-shop-marker` | Print Shop | Destination marker | Non-interactive |
| `station-marker` | Police Station | End point marker | Non-interactive |
| `clock-display` | Time Remaining | "30 min" display | Non-interactive |

#### Hint Sequence

| Attempt | Johnny Says |
|---------|------------|
| 1 wrong | *"That route might be tricky. Remember, I only have 30 minutes."* |
| 2 wrong | *"I need the most reliable, direct path. No detours, no surprises."* |
| 3+ wrong | Route A pulses green |

#### Success: *"Smart choice! The main road is quickest. Let's go."*

---

### Phase B — Street Distractions

#### Narrative

> "Almost there, but I see some things on the way that could slow me down. What should I watch out for?"

#### SVG Elements: Street Scene

| Element ID | Label | Description | Type |
|-----------|-------|-------------|------|
| `coffee-shop` | "Quick Beans" Café | "STOP IN! 2-min coffee!" sign | ⚠️ Distraction |
| `shortcut-sign` | Alley Sign | "SHORTCUT →" pointing down dark alley | ⚠️ Distraction |
| `street-performer` | Crowd | Group gathered around performer | ⚠️ Distraction |
| `print-shop-door` | Print Shop Entrance | The destination | Non-interactive |
| `pedestrians` | Passersby | People walking | Non-interactive |
| `parked-cars` | Parked Cars | Street parking | Non-interactive |
| `street-signs` | Street Signs | "Baker St" sign | Non-interactive |

User must identify **at least 1** distraction (any of the 3 marked ⚠️).

#### Hint Sequence

| Attempt | Johnny Says |
|---------|------------|
| 1 wrong | *"That's just part of the street. Look for things that might tempt me to stop or go the wrong way."* |
| 2 wrong | *"I'm in a hurry — what on this street could waste my time?"* |
| 3+ wrong | Distraction elements pulse |

#### Success: *"Right! I'll keep my eyes forward and stay on mission."*

---

### Phase C — Print Shop Envelope

#### Narrative

> "Here we are at the print shop. I need the envelope for case #4712, filed by Officer Martinez. Let me check my note..."

**Johnny's Note (displayed in scene):**
```
Case: #4712
Filed by: Officer Martinez
Type: ORIGINAL
```

#### SVG Elements: Print Shop Counter

| Element ID | Label | Case # | Officer | Detail | Correct? |
|-----------|-------|--------|---------|--------|----------|
| `envelope-a` | Envelope A | #4712 | Martinez | ORIGINAL | ✅ Yes |
| `envelope-b` | Envelope B | #4712 | Martin | ORIGINAL | ❌ Wrong name |
| `envelope-c` | Envelope C | #4721 | Martinez | ORIGINAL | ❌ Transposed digits |
| `envelope-d` | Envelope D | #4712 | Martinez | COPY | ❌ It's a copy |
| `johnnys-note` | Johnny's Note | — | — | Reference card | Non-interactive |
| `counter-surface` | Counter | — | — | Background | Non-interactive |
| `shop-clerk` | Clerk | — | — | Ambient NPC | Non-interactive |

#### Hint Sequence

| Attempt | Johnny Says |
|---------|------------|
| 1 wrong | *"Careful — check every detail. The case number, the name, everything."* |
| 2 wrong | *"Compare each envelope to my note. One detail is always off on the wrong ones."* |
| 3+ wrong | Correct envelope pulses green |

#### Success Messages

- *"Perfect match! That's the one. Let's get this to the station."*
- *"Case #4712, Officer Martinez, original copy. Spot on!"*
- *"You've got a detective's eye, {name}!"*

---

## Star Rating Logic (Summary Screen)

| Condition | Stars |
|-----------|-------|
| All 3 scenarios, 0 hints | ⭐⭐⭐ "Master Detective!" |
| All 3 scenarios, 1-3 hints | ⭐⭐ "Sharp Investigator!" |
| All 3 scenarios, 4+ hints | ⭐ "Good Work, Rookie!" |

**Note:** All ratings are encouraging. No negative language. Even 1 star says "Good Work."
