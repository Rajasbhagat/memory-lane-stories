import { motion } from "framer-motion";
import type { ScenarioElement } from "@/data/scenarios";

interface SceneContainerProps {
  setting: string;
  elements: ScenarioElement[];
  onElementTap: (id: string) => void;
  highlightedElement: string | null;
  incorrectElements: string[];
  foundElements: string[];
  interactive: boolean;
}

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
      return "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
    }
    return "border-border bg-card opacity-60";
  };

  const getSettingLabel = () => {
    switch (setting) {
      case "operations-room": return "🏢 Operations Room";
      case "safehouse-kitchen": return "🏠 Safehouse Kitchen";
      case "evidence-run": return "🗺️ Evidence Run";
      default: return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-auto"
    >
      {/* Scene header */}
      <div className="mb-2 text-center">
        <span className="text-xs font-medium text-muted-foreground">{getSettingLabel()}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3">
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
    "documents-near-heat": "📄",
    "coffee-mug": "☕",
    clock: "🕐",
    "sticky-note": "📌",
    window: "🪟",
    fridge: "🧊",
    "route-direct": "🛣️",
    "route-scenic": "🌳",
    "route-shortcut": "🚧",
    "route-safe": "🌳",
    "route-highway": "🚗",
    "coffee-shop": "☕",
    "shortcut-sign": "🪧",
    "street-performer": "🎭",
    "print-shop-door": "🏪",
    pedestrians: "🚶",
    "street-signs": "🪧",
    "bus-stop": "🚏",
    "park-bench": "🪑",
    "envelope-a": "✉️",
    "envelope-b": "✉️",
    "envelope-c": "✉️",
    "envelope-d": "✉️",
  };
  return icons[id] || "❓";
}

export default SceneContainer;
