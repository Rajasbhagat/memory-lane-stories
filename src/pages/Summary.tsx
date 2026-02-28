import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Eye, Lightbulb, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { GameStats } from "@/hooks/useGameState";
import { useProfile } from "@/hooks/useProfile";
import { ANIMATION } from "@/config/accessibility.config";
import confetti from "canvas-confetti";

const ratingMessages: Record<number, { title: string; subtitle: string }> = {
  3: { title: "Master Detective!", subtitle: "Flawless investigation — no hints needed!" },
  2: { title: "Sharp Investigator!", subtitle: "Great eye for detail — keep it up!" },
  1: { title: "Good Work, Rookie!", subtitle: "Every case makes you stronger!" },
};

const Summary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile } = useProfile();
  const savedRef = useRef(false);

  const playerName = localStorage.getItem("mindset-name")?.trim() || "Detective";
  const stats = (location.state as GameStats) || {
    scenariosCompleted: 3,
    mistakesSpotted: 0,
    hintsUsed: 0,
  };

  const stars = stats.hintsUsed === 0 ? 3 : stats.hintsUsed <= 3 ? 2 : 1;
  const rating = ratingMessages[stars];

  // Max scores for progress bars
  const maxMistakes = 6;
  const observationScore = Math.min(Math.round((stats.mistakesSpotted / maxMistakes) * 100), 100);
  const efficiencyScore = Math.max(0, Math.round(((maxMistakes - stats.hintsUsed) / maxMistakes) * 100));
  const completionScore = Math.round((stats.scenariosCompleted / 3) * 100);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    updateProfile({
      mistakesSpotted: stats.mistakesSpotted,
      hintsUsed: stats.hintsUsed,
      scenariosCompleted: stats.scenariosCompleted,
      stars,
    });
  }, []);

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#2563eb", "#f59e0b", "#10b981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#2563eb", "#f59e0b", "#10b981"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION.DURATION_NORMAL / 1000 }}
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12"
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-10 text-center">
        {/* Trophy Icon — 80px in 128px circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, delay: 0.1 }}
          className="flex h-32 w-32 items-center justify-center rounded-full bg-accent/15 shadow-lg"
        >
          <Trophy className="h-20 w-20 text-accent" strokeWidth={1.5} />
        </motion.div>

        {/* Title + Player Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl text-foreground">Mission Complete!</h1>
          <p className="mt-2 text-2xl font-bold text-primary">{playerName}</p>
        </motion.div>

        {/* Star Rating — sequential pop-in */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={i <= stars ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0, opacity: 0.2 }}
              transition={{ type: "spring", damping: 8, delay: 0.3 + i * 0.15 }}
              className="text-5xl"
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Rating message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xl font-bold text-accent-foreground">{rating.title}</p>
          <p className="mt-1 text-lg text-muted-foreground">{rating.subtitle}</p>
        </motion.div>

        {/* Skill Breakdown with Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: ANIMATION.DURATION_NORMAL / 1000 }}
          className="w-full rounded-3xl bg-card p-8 shadow-md border-2 border-border"
        >
          <h2 className="text-xl font-bold text-foreground text-left mb-6">Skill Breakdown</h2>
          <div className="flex flex-col gap-6">
            <SkillRow
              icon={<Eye className="h-7 w-7 text-primary" />}
              label="Observation"
              detail={`${stats.mistakesSpotted} mistakes spotted`}
              value={observationScore}
              delay={0.6}
            />
            <SkillRow
              icon={<Lightbulb className="h-7 w-7 text-accent" />}
              label="Efficiency"
              detail={`${stats.hintsUsed} hints used`}
              value={efficiencyScore}
              delay={0.7}
            />
            <SkillRow
              icon={<Target className="h-7 w-7 text-success" />}
              label="Completion"
              detail={`${stats.scenariosCompleted}/3 scenarios`}
              value={completionScore}
              delay={0.8}
            />
          </div>
        </motion.div>

        {/* Johnny's farewell — framed card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: ANIMATION.DURATION_NORMAL / 1000 }}
          className="w-full rounded-3xl bg-card p-6 shadow-md border-2 border-primary/20"
        >
          <div className="flex items-start gap-4">
            <span className="text-5xl">🕵️</span>
            <div className="text-left">
              <p className="text-lg font-bold text-foreground mb-1">Detective Johnny</p>
              <p className="text-speech text-card-foreground">
                Fantastic work today, {playerName}! Every case you solve sharpens your skills. I'll be here whenever you're ready for the next mission!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions — 96px Play Again, 72px Done */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: ANIMATION.DURATION_NORMAL / 1000 }}
          className="flex w-full flex-col gap-4 pb-10"
        >
          <Button
            onClick={() => navigate("/play")}
            variant="accent"
            size="xl"
            className="w-full text-2xl shadow-xl gap-3"
          >
            Accept New Case
            <ChevronRight className="h-8 w-8" />
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="lg"
            className="w-full text-muted-foreground"
          >
            Done for Today
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* Skill row sub-component */
interface SkillRowProps {
  icon: React.ReactNode;
  label: string;
  detail: string;
  value: number;
  delay: number;
}

const SkillRow = ({ icon, label, detail, value, delay }: SkillRowProps) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-lg font-bold text-foreground">{label}</span>
      </div>
      <span className="text-caption text-muted-foreground">{detail}</span>
    </div>
    <Progress value={value} className="h-4" />
  </motion.div>
);

export default Summary;
