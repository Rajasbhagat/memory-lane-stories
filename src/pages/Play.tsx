import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useVoiceSession } from "@/hooks/useVoiceSession";
import NPCCompanion from "@/components/game/NPCCompanion";
import VoiceControls from "@/components/game/VoiceControls";
import SceneContainer from "@/components/game/SceneContainer";
import HintOverlay from "@/components/game/HintOverlay";
import CelebrationOverlay from "@/components/game/CelebrationOverlay";
import { Button } from "@/components/ui/button";

const SKIP_SPEAK_TIMEOUT_MS = 15000;

const Play = () => {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("mindset-name")?.trim() || "Detective";

  const {
    state,
    currentScenario,
    currentPhase,
    onStoryComplete,
    onSpeakComplete,
    onElementTap,
    onCelebrationComplete,
    onTransitionComplete,
    useHint,
    dismissHint,
    getHintText,
  } = useGameState();

  const {
    voiceState,
    transcript,
    npcReply,
    voiceError,
    startListening,
    stopListening,
    submitText,
    processWithGemini,
    playNarration,
    clearError,
  } = useVoiceSession();

  const scenarioContext = currentPhase
    ? `Scenario: ${currentScenario?.title}. Phase: ${currentPhase.id}. Prompt: ${currentPhase.prompt}. Wrong elements: ${currentPhase.elements.filter(e => e.isWrong).map(e => e.label).join(', ')}.`
    : "";

  const handleVoiceSubmit = useCallback(
    (text: string) => {
      submitText(text, scenarioContext);
      setTimeout(onSpeakComplete, 1500);
    },
    [submitText, onSpeakComplete, scenarioContext],
  );

  // Auto-advance from story — longer delay for longer narratives
  useEffect(() => {
    if (state.phase === "story" && currentPhase) {
      playNarration(currentPhase.narrative);
      const readTime = Math.max(5000, currentPhase.narrative.length * 60);
      const timer = setTimeout(onStoryComplete, readTime);
      return () => clearTimeout(timer);
    }
  }, [state.phase, onStoryComplete, state.currentPhaseIndex, state.currentScenarioIndex]);

  // Skip-speak timeout: auto-advance to touch after 15s
  useEffect(() => {
    if (state.phase === "speak") {
      const timer = setTimeout(onSpeakComplete, SKIP_SPEAK_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
  }, [state.phase, onSpeakComplete]);

  // Auto-advance from transition
  useEffect(() => {
    if (state.phase === "transition") {
      const timer = setTimeout(onTransitionComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, onTransitionComplete]);

  // Navigate to summary when complete
  useEffect(() => {
    if (state.isComplete) {
      navigate("/summary", { state: state.stats });
    }
  }, [state.isComplete, navigate, state.stats]);

  // When transcript arrives from speech recognition, send to AI
  useEffect(() => {
    if (transcript && voiceState === "processing" && state.phase === "speak") {
      processWithGemini(transcript, scenarioContext);
    }
  }, [transcript, voiceState]);

  // When AI replies, advance to touch phase
  useEffect(() => {
    if (npcReply && state.phase === "speak") {
      setTimeout(onSpeakComplete, 1500);
    }
  }, [npcReply]);

  // Early return AFTER all hooks
  if (!currentScenario || !currentPhase) return null;

  const personalizedSuccess = currentPhase.successMessage.replace("{name}", playerName);
  const hintText = getHintText();

  const npcMood =
    state.phase === "celebrate"
      ? "happy"
      : state.phase === "story"
        ? "thinking"
        : "neutral";

  const npcText =
    state.phase === "story"
      ? currentPhase.narrative
      : state.phase === "speak"
        ? (npcReply || currentPhase.prompt)
        : state.phase === "touch"
          ? (npcReply || `Now show me — tap on what's wrong, ${playerName}!`)
          : state.phase === "celebrate"
            ? personalizedSuccess
            : state.phase === "transition"
              ? "On to the next challenge..."
              : currentPhase.prompt;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col bg-background"
    >
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-muted-foreground text-center">
          {currentScenario.title} — Phase {state.currentPhaseIndex + 1}/{currentScenario.phases.length}
        </p>
      </div>

      <div className="px-4 pt-2">
        <NPCCompanion text={npcText} isTyping={state.phase === "story"} mood={npcMood} />
      </div>

      <div className="flex-1 px-4 py-3">
        <AnimatePresence mode="wait">
          <SceneContainer
            key={`${state.currentScenarioIndex}-${state.currentPhaseIndex}`}
            setting={currentScenario.setting}
            elements={currentPhase.elements}
            onElementTap={onElementTap}
            highlightedElement={state.highlightedElement}
            incorrectElements={state.incorrectElements}
            foundElements={state.foundElements}
            interactive={state.phase === "touch"}
          />
        </AnimatePresence>
      </div>

      {state.phase === "touch" && (
        <div className="flex justify-center pb-2">
          <Button variant="ghost" onClick={useHint} className="gap-2 text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            Need a hint? {state.wrongAttempts > 0 && `(${state.wrongAttempts} wrong)`}
          </Button>
        </div>
      )}

      <div className="px-4 pb-4">
        <VoiceControls
          state={voiceState}
          transcript={transcript}
          onStartListening={startListening}
          onStopListening={stopListening}
          onTextSubmit={handleVoiceSubmit}
          disabled={state.phase !== "speak"}
          voiceError={voiceError}
          onClearError={clearError}
        />
      </div>

      <HintOverlay
        isVisible={state.phase === "hint"}
        hintText={hintText}
        onDismiss={dismissHint}
      />
      <CelebrationOverlay
        isVisible={state.phase === "celebrate"}
        message={personalizedSuccess}
        onComplete={onCelebrationComplete}
      />
    </motion.div>
  );
};

export default Play;
