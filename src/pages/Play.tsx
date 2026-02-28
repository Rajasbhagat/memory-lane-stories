import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lightbulb, BookOpen, Mic, Hand } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useVoiceSession } from "@/hooks/useVoiceSession";
import NPCCompanion from "@/components/game/NPCCompanion";
import VoiceControls from "@/components/game/VoiceControls";
import SceneContainer from "@/components/game/SceneContainer";
import HintOverlay from "@/components/game/HintOverlay";
import CelebrationOverlay from "@/components/game/CelebrationOverlay";
import PhaseIndicator from "@/components/game/PhaseIndicator";
import { Button } from "@/components/ui/button";

const MAX_EXCHANGES = 5;

const Play = () => {
  const location = useLocation();
  const scenarioIndex = (location.state as any)?.scenarioIndex as number | undefined;
  const playerName = localStorage.getItem("mindset-name")?.trim() || "Detective";

  const navigate = useNavigate();

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
    getHintTier,
  } = useGameState(scenarioIndex);

  const {
    voiceState,
    transcript,
    npcReply,
    voiceError,
    conversationHistory,
    isCorrect,
    pendingVoiceTranscript,
    setPendingVoiceTranscript,
    startListening,
    stopListening,
    submitText,
    streamResponse,
    playNarration,
    clearError,
    resetConversation,
  } = useVoiceSession();

  const scenarioContext = currentPhase
    ? `Scenario: ${currentScenario?.title}. Phase: ${currentPhase.id}. Prompt: ${currentPhase.prompt}. Wrong elements: ${currentPhase.elements.filter(e => e.isWrong).map(e => e.label).join(', ')}.`
    : "";

  const userExchanges = conversationHistory.filter(m => m.role === "user").length;

  const handleVoiceSubmit = useCallback(
    (text: string) => {
      submitText(text, scenarioContext);
    },
    [submitText, scenarioContext],
  );

  // Auto-advance from story
  useEffect(() => {
    if (state.phase === "story" && currentPhase) {
      playNarration(currentPhase.narrative);
      const readTime = Math.max(5000, currentPhase.narrative.length * 60);
      const timer = setTimeout(onStoryComplete, readTime);
      return () => clearTimeout(timer);
    }
  }, [state.phase, onStoryComplete, state.currentPhaseIndex, state.currentScenarioIndex, playNarration]);

  // When AI says [CORRECT], advance to touch phase
  useEffect(() => {
    if (isCorrect && state.phase === "speak") {
      const timer = setTimeout(onSpeakComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, state.phase, onSpeakComplete]);

  // Max exchanges reached — auto-advance to touch
  useEffect(() => {
    if (state.phase === "speak" && userExchanges >= MAX_EXCHANGES && !isCorrect) {
      const timer = setTimeout(onSpeakComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [userExchanges, state.phase, isCorrect, onSpeakComplete]);

  // When transcript arrives from speech recognition (voice only), send to AI
  useEffect(() => {
    if (pendingVoiceTranscript && transcript && voiceState === "processing" && state.phase === "speak") {
      setPendingVoiceTranscript(false);
      streamResponse(transcript, scenarioContext);
    }
  }, [pendingVoiceTranscript, transcript, voiceState]);

  // Reset conversation when scenario/phase changes
  useEffect(() => {
    resetConversation();
  }, [state.currentScenarioIndex, state.currentPhaseIndex, resetConversation]);

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

  const voiceDisabled = state.phase !== "speak" || voiceState === "processing" || voiceState === "speaking";

  const activePhaseIndex = state.phase === "story" ? 0 : state.phase === "speak" ? 1 : 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col bg-background"
    >
      {/* Phase Indicator */}
      <div className="px-6 pt-5 pb-2">
        <PhaseIndicator
          scenarioTitle={currentScenario.title}
          phaseNumber={state.currentPhaseIndex + 1}
          totalPhases={currentScenario.phases.length}
          activePhase={activePhaseIndex}
        />
      </div>

      {/* NPC Companion — min-height 200px, larger text */}
      <div className="px-6 pt-3">
        <NPCCompanion
          text={npcText}
          isTyping={voiceState === "processing"}
          mood={npcMood}
        />
      </div>

      {/* Scene */}
      <div className="flex-1 px-6 py-4">
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

      {/* Hint button — touch phase only */}
      {state.phase === "touch" && (
        <div className="flex justify-center pb-3">
          <Button variant="ghost" onClick={useHint} className="gap-2 text-muted-foreground min-h-touch">
            <Lightbulb className="h-6 w-6" />
            Need a hint? {state.wrongAttempts > 0 && `(${state.wrongAttempts} wrong)`}
          </Button>
        </div>
      )}

      {/* Voice Controls */}
      <div className="px-6 pb-6">
        <VoiceControls
          state={voiceState}
          transcript={transcript}
          onStartListening={startListening}
          onStopListening={stopListening}
          onTextSubmit={handleVoiceSubmit}
          disabled={voiceDisabled}
          voiceError={voiceError}
          onClearError={clearError}
        />
      </div>

      <HintOverlay
        isVisible={state.phase === "hint"}
        hintText={hintText}
        hintTier={getHintTier()}
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
