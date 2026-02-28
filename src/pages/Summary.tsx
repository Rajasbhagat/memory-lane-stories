import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { GameStats } from "@/hooks/useGameState";
import { useProfile } from "@/hooks/useProfile";
import { ANIMATION } from "@/config/accessibility.config";
import confetti from "canvas-confetti";

const ratingTitles: Record<number, string> = {
  3: "Master Detective!",
  2: "Sharp Investigator!",
  1: "Good Work, Rookie!",
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
  const ratingTitle = ratingTitles[stars];

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
      className="flex min-h-screen items-center justify-center bg-background px-6"
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        {/* Stars */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="text-6xl"
        >
          {"⭐".repeat(stars)}
        </motion.div>

        <div>
          <h1 className="text-primary">Mission Complete!</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-xl font-bold text-accent-foreground"
          >
            {ratingTitle}
          </motion.p>
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: ANIMATION.DURATION_NORMAL / 1000 }}
          className="w-full rounded-3xl bg-card p-8 shadow-md border-2 border-border"
        >
          <div className="grid grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-caption text-muted-foreground">Scenarios</p>
              <p className="text-heading font-bold text-foreground">{stats.scenariosCompleted}/3</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground">Mistakes Spotted</p>
              <p className="text-heading font-bold text-foreground">{stats.mistakesSpotted}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground">Hints Used</p>
              <p className="text-heading font-bold text-foreground">{stats.hintsUsed}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground">Rating</p>
              <p className="text-heading font-bold">{"⭐".repeat(stars)}</p>
            </div>
          </div>
        </motion.div>

        {/* Johnny's message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: ANIMATION.DURATION_NORMAL / 1000 }}
          className="flex items-start gap-4 rounded-3xl bg-card p-6 shadow-md border-2 border-border"
        >
          <span className="text-4xl">🕵️</span>
          <p className="text-speech text-card-foreground">
            Great work today, Detective {playerName}! You've got sharp eyes. See you on the next mission!
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: ANIMATION.DURATION_NORMAL / 1000 }}
          className="flex w-full flex-col gap-4 pb-8"
        >
          <Button
            onClick={() => navigate("/play")}
            variant="accent"
            size="lg"
            className="w-full"
          >
            Play Again
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

export default Summary;
