import { motion } from "framer-motion";
import { BookOpen, Mic, Hand } from "lucide-react";

interface PhaseIndicatorProps {
  scenarioTitle: string;
  phaseNumber: number;
  totalPhases: number;
  activePhase: number; // 0=story, 1=speak, 2=touch
}

const phases = [
  { label: "Story", icon: BookOpen },
  { label: "Speak", icon: Mic },
  { label: "Touch", icon: Hand },
];

const PhaseIndicator = ({ scenarioTitle, phaseNumber, totalPhases, activePhase }: PhaseIndicatorProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-card border-2 border-border px-5 py-3 min-h-[60px] shadow-sm">
      <p className="text-caption text-muted-foreground">
        {scenarioTitle} — {phaseNumber}/{totalPhases}
      </p>
      <div className="flex items-center gap-2">
        {phases.map((p, i) => {
          const isActive = i === activePhase;
          const isPast = i < activePhase;
          return (
            <div
              key={p.label}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isPast
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <p.icon className="h-4 w-4" />
              <span className="text-sm font-semibold hidden sm:inline">{p.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseIndicator;
