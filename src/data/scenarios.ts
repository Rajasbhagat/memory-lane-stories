export interface ScenarioElement {
  id: string;
  label: string;
  isWrong: boolean;
  hint: string;
  detail?: string; // extra info for envelope matching etc.
}

export interface HintTier {
  attempt1: string;
  attempt2: string;
  attempt3: string; // "auto-highlight" tier
}

export interface ScenarioPhase {
  id: string;
  narrative: string;
  prompt: string;
  elements: ScenarioElement[];
  successMessage: string;
  hints: HintTier;
}

export interface Scenario {
  id: number;
  title: string;
  setting: string;
  phases: ScenarioPhase[];
}

// Randomize error type for scenario 1
function buildScenario1Phase(): ScenarioPhase {
  const errorTypes = ["wrong-placement", "duplicate", "missing-item"] as const;
  const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

  const baseElements: ScenarioElement[] = [
    { id: "phone", label: "Mobile Phone", isWrong: false, hint: "The phone belongs in the Tech Kit." },
    { id: "power-bank", label: "Power Bank", isWrong: false, hint: "Power bank is correct in the Tech Kit." },
    { id: "folder", label: "Case Folder", isWrong: false, hint: "The folder belongs in the Evidence Kit." },
    { id: "usb-drive", label: "USB Drive", isWrong: false, hint: "USB drive is correct in the Evidence Kit." },
    { id: "signed-note", label: "Signed Note", isWrong: false, hint: "The signed note belongs in the Evidence Kit." },
  ];

  if (errorType === "wrong-placement") {
    baseElements.push({
      id: "spare-battery",
      label: "Spare Battery (in Evidence Kit)",
      isWrong: true,
      hint: "That battery is in the wrong kit — it belongs with the Tech gear!",
    });
  } else if (errorType === "duplicate") {
    baseElements.push({
      id: "folder-duplicate",
      label: "Case Folder (in Tech Kit)",
      isWrong: true,
      hint: "There's a duplicate folder! This one shouldn't be in the Tech Kit.",
    });
  } else {
    // missing-item: extra signed note replaces USB
    baseElements.push({
      id: "signed-note-duplicate",
      label: "Extra Signed Note",
      isWrong: true,
      hint: "Wait — there's an extra note here. Something else should be in its place!",
    });
  }

  return {
    id: "kit-audit",
    narrative:
      "Alright, I'm heading out on a case today. I need to pack my two kits — Tech and Evidence. Can you check them for me? Something doesn't look right...",
    prompt: "What looks wrong with the kits?",
    elements: baseElements,
    successMessage: "That's it! Nice catch, Detective!",
    hints: {
      attempt1: "Hmm, not quite. Take another look at what's in each kit.",
      attempt2: "Think about which items belong in the Tech kit versus the Evidence kit. One of them seems out of place.",
      attempt3: "Let me help — look at this one.",
    },
  };
}

