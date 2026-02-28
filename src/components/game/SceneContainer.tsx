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
      return "border-primary bg-primary/30 ring-2 ring-primary shadow-lg shadow-primary/20";
    }
    if (incorrectElements.includes(el.id)) {
      return "border-destructive bg-destructive/30 animate-shake shadow-lg shadow-destructive/20";
    }
    if (highlightedElement === el.id) {
      return "border-primary bg-primary/30 ring-2 ring-primary animate-pulse shadow-lg shadow-primary/30";
    }
    if (interactive) {
      return "border-white/40 bg-black/30 hover:border-primary hover:bg-primary/20 cursor-pointer hover:shadow-lg hover:shadow-primary/20";
    }
    return "border-white/20 bg-black/20 opacity-60";
  };

  const bgImage = sceneImages[setting];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-auto"
    >
      {/* Scene with overlaid elements */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "360px",
        }}
      >
        {/* Dim overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40 rounded-2xl" />

        {/* Interactive elements grid overlaid on scene */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3" style={{ minHeight: "360px" }}>
          {elements.map((el) => (
            <motion.button
              key={el.id}
              onClick={() => interactive && onElementTap(el.id)}
              disabled={!interactive || foundElements.includes(el.id)}
              whileHover={interactive ? { scale: 1.05 } : undefined}
              whileTap={interactive ? { scale: 0.95 } : undefined}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 backdrop-blur-md ${getElementStyle(el)}`}
            >
              <span className="text-2xl drop-shadow-md">
                {getIcon(el.id)}
              </span>
              <span className="text-xs font-bold text-white drop-shadow-md leading-tight text-center">
                {el.label}
              </span>
              {el.detail && (
                <span className="text-[10px] text-white/80 drop-shadow-sm">{el.detail}</span>
              )}
              {foundElements.includes(el.id) && (
                <span className="text-[10px] text-primary-foreground font-bold bg-primary/80 px-2 py-0.5 rounded-full">✓ Found</span>
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
