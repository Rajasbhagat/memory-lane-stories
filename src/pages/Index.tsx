import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, Eye, Lightbulb, Star, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { scenarios } from "@/data/scenarios";

function getDetectiveRank(sessions: number) {
  if (sessions >= 8) return { title: "Senior Detective", emoji: "🕵️‍♂️" };
  if (sessions >= 4) return { title: "Detective", emoji: "🔍" };
  if (sessions >= 1) return { title: "Junior Detective", emoji: "🔎" };
  return { title: "Rookie Detective", emoji: "🆕" };
}

function getDifficultyLabel(d: 1 | 2 | 3) {
  if (d === 1) return { label: "Easy", className: "bg-primary/15 text-primary border-primary/30" };
  if (d === 2) return { label: "Medium", className: "bg-accent/15 text-accent border-accent/30" };
  return { label: "Hard", className: "bg-destructive/15 text-destructive border-destructive/30" };
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedScenario, setSelectedScenario] = useState(0);
  const { profile, loading, updateName } = useProfile();

  useEffect(() => {
    const stored = localStorage.getItem("mindset-name");
    if (stored) setName(stored);
  }, []);

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
    navigate("/play", { state: { scenarioIndex: selectedScenario } });
  };

  const sessions = profile?.total_sessions ?? 0;
  const rank = getDetectiveRank(sessions);
  const greeting = name.trim() ? `Welcome back, ${name.trim()}!` : "Welcome to MindSet!";
  const progressValue = Math.min(sessions * 10, 100);

  const stats = [
    { label: "Sessions", value: sessions, icon: Calendar, color: "text-primary" },
    { label: "Mistakes Found", value: profile?.total_mistakes_spotted ?? 0, icon: Eye, color: "text-accent" },
    { label: "Hints Used", value: profile?.total_hints_used ?? 0, icon: Lightbulb, color: "text-muted-foreground" },
    {
      label: "Best Rating",
      value: (profile?.best_star_rating ?? 0) > 0 ? "⭐".repeat(profile!.best_star_rating) : "—",
      icon: Star,
      color: "text-primary",
    },
  ];

  const selected = scenarios[selectedScenario];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen items-start justify-center bg-background px-6 py-10 overflow-y-auto"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Search className="h-12 w-12 text-primary" strokeWidth={1.5} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <h1 className="text-heading-lg font-bold text-foreground">{greeting}</h1>
          <p className="mt-1 text-body text-muted-foreground">Help Detective Johnny spot the mistakes</p>
        </motion.div>

        {/* Name Input */}
        <motion.div variants={fadeUp} className="w-full">
          <label htmlFor="name-input" className="mb-2 block text-left text-body text-muted-foreground">
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
        {!loading && profile && (
          <motion.div variants={fadeUp} className="w-full">
            <Card className="border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{rank.emoji}</span>
                    <div className="text-left">
                      <p className="text-lg font-semibold text-foreground">
                        {profile.display_name || "Detective"}
                      </p>
                      <p className="text-sm text-muted-foreground">{rank.title}</p>
                    </div>
                  </div>
                  {sessions === 0 && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                      <s.icon className={`h-5 w-5 shrink-0 ${s.color}`} />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                        <p className="text-lg font-bold text-foreground leading-tight">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" /> Level Progress
                    </span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Choose Your Mission */}
        <motion.div variants={fadeUp} className="w-full">
          <h2 className="text-lg font-bold text-foreground text-left mb-3">Choose Your Mission</h2>
          <div className="flex flex-col gap-3">
            {scenarios.map((scenario, index) => {
              const diff = getDifficultyLabel(scenario.difficulty);
              const isSelected = selectedScenario === index;
              return (
                <motion.button
                  key={scenario.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedScenario(index)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl leading-none mt-0.5">{scenario.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground text-base">{scenario.title}</p>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${diff.className}`}>
                          {diff.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">{scenario.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {scenario.phases.length} {scenario.phases.length === 1 ? "phase" : "phases"}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="text-primary text-lg">✓</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp} className="w-full pt-2 pb-6">
          <Button
            onClick={handleStart}
            className="h-14 w-full rounded-full bg-accent text-button font-semibold text-accent-foreground hover:bg-accent/90 transition-transform active:scale-95"
          >
            Start: {selected?.title ?? "Mission"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
