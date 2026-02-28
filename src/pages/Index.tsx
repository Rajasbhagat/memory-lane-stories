import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { profile, loading, updateName } = useProfile();

  useEffect(() => {
    const stored = localStorage.getItem("mindset-name");
    if (stored) setName(stored);
  }, []);

  // Sync name from profile on load
  useEffect(() => {
    if (profile?.display_name && !name.trim()) {
      setName(profile.display_name);
    }
  }, [profile]);

  const handleStart = () => {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem("mindset-name", trimmed);
      updateName(trimmed);
    }
    navigate("/play");
  };

  const greeting = name.trim() ? `Welcome back, ${name.trim()}!` : "Welcome to MindSet!";

  // Progress: each session is worth ~10%, cap at 100
  const progressValue = profile ? Math.min(profile.total_sessions * 10, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen items-center justify-center bg-background px-6"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        {/* Hero Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
          className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10"
        >
          <Search className="h-16 w-16 text-primary" strokeWidth={1.5} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="text-heading-lg font-bold text-foreground">{greeting}</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Help Detective Johnny spot the mistakes
          </p>
        </motion.div>

        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full"
        >
          <label
            htmlFor="name-input"
            className="mb-2 block text-left text-body text-muted-foreground"
          >
            What should I call you?
          </label>
          <Input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="h-14 text-body"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
        </motion.div>

        {/* Profile Card */}
        {!loading && profile && profile.total_sessions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="w-full"
          >
            <Card className="border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🕵️</span>
                  <span className="text-lg font-semibold text-foreground">
                    Detective {profile.display_name}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-left mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    <p className="text-lg font-bold text-foreground">{profile.total_sessions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mistakes</p>
                    <p className="text-lg font-bold text-foreground">{profile.total_mistakes_spotted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Best</p>
                    <p className="text-lg font-bold">
                      {profile.best_star_rating > 0
                        ? "⭐".repeat(profile.best_star_rating)
                        : "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-full"
        >
          <Button
            onClick={handleStart}
            className="h-14 w-full rounded-full bg-accent text-button font-semibold text-accent-foreground hover:bg-accent/90 transition-transform active:scale-95"
          >
            Start Today's Mission
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
