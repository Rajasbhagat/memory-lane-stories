import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { GameStats } from "@/hooks/useGameState";

const Summary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stats = (location.state as GameStats) || {
    scenariosCompleted: 3,
    mistakesSpotted: 0,
    hintsUsed: 0,
  };

  const stars = stats.hintsUsed === 0 ? 3 : stats.hintsUsed <= 2 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-background px-6"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        {/* Confetti emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
          transition={{ type: "spring", damping: 10 }}
          className="text-7xl"
        >
          🎉
        </motion.div>

        <h1 className="text-heading-lg font-bold text-primary">Mission Complete!</h1>

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
            Great work today, Detective! You've got sharp eyes. See you on the next mission!
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
