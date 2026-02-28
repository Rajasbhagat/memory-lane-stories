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
      return "border-primary bg-primary/10 ring-2 ring-primary";
    }
    if (incorrectElements.includes(el.id)) {
      return "border-destructive bg-destructive/10 animate-shake";
    }
    if (highlightedElement === el.id) {
      return "border-primary bg-primary/20 ring-2 ring-primary animate-pulse";
    }
    if (interactive) {
      return "border-border bg-card/90 hover:border-primary/50 hover:bg-primary/5 cursor-pointer backdrop-blur-sm";
    }
    return "border-border bg-card/80 opacity-60 backdrop-blur-sm";
  };

  const bgImage = sceneImages[setting];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-auto rounded-2xl"
    >
      {/* Scene illustration */}
      {bgImage && (
        <div className="relative mb-3 overflow-hidden rounded-2xl">
          <img
            src={bgImage}
            alt={`Scene: ${setting}`}
            className="w-full h-40 object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3">
        {elements.map((el) => (
          <motion.button
            key={el.id}
            onClick={() => interactive && onElementTap(el.id)}
            disabled={!interactive || foundElements.includes(el.id)}
            whileHover={interactive ? { scale: 1.03 } : undefined}
            whileTap={interactive ? { scale: 0.97 } : undefined}
            className={`flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-colors ${getElementStyle(el)}`}
          >
            <span className="text-2xl">
              {getIcon(el.id)}
            </span>
            <span className="text-sm font-semibold text-card-foreground">{el.label}</span>
            {el.detail && (
              <span className="text-xs text-muted-foreground">{el.detail}</span>
            )}
            {foundElements.includes(el.id) && (
              <span className="text-xs text-primary font-medium">✓ Found</span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

function getIcon(id: string): string {
  const icons: Record<string, string> = {
    phone: "📱",
    "power-bank": "🔋",
    "spare-battery": "🪫",
    folder: "📁",
    "folder-duplicate": "📁",
    "usb-drive": "💾",
    "signed-note": "📝",
    "signed-note-duplicate": "📝",
    kettle: "☕",
    toaster: "🍞",
    "pan-on-stove": "🍳",
    thermos: "🫗",
    documents: "📄",
    "coffee-mug": "☕",
    clock: "🕐",
    "sticky-note": "📌",
    window: "🪟",
    fridge: "🧊",
    "route-direct": "🛣️",
    "route-scenic": "🌳",
    "route-shortcut": "🚧",
    "coffee-shop": "☕",
    "shortcut-sign": "🪧",
    "street-performer": "🎭",
    "print-shop-door": "🏪",
    pedestrians: "🚶",
    "street-signs": "🪧",
    "envelope-a": "✉️",
    "envelope-b": "✉️",
    "envelope-c": "✉️",
    "envelope-d": "✉️",
  };
  return icons[id] || "❓";
}

export default SceneContainer;
