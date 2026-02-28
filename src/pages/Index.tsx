import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [sessionCount, setSessionCount] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("mindset-name");
    if (stored) setName(stored);
    const count = parseInt(localStorage.getItem("mindset-sessions") || "1", 10);
    setSessionCount(count);
  }, []);

  const handleStart = () => {
    if (name.trim()) localStorage.setItem("mindset-name", name.trim());
    const next = sessionCount + 1;
    localStorage.setItem("mindset-sessions", String(next));
    navigate("/play");
  };

  const greeting = name.trim() ? `Welcome back, ${name.trim()}!` : "Welcome to MindSet!";

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

        {/* Session indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          Session #{sessionCount}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Index;
