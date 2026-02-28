import { motion } from "framer-motion";
import type { ScenarioElement } from "@/data/scenarios";
import sceneOperationsRoom from "@/assets/scene-operations-room.jpg";
import sceneSafehouseKitchen from "@/assets/scene-safehouse-kitchen.jpg";
import sceneEvidenceRun from "@/assets/scene-evidence-run.jpg";

interface SceneContainerProps {
  setting: string;
  elements: ScenarioElement[];
  onElementTap: (id: string) => void;
  highlightedElement: string | null;
  incorrectElements: string[];
  foundElements: string[];
  interactive: boolean;
}

const sceneImages: Record<string, string> = {
  "operations-room": sceneOperationsRoom,
  "safehouse-kitchen": sceneSafehouseKitchen,
  "evidence-run": sceneEvidenceRun,
};

const SceneContainer = ({
  setting,
  elements,
  onElementTap,
  highlightedElement,
  incorrectElements,
  foundElements,
  interactive,
}: SceneContainerProps) => {
  const getElementStyle = (el: ScenarioElement) => {
    if (foundElements.includes(el.id)) {
      return "border-success bg-success/30 ring-2 ring-success shadow-lg shadow-success/20";
    }
    if (incorrectElements.includes(el.id)) {
      return "border-destructive bg-destructive/30 animate-shake shadow-lg shadow-destructive/20";
    }
    if (highlightedElement === el.id) {
      return "border-primary bg-primary/30 ring-2 ring-primary animate-pulse shadow-lg shadow-primary/30";
    }
    if (interactive) {
      return "border-card/60 bg-foreground/30 hover:border-primary hover:bg-primary/20 cursor-pointer hover:shadow-lg hover:shadow-primary/20";
    }
    return "border-card/30 bg-foreground/20 opacity-60";
  };

  const bgImage = sceneImages[setting];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 overflow-auto"
    >
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "360px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/20 to-foreground/40 rounded-3xl" />

        {/* Interactive elements — min 60px touch targets */}
        <div className="relative z-10 grid grid-cols-2 gap-3 p-4 sm:grid-cols-3" style={{ minHeight: "360px" }}>
          {elements.map((el) => (
            <motion.button
              key={el.id}
              onClick={() => interactive && onElementTap(el.id)}
              disabled={!interactive || foundElements.includes(el.id)}
              whileHover={interactive ? { scale: 1.03 } : undefined}
              whileTap={interactive ? { scale: 0.96 } : undefined}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all duration-200 ease-out backdrop-blur-md min-h-touch ${getElementStyle(el)}`}
            >
              <span className="text-3xl drop-shadow-md">
                {getIcon(el.id)}
              </span>
              <span className="text-caption font-bold text-card drop-shadow-md leading-tight text-center">
                {el.label}
              </span>
              {el.detail && (
                <span className="text-caption text-card/80 drop-shadow-sm">{el.detail}</span>
              )}
              {foundElements.includes(el.id) && (
                <span className="text-caption text-success-foreground font-bold bg-success/80 px-3 py-1 rounded-full">✓ Found</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

function getIcon(id: string): string {
  const icons: Record<string, string> = {
    phone: "📱", "power-bank": "🔋", "spare-battery": "🪫",
    folder: "📁", "folder-duplicate": "📁", "usb-drive": "💾",
    "signed-note": "📝", "signed-note-duplicate": "📝",
    kettle: "☕", toaster: "🍞", "pan-on-stove": "🍳",
    thermos: "🫗", documents: "📄", "coffee-mug": "☕",
    clock: "🕐", "sticky-note": "📌", window: "🪟", fridge: "🧊",
    "route-direct": "🛣️", "route-scenic": "🌳", "route-shortcut": "🚧",
    "coffee-shop": "☕", "shortcut-sign": "🪧", "street-performer": "🎭",
    "print-shop-door": "🏪", pedestrians: "🚶", "street-signs": "🪧",
    "envelope-a": "✉️", "envelope-b": "✉️", "envelope-c": "✉️", "envelope-d": "✉️",
    "statement-header": "📋", "witness-name": "👤", "officer-signature": "✍️",
    "incident-date": "📅", "location-field": "📍", "time-field": "🕐",
    "suspect-height": "📏", "alibi-claim": "🗣️",
    "description-card": "🔍", "car-a": "🚗", "car-b": "🚗", "car-c": "🚗", "car-d": "🚗",
  };
  return icons[id] || "❓";
}

export default SceneContainer;