// Randomize error type for scenario 2
function buildScenario2Phase(): ScenarioPhase {
  const errorTypes = ["appliance-on", "heat-damage", "time-mismatch"] as const;
  const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

  const baseElements: ScenarioElement[] = [
    { id: "toaster", label: "Toaster", isWrong: false, hint: "The toaster is off — all good." },
    { id: "pan-on-stove", label: "Frying Pan", isWrong: false, hint: "The pan is on the stove but the burner is off." },
    { id: "coffee-mug", label: "Coffee Mug", isWrong: false, hint: "The coffee mug is just sitting on the counter." },
    { id: "window", label: "Window", isWrong: false, hint: "The window is fine." },
    { id: "fridge", label: "Refrigerator", isWrong: false, hint: "The fridge is closed — nothing wrong there." },
  ];

  if (errorType === "appliance-on") {
    baseElements.push(
      { id: "kettle", label: "Electric Kettle (ON)", isWrong: true, hint: "The kettle is still on! That could be dangerous to leave unattended." },
      { id: "thermos", label: "Thermos", isWrong: false, hint: "The thermos is safely on the counter." },
      { id: "clock", label: "Wall Clock", isWrong: false, hint: "The clock is just telling the time." },
    );
  } else if (errorType === "heat-damage") {
    baseElements.push(
      { id: "kettle", label: "Electric Kettle", isWrong: false, hint: "The kettle is turned off." },
      { id: "thermos", label: "Hot Thermos (on documents)", isWrong: true, hint: "That hot thermos is sitting right on important documents — they could get damaged!" },
      { id: "documents", label: "Documents", isWrong: false, hint: "The documents themselves are fine, but check what's on top of them." },
    );
  } else {
    baseElements.push(
      { id: "kettle", label: "Electric Kettle", isWrong: false, hint: "The kettle is turned off." },
      { id: "clock", label: "Wall Clock (2:45)", isWrong: true, hint: "Look at the time! The note says 'Leave by 2:30' — Johnny is already 15 minutes late!" },
      { id: "sticky-note", label: "Note: 'Leave by 2:30'", isWrong: false, hint: "The note is a clue — compare it to the clock!" },
    );
  }

  return {
    id: "kitchen-check",
    narrative:
      "Quick stop at the safehouse — made some coffee and a bite to eat. I need to head out soon. Before I go, does everything look safe to leave?",
    prompt: "What's not safe in the kitchen?",
    elements: baseElements,
    successMessage: "Phew, good thing you caught that! Could have been a disaster.",
    hints: {
      attempt1: "Close, but that's not the problem. What could go wrong if I leave right now?",
      attempt2: "Think about what's still running, or what might get damaged if left like this.",
      attempt3: "Here, let me point it out...",
    },
  };
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Mission Control Kits",
    setting: "operations-room",
    phases: [buildScenario1Phase()],
  },
  {
    id: 2,
    title: "Safehouse Kitchen",
    setting: "safehouse-kitchen",
    phases: [buildScenario2Phase()],
  },
  {
    id: 3,
    title: "Evidence Run Across Town",
    setting: "evidence-run",
    phases: [
      {
        id: "route-selection",
        narrative:
          "I've got 30 minutes to get to the print shop on Baker Street and deliver the envelope to the station. Which route should I take?",
        prompt: "Which route is the safest and quickest?",
        elements: [
          { id: "route-direct", label: "Main Road (Direct)", isWrong: false, hint: "The main road is direct and clear — good choice!" },
          { id: "route-scenic", label: "Park Detour", isWrong: true, hint: "The park route adds 20 minutes — too long when we only have 30!" },
          { id: "route-shortcut", label: "Construction Shortcut", isWrong: true, hint: "That shortcut goes through roadworks — too unpredictable." },
        ],
        successMessage: "Smart choice! The main road is quickest. Let's go.",
        hints: {
          attempt1: "That route might be tricky. Remember, I only have 30 minutes.",
          attempt2: "I need the most reliable, direct path. No detours, no surprises.",
          attempt3: "The main road is the answer — look!",
        },
      },
      {
        id: "street-distractions",
        narrative:
          "Almost there, but I see some things on the way that could slow me down. What should I watch out for?",
        prompt: "What could distract us?",
        elements: [
          { id: "coffee-shop", label: "Quick Beans Café", isWrong: true, hint: "That coffee shop smells great, but we can't stop now!" },
          { id: "shortcut-sign", label: "Alley Shortcut Sign", isWrong: true, hint: "That sign says 'shortcut' but it leads through a dark alley — not safe." },
          { id: "street-performer", label: "Street Performer Crowd", isWrong: true, hint: "That crowd could slow us down — stay focused!" },
          { id: "print-shop-door", label: "Print Shop Entrance", isWrong: false, hint: "That's our destination — nothing wrong there!" },
          { id: "pedestrians", label: "Passersby", isWrong: false, hint: "Just people walking — no distraction there." },
          { id: "street-signs", label: "Baker St Sign", isWrong: false, hint: "Just a street sign — helpful actually." },
        ],
        successMessage: "Right! I'll keep my eyes forward and stay on mission.",
        hints: {
          attempt1: "That's just part of the street. Look for things that might tempt me to stop or go the wrong way.",
          attempt2: "I'm in a hurry — what on this street could waste my time?",
          attempt3: "Look at the distractions!",
        },
      },
      {
        id: "print-shop",
        narrative:
          "Here we are at the print shop. I need the envelope for case #4712, filed by Officer Martinez. Let me check my note...",
        prompt: "Which envelope matches our case?",
        elements: [
          { id: "envelope-a", label: "Envelope A", isWrong: false, hint: "#4712, Martinez, ORIGINAL — that's the one!", detail: "#4712 · Martinez · ORIGINAL" },
          { id: "envelope-b", label: "Envelope B", isWrong: true, hint: "Check the officer name — that says 'Martin', not 'Martinez'.", detail: "#4712 · Martin · ORIGINAL" },
          { id: "envelope-c", label: "Envelope C", isWrong: true, hint: "Look at the case number carefully — the digits are transposed!", detail: "#4721 · Martinez · ORIGINAL" },
          { id: "envelope-d", label: "Envelope D", isWrong: true, hint: "That's a COPY, not an ORIGINAL.", detail: "#4712 · Martinez · COPY" },
        ],
        successMessage: "Perfect match! Case #4712, Officer Martinez, original copy. Spot on!",
        hints: {
          attempt1: "Careful — check every detail. The case number, the name, everything.",
          attempt2: "Compare each envelope to my note. One detail is always off on the wrong ones.",
          attempt3: "The correct envelope is right there!",
        },
      },
    ],
  },
];
