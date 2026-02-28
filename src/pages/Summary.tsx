import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { GameStats } from "@/hooks/useGameState";
import { useProfile } from "@/hooks/useProfile";
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

  // Save stats to profile once
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

  // Fire confetti on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#7fb896", "#e07850", "#f5c842"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#7fb896", "#e07850", "#f5c842"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-background px-6"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
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
          <h1 className="text-heading-lg font-bold text-primary">Mission Complete!</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-1 text-lg font-semibold text-accent"
          >
            {ratingTitle}
          </motion.p>
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full rounded-2xl bg-card p-6 shadow-md"
        >
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-muted-foreground">Scenarios</p>
              <p className="text-heading font-bold text-foreground">{stats.scenariosCompleted}/3</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mistakes Spotted</p>
              <p className="text-heading font-bold text-foreground">{stats.mistakesSpotted}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hints Used</p>
              <p className="text-heading font-bold text-foreground">{stats.hintsUsed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-heading font-bold">{"⭐".repeat(stars)}</p>
            </div>
          </div>
        </motion.div>

        {/* Johnny's message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-md"
        >
          <span className="text-3xl">🕵️</span>
          <p className="text-speech text-card-foreground">
            Great work today, Detective {playerName}! You've got sharp eyes. See you on the next mission!
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex w-full flex-col gap-3"
        >
          <Button
            onClick={() => navigate("/play")}
            className="h-14 w-full rounded-full bg-accent text-button font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Play Again
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="h-14 w-full rounded-full text-button text-muted-foreground"
          >
            Done for Today
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Summary;
