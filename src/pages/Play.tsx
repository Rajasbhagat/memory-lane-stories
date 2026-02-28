import { useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Phone, PhoneOff } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useGeminiVoiceSession } from "@/hooks/useGeminiVoiceSession";
import NPCCompanion from "@/components/game/NPCCompanion";
import SceneContainer from "@/components/game/SceneContainer";
import HintOverlay from "@/components/game/HintOverlay";
import CelebrationOverlay from "@/components/game/CelebrationOverlay";
import { Button } from "@/components/ui/button";

const Play = () => {
  const location = useLocation();
  const scenarioIndex = (location.state as any)?.scenarioIndex as number | undefined;
  const playerName = localStorage.getItem("mindset-name")?.trim() || "Detective";

  const navigate = useNavigate();

  const {
    state,
    currentScenario,
    currentPhase,
    onElementTap,
    onCelebrationComplete,
    onTransitionComplete,
    useHint,
    dismissHint,
    getHintText,
    setPhase,
  } = useGameState(scenarioIndex);

  const scenarioContext = useMemo(() => currentPhase
    ? `Scenario: ${currentScenario?.title}. Phase: ${currentPhase.id}. Prompt: ${currentPhase.prompt}. Wrong elements: ${currentPhase.elements.filter(e => e.isWrong).map(e => e.label).join(', ')}.`
    : "",
    [currentPhase, currentScenario]
  );

  const wrongElements = useMemo(() => currentPhase
    ? currentPhase.elements.filter(e => e.isWrong).map(e => e.label)
    : [],
    [currentPhase]
  );

  const {
    voiceState,
    npcReply,
    voiceError,
    conversationHistory,
    isConnected,
    isUserSpeaking,
    connectSession,
    disconnectSession,
    sendTextToGemini,
    clearError,
    resetConversation,
  } = useGeminiVoiceSession(scenarioContext, currentPhase?.narrative || "", playerName, wrongElements);

  // Wrap onElementTap to fire Gemini voice feedback on correct tap
  const handleElementTap = useCallback((elementId: string) => {
    const element = currentPhase?.elements.find(e => e.id === elementId);
    if (element?.isWrong) {
      // Tell Gemini the user just tapped the right answer
      sendTextToGemini(
        `[RESULT: CORRECT] The user just tapped the correct item: "${element.label}". Congratulate them warmly and tell them they solved the case.`
      );
    } else if (element && !element.isWrong) {
      // Wrong tap — encourage them
      sendTextToGemini(
        `[RESULT: INCORRECT] The user tapped "${element.label}" but that's not the issue. Briefly encourage them to look more carefully.`
      );
    }
    onElementTap(elementId);
  }, [currentPhase, onElementTap, sendTextToGemini]);

  // Track when the game phase moves to celebrate
  const prevPhaseRef = useRef(state.phase);
  useEffect(() => {
    prevPhaseRef.current = state.phase;
  }, [state.phase]);

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

  // When Gemini connects, skip story narration and go straight to interactive touch phase
  useEffect(() => {
    if (isConnected && (state.phase === "story" || state.phase === "speak")) {
      setPhase("touch");
    }
  }, [isConnected, state.phase, setPhase]);

  // Reset conversation when scenario/phase changes
  useEffect(() => {
    resetConversation();
  }, [state.currentScenarioIndex, state.currentPhaseIndex, resetConversation]);

  if (!currentScenario || !currentPhase) return null;

  const personalizedSuccess = currentPhase.successMessage.replace("{name}", playerName);
  const hintText = getHintText();

  const npcMood =
    state.phase === "celebrate" ? "happy"
      : voiceState === "speaking" ? "thinking"
        : "neutral";

  const npcText =
    state.phase === "celebrate"
      ? personalizedSuccess
      : state.phase === "transition"
        ? "On to the next challenge..."
        : !isConnected
          ? "Tap Connect to start — then speak or tap the scene to find what's wrong"
          : voiceState === "speaking"
            ? (npcReply || "...")
            : (npcReply || currentPhase.prompt);

  const statusText = !isConnected
    ? "Not connected"
    : voiceState === "speaking"
      ? "🔊 Johnny is speaking..."
      : voiceState === "processing"
        ? "⏳ Thinking..."
        : isUserSpeaking
          ? "🎙️ Listening..."
          : "🟢 Session active";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col bg-background"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-2 flex items-center justify-between">
        <p className="text-caption text-muted-foreground">
          {currentScenario.title} — Phase {state.currentPhaseIndex + 1}/{currentScenario.phases.length}
        </p>
        {/* Mini connect button in header for quick access */}
        <Button
          onClick={isConnected ? disconnectSession : connectSession}
          size="sm"
          variant={isConnected ? "destructive" : "default"}
          className="rounded-full px-4 gap-2"
        >
          {isConnected ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>

      {/* NPC companion */}
      <div className="px-6 pt-2">
        <NPCCompanion
          text={npcText}
          isTyping={voiceState === "processing"}
          mood={npcMood}
        />
      </div>

      {/* Status + voice indicator */}
      <div className="px-6 pt-1 flex items-center justify-center gap-2">
        {isUserSpeaking ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs text-red-400 font-medium">Recording your voice...</span>
          </>
        ) : (
          <span className={`text-xs font-medium ${isConnected ? "text-green-500" : "text-muted-foreground"}`}>
            {statusText}
          </span>
        )}
      </div>

      {/* Errors */}
      {voiceError && (
        <div className="mx-6 mt-2 flex items-center gap-3 rounded-2xl bg-destructive/10 p-3 text-body text-destructive">
          <span className="flex-1 text-sm">{voiceError}</span>
          <button onClick={clearError} className="text-xs underline shrink-0">Dismiss</button>
        </div>
      )}

      {/* Conversation log */}
      {conversationHistory.length > 0 && (
        <div className="px-6 pt-2 max-h-32 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {conversationHistory.slice(-3).map((msg, i) => (
              <div
                key={i}
                className={`text-caption rounded-2xl px-3 py-1.5 text-xs ${msg.role === "user"
                  ? "bg-primary/10 text-primary self-end ml-10"
                  : "bg-muted text-muted-foreground self-start mr-10"
                  }`}
              >
                <span className="font-bold">{msg.role === "user" ? "You" : "Johnny"}:</span>{" "}
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scene — always interactive when connected */}
      <div className="flex-1 px-6 py-3">
        <AnimatePresence mode="wait">
          <SceneContainer
            key={`${state.currentScenarioIndex}-${state.currentPhaseIndex}`}
            setting={currentScenario.setting}
            elements={currentPhase.elements}
            onElementTap={handleElementTap}
            highlightedElement={state.highlightedElement}
            incorrectElements={state.incorrectElements}
            foundElements={state.foundElements}
            interactive={isConnected}
          />
        </AnimatePresence>
      </div>

      {/* Hint button */}
      {isConnected && state.phase === "touch" && (
        <div className="flex justify-center pb-2">
          <Button variant="ghost" onClick={useHint} className="gap-2 text-muted-foreground min-h-touch text-sm">
            <Lightbulb className="h-5 w-5" />
            Need a hint? {state.wrongAttempts > 0 && `(${state.wrongAttempts} wrong)`}
          </Button>
        </div>
      )}

      {/* Large connect button — shown when disconnected */}
      {!isConnected && (
        <div className="px-6 pb-6 flex flex-col items-center gap-2">
          <Button
            onClick={connectSession}
            className="min-h-touch-xl min-w-touch-xl rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="icon-lg"
          >
            <Phone className="h-10 w-10" />
          </Button>
          <p className="text-sm text-muted-foreground">Tap to connect</p>
        </div>
      )}

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
