export interface ScenarioElement {
  id: string;
  label: string;
  isWrong: boolean;
  hint: string;
}

export interface ScenarioPhase {
  id: string;
  narrative: string;
  prompt: string;
  elements: ScenarioElement[];
  successMessage: string;
}

export interface Scenario {
  id: number;
  title: string;
  setting: string;
  phases: ScenarioPhase[];
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Mission Control Kits",
    setting: "operations-room",
    phases: [
      {
        id: "kit-audit",
        narrative:
          "Alright, partner — before we head out, I need you to check my mission kits. I've got a Tech Kit and an Evidence Kit on my desk. Make sure everything's in the right place and nothing's missing or doubled up!",
        prompt: "What looks wrong with the kits?",
        elements: [
          { id: "phone", label: "Phone", isWrong: false, hint: "The phone belongs in the Tech Kit." },
          { id: "power-bank", label: "Power Bank", isWrong: false, hint: "Power bank is correct in the Tech Kit." },
          { id: "spare-battery", label: "Spare Battery", isWrong: true, hint: "Hmm, is that battery really needed in the Tech Kit? Think about what's already there." },
          { id: "folder", label: "Evidence Folder", isWrong: false, hint: "The folder belongs in the Evidence Kit." },
          { id: "usb-drive", label: "USB Drive", isWrong: false, hint: "USB drive is correct in the Evidence Kit." },
          { id: "signed-note", label: "Signed Note", isWrong: true, hint: "Wait — does that note look like it belongs? Check if it matches the others." },
        ],
        successMessage: "Sharp eyes, Detective! The kits are sorted. Let's move on!",
      },
    ],
  },
  {
    id: 2,
    title: "Safehouse Kitchen",
    setting: "safehouse-kitchen",
    phases: [
      {
        id: "kitchen-check",
        narrative:
          "I'm about to leave the safehouse, but I need you to check the kitchen first. Make sure nothing dangerous is left on and everything's safe before I head out!",
        prompt: "What's not safe in the kitchen?",
        elements: [
          { id: "kettle", label: "Kettle", isWrong: true, hint: "Is the kettle still on? That could be dangerous to leave unattended." },
          { id: "toaster", label: "Toaster", isWrong: false, hint: "The toaster is unplugged — all good." },
          { id: "pan-on-stove", label: "Pan on Stove", isWrong: true, hint: "Look at the stove — is something still sitting on a hot burner?" },
          { id: "thermos", label: "Thermos", isWrong: false, hint: "The thermos is safely on the counter." },
          { id: "documents-near-heat", label: "Documents", isWrong: true, hint: "Those papers are awfully close to something hot…" },
          { id: "clock", label: "Wall Clock", isWrong: false, hint: "The clock is just telling the time — nothing wrong there." },
          { id: "window", label: "Window", isWrong: false, hint: "The window is closed and locked." },
        ],
        successMessage: "Great work! The safehouse is secure. Time to move!",
      },
    ],
  },
  {
    id: 3,
    title: "Evidence Run Across Town",
    setting: "evidence-run",
    phases: [
      {
        id: "route-selection",
        narrative:
          "We need to get this evidence across town to the print shop. I've got three routes on the map — but only one is safe. Which route should we take?",
        prompt: "Which route is the safest?",
        elements: [
          { id: "route-direct", label: "Direct Route", isWrong: true, hint: "The direct route goes past the suspect's neighborhood — too risky!" },
          { id: "route-safe", label: "Park Route", isWrong: false, hint: "The park route avoids all known hotspots." },
          { id: "route-highway", label: "Highway Route", isWrong: true, hint: "The highway has construction delays — we'd be stuck in the open too long." },
        ],
        successMessage: "Good call — the park route is safest. Let's go!",
      },
      {
        id: "street-distractions",
        narrative:
          "We're on the street now. Stay focused — there are distractions that could throw us off the mission. Spot anything that could distract us!",
        prompt: "What could distract us?",
        elements: [
          { id: "coffee-shop", label: "Coffee Shop", isWrong: true, hint: "That coffee shop smells great, but we can't stop now!" },
          { id: "shortcut-sign", label: "Shortcut Sign", isWrong: true, hint: "That sign says 'shortcut' but it leads through an alley — not safe." },
          { id: "bus-stop", label: "Bus Stop", isWrong: false, hint: "The bus stop is just a landmark — no distraction there." },
          { id: "park-bench", label: "Park Bench", isWrong: false, hint: "Just a bench — nothing suspicious." },
        ],
        successMessage: "You spotted the traps! Almost there, Detective.",
      },
      {
        id: "print-shop",
        narrative:
          "We're at the print shop. There are envelopes on the counter — but only one has the right case number. Match it to the note I gave you!",
        prompt: "Which envelope matches our case?",
        elements: [
          { id: "envelope-a", label: "Envelope #2847", isWrong: true, hint: "Check the case number again — does 2847 match?" },
          { id: "envelope-b", label: "Envelope #3921", isWrong: false, hint: "3921 — that matches the note!" },
          { id: "envelope-c", label: "Envelope #1563", isWrong: true, hint: "1563 is from last month's case." },
          { id: "envelope-d", label: "Envelope #4205", isWrong: true, hint: "4205 doesn't match anything in our file." },
        ],
        successMessage: "That's the one! Mission accomplished, Detective! 🎉",
      },
    ],
  },
];
