import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, Eye, Lightbulb, Star, Shield, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { scenarios } from "@/data/scenarios";
import { ANIMATION } from "@/config/accessibility.config";

function getDetectiveRank(sessions: number) {
  if (sessions >= 8) return { title: "Senior Detective", emoji: "🕵️‍♂️" };
  if (sessions >= 4) return { title: "Detective", emoji: "🔍" };
  if (sessions >= 1) return { title: "Junior Detective", emoji: "🔎" };
  return { title: "Rookie Detective", emoji: "🆕" };
}

function getDifficultyLabel(d: 1 | 2 | 3) {
  if (d === 1) return { label: "Easy", className: "bg-success/15 text-success border-success/30" };
  if (d === 2) return { label: "Medium", className: "bg-accent/15 text-accent-foreground border-accent/30" };
  return { label: "Hard", className: "bg-destructive/15 text-destructive border-destructive/30" };
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: ANIMATION.DURATION_NORMAL / 1000, ease: ANIMATION.EASING } },
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
    { label: "Mistakes Found", value: profile?.total_mistakes_spotted ?? 0, icon: Eye, color: "text-accent-foreground" },
    { label: "Hints Used", value: profile?.total_hints_used ?? 0, icon: Lightbulb, color: "text-muted-foreground" },
    {
      label: "Best Rating",
      value: (profile?.best_star_rating ?? 0) > 0 ? "⭐".repeat(profile!.best_star_rating!) : "—",
      icon: Star,
      color: "text-primary",
    },
  ];

  const selected = scenarios[selectedScenario];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: ANIMATION.DURATION_NORMAL / 1000 }}
      className="flex min-h-screen items-start justify-center bg-background px-6 py-12 overflow-y-auto"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-lg flex-col items-center gap-10 text-center"
      >
        {/* Hero — 120px icon in larger circle */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-5">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-primary/10 shadow-lg">
            <Search className="h-[72px] w-[72px] text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl text-foreground">{greeting}</h1>
            <p className="mt-3 text-xl text-muted-foreground">Help Detective Johnny spot the mistakes</p>
          </div>
        </motion.div>

        {/* Name Input — 72px height */}
        <motion.div variants={fadeUp} className="w-full">
          <label htmlFor="name-input" className="mb-3 block text-left text-lg text-muted-foreground">
            What should I call you?
          </label>
          <Input
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="min-h-touch-lg text-xl"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
        </motion.div>

        {/* Profile Card — Detective ID */}
        {!loading && profile && (
          <motion.div variants={fadeUp} className="w-full">
            <Card className="border-2 border-primary/20 rounded-3xl shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <span className="text-6xl leading-none">{rank.emoji}</span>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-foreground">
                        {profile.display_name || "Detective"}
                      </p>
                      <p className="text-lg text-muted-foreground">{rank.title}</p>
                    </div>
                  </div>
                  {sessions === 0 && (
                    <Badge variant="secondary" className="text-caption px-3 py-1.5">New</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5 mb-8">
                  {stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-5">
                      <s.icon className={`h-10 w-10 shrink-0 ${s.color}`} strokeWidth={1.5} />
                      <div className="text-left">
                        <p className="text-caption text-muted-foreground leading-tight">{s.label}</p>
                        <p className="text-3xl font-bold text-foreground leading-tight">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-lg text-muted-foreground mb-3">
                    <span className="flex items-center gap-2">
                      <Shield className="h-6 w-6" /> Level Progress
                    </span>
                    <span className="font-bold">{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Choose Your Mission */}
        <motion.div variants={fadeUp} className="w-full">
          <h2 className="text-2xl text-foreground text-left mb-5">Choose Your Mission</h2>
          <div className="flex flex-col gap-5">
            {scenarios.map((scenario, index) => {
              const diff = getDifficultyLabel(scenario.difficulty);
              const isSelected = selectedScenario === index;
              return (
                <motion.button
                  key={scenario.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedScenario(index)}
                  className={`w-full text-left rounded-3xl border-2 p-6 transition-all duration-200 ease-out min-h-touch-lg ${
                    isSelected
                      ? "border-primary bg-primary/5 scale-[1.02] shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <span className="text-5xl leading-none mt-0.5">{scenario.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-foreground text-2xl">{scenario.title}</p>
                        <Badge variant="outline" className={`text-caption px-3 py-1 ${diff.className}`}>
                          {diff.label}
                        </Badge>
                      </div>
                      <p className="text-lg text-muted-foreground leading-snug">{scenario.description}</p>
                      <p className="text-caption text-muted-foreground mt-2">
                        {scenario.phases.length} {scenario.phases.length === 1 ? "phase" : "phases"}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <span className="text-primary-foreground text-2xl font-bold">✓</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* CTA — 96px height */}
        <motion.div variants={fadeUp} className="w-full pt-4 pb-10">
          <Button
            onClick={handleStart}
            variant="accent"
            size="xl"
            className="w-full text-2xl shadow-xl gap-3"
          >
            Start: {selected?.title ?? "Mission"}
            <ChevronRight className="h-8 w-8" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
