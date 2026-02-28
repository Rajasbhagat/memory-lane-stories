export interface ScenarioElement {
  id: string;
  label: string;
  isWrong: boolean;
  hint: string;
  detail?: string;
}

export interface HintTier {
  attempt1: string;
  attempt2: string;
  attempt3: string;
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
  description: string;
  icon: string;
  difficulty: 1 | 2 | 3;
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
      `Alright partner, listen carefully. I've got a big case today — a surveillance operation across town. Before I head out, I need to make sure my two field kits are packed properly. The Tech Kit should have all my electronic gear: my phone, the power bank, and a spare battery. The Evidence Kit needs the case folder, the USB drive with the witness interview, and a signed authorization note from the captain. I laid everything out on my desk this morning, but I was in a rush and I think I may have mixed something up. Take a good look at each item and tell me — does anything seem out of place? Remember, every item needs to be in the right kit, nothing should be doubled, and nothing should be missing.`,
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
      `Okay, I just stopped by the safehouse to grab a quick bite and some coffee before my afternoon shift. I made myself some eggs in the frying pan, boiled water in the kettle for tea, and poured some into my thermos for the road. I also left some important case documents on the counter — they're the witness statements I need to review later. Now, I'm about to head out the door, but before I leave, I need you to look around the kitchen carefully. Is there anything that could be dangerous or cause a problem if I just walk out right now? Think about fire risks, heat damage, and anything time-sensitive. Take your time and look at everything.`,
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

// Randomize error type for scenario 4
function buildScenario4Phase(): ScenarioPhase {
  const errorTypes = ["wrong-date", "wrong-description", "contradicting-alibi"] as const;
  const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

  const baseElements: ScenarioElement[] = [
    { id: "statement-header", label: "Case Header", isWrong: false, hint: "The case header looks correct." },
    { id: "witness-name", label: "Witness: Maria Santos", isWrong: false, hint: "The witness name matches our records." },
    { id: "officer-signature", label: "Officer Signature", isWrong: false, hint: "The officer's signature is valid." },
  ];

  if (errorType === "wrong-date") {
    baseElements.push(
      { id: "incident-date", label: "Incident Date: March 15", isWrong: true, hint: "Wait — the incident happened on March 17, not March 15! The date is wrong." },
      { id: "location-field", label: "Location: 5th & Main", isWrong: false, hint: "The location matches the police report." },
      { id: "time-field", label: "Time: 9:30 PM", isWrong: false, hint: "The time is consistent with other statements." },
    );
  } else if (errorType === "wrong-description") {
    baseElements.push(
      { id: "suspect-height", label: "Suspect: 5'6\", brown jacket", isWrong: true, hint: "The other witnesses said the suspect was 6'1\" and wore a black jacket — this description doesn't match!" },
      { id: "incident-date", label: "Incident Date: March 17", isWrong: false, hint: "The date is correct." },
      { id: "location-field", label: "Location: 5th & Main", isWrong: false, hint: "The location matches." },
    );
  } else {
    baseElements.push(
      { id: "alibi-claim", label: "Alibi: 'Was at home all night'", isWrong: true, hint: "But the CCTV footage shows this witness at the gas station at 10 PM — the alibi contradicts the evidence!" },
      { id: "incident-date", label: "Incident Date: March 17", isWrong: false, hint: "The date is correct." },
      { id: "time-field", label: "Time: 9:30 PM", isWrong: false, hint: "The time is consistent." },
    );
  }

  return {
    id: "interview-review",
    narrative:
      `Partner, I've got an important interview in 20 minutes and I need to review this witness statement first. Maria Santos came in yesterday and gave her account of what happened on the night of the robbery. I've also got the police report, CCTV footage notes, and two other witness statements to cross-reference. Something in Maria's statement doesn't add up — I can feel it. Read through each detail carefully and compare it to what we already know. Check the dates, the descriptions, the alibis — everything. If something doesn't match, tap on it and let me know.`,
    prompt: "What's inconsistent in the statement?",
    elements: baseElements,
    successMessage: "Sharp eye, {name}! That inconsistency could crack the case wide open!",
    hints: {
      attempt1: "That detail checks out. Look for something that contradicts the other evidence we have.",
      attempt2: "Compare each field to the police report and CCTV notes. One detail doesn't match up.",
      attempt3: "Here — this is the inconsistency.",
    },
  };
}

// Randomize error type for scenario 5
function buildScenario5Phase(): ScenarioPhase {
  const errorTypes = ["wrong-color", "wrong-plate", "wrong-model"] as const;
  const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

  const baseElements: ScenarioElement[] = [
    { id: "description-card", label: "Suspect Vehicle: Blue sedan, plate BK-4471", isWrong: false, hint: "This is the description we're matching against." },
  ];

  if (errorType === "wrong-color") {
    baseElements.push(
      { id: "car-a", label: "Slot A: Blue Sedan, BK-4471", isWrong: false, hint: "Blue sedan with matching plate — this looks right!" },
      { id: "car-b", label: "Slot B: Red Sedan, BK-4471", isWrong: true, hint: "Same plate number, but the color is red — the suspect drives a BLUE sedan!" },
      { id: "car-c", label: "Slot C: Blue SUV, MN-2209", isWrong: false, hint: "Different plate and it's an SUV — clearly not our suspect." },
      { id: "car-d", label: "Slot D: White Hatchback, TX-8832", isWrong: false, hint: "Wrong type, wrong plate — not suspicious." },
    );
  } else if (errorType === "wrong-plate") {
    baseElements.push(
      { id: "car-a", label: "Slot A: Blue Sedan, BK-4471", isWrong: false, hint: "This matches perfectly." },
      { id: "car-b", label: "Slot B: Blue Sedan, BK-4417", isWrong: true, hint: "Almost! The plate says BK-4417 but the suspect's plate is BK-4471 — the digits are swapped!" },
      { id: "car-c", label: "Slot C: Silver Sedan, JK-1105", isWrong: false, hint: "Different color and plate — not our car." },
      { id: "car-d", label: "Slot D: Blue Pickup, RL-6643", isWrong: false, hint: "Blue, but it's a pickup truck — not a sedan." },
    );
  } else {
    baseElements.push(
      { id: "car-a", label: "Slot A: Blue Sedan, BK-4471", isWrong: false, hint: "This matches the description." },
      { id: "car-b", label: "Slot B: Blue Coupe, BK-4471", isWrong: true, hint: "Same plate and color, but that's a coupe — the suspect drives a SEDAN!" },
      { id: "car-c", label: "Slot C: Green Sedan, PQ-3358", isWrong: false, hint: "Wrong color and plate — not a match." },
      { id: "car-d", label: "Slot D: Black Van, WZ-9901", isWrong: false, hint: "Totally different vehicle." },
    );
  }

  return {
    id: "parking-surveillance",
    narrative:
      `Alright, we've got security camera footage from the parking lot near the crime scene. The suspect is believed to drive a blue sedan with license plate BK-4471. I'm looking at four vehicles in the lot right now. Most of them are clearly not our suspect's car, but one of them looks close — maybe too close. It could be a decoy or a similar vehicle trying to throw us off. I need you to examine each car's details: the color, the model type, and the license plate. Compare them against the suspect vehicle description. If something doesn't match exactly, tap on it and let me know which car is the imposter.`,
    prompt: "Which car doesn't match the suspect description?",
    elements: baseElements,
    successMessage: "Excellent work, {name}! That car almost fooled us, but you caught the difference!",
    hints: {
      attempt1: "That vehicle is clearly different. Look for the one that's almost right but has one detail off.",
      attempt2: "Compare color, model type, AND plate number very carefully. One car has a subtle mismatch.",
      attempt3: "Let me highlight the imposter for you.",
    },
  };
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Mission Control Kits",
    setting: "operations-room",
    description: "Audit Johnny's field kits before a big surveillance op. Something's out of place!",
    icon: "🎒",
    difficulty: 1,
    phases: [buildScenario1Phase()],
  },
  {
    id: 2,
    title: "Safehouse Kitchen",
    setting: "safehouse-kitchen",
    description: "Check the kitchen for hazards before Johnny heads out. Safety first!",
    icon: "🍳",
    difficulty: 1,
    phases: [buildScenario2Phase()],
  },
  {
    id: 3,
    title: "Evidence Run Across Town",
    setting: "evidence-run",
    description: "Navigate the city, dodge distractions, and pick up the right evidence envelope.",
    icon: "🚗",
    difficulty: 3,
    phases: [
      {
        id: "route-selection",
        narrative:
          `Here's the situation: I've got exactly 30 minutes to get across town to the print shop on Baker Street. I need to pick up an important evidence envelope and then deliver it to the police station before they close for the day. I'm looking at the map and I see three possible routes. The Main Road goes straight through — it's the most direct path with clear traffic today. The Park Detour winds through the city park, which is nice and scenic but adds about 20 extra minutes to the trip. Then there's the Construction Shortcut — it cuts through a neighborhood that's under heavy roadworks right now, so the timing is unpredictable. Given that I only have half an hour and this evidence can't be late, which route should I take? Think about what's most reliable.`,
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
          `Great, we're on the main road now and making good time. But as we get closer to Baker Street, I'm noticing a few things along the way that could slow us down or throw us off course. There's a café called "Quick Beans" with a big sign outside that says "Stop in! 2-minute coffee!" — it smells amazing. Then I see a hand-painted sign pointing down a dark alley that says "Shortcut this way." And up ahead, there's a big crowd gathered around a street performer, blocking part of the sidewalk. There's also the print shop entrance right there on the corner, some people walking by, and a Baker Street sign on the lamppost. I need to stay focused on the mission. Can you point out which things on this street could distract me or lead me astray?`,
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
          `We made it to the print shop! Now here's the tricky part. The clerk has four envelopes on the counter, and they all look similar. I need to pick up the one that matches my case file exactly. Let me check the note the captain gave me this morning. It says: Case number 4712, filed by Officer Martinez, and it must be the ORIGINAL document — not a copy. Look at each envelope carefully. Envelope A says case number 4712, Officer Martinez, and it's marked ORIGINAL. Envelope B says case number 4712, but the officer name is "Martin" — not Martinez. Envelope C has Martinez's name but the case number is 4721 — the digits are flipped. And Envelope D has the right case number and the right name, but it's stamped as a COPY instead of an ORIGINAL. Which one is the correct envelope?`,
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
  {
    id: 4,
    title: "Witness Interview Room",
    setting: "interview-room",
    description: "Review a witness statement for inconsistencies before the big interview.",
    icon: "📋",
    difficulty: 2,
    phases: [buildScenario4Phase()],
  },
  {
    id: 5,
    title: "Parking Lot Surveillance",
    setting: "parking-lot",
    description: "Match suspect vehicle details from security footage. One car is an imposter!",
    icon: "📹",
    difficulty: 2,
    phases: [buildScenario5Phase()],
  },
];
