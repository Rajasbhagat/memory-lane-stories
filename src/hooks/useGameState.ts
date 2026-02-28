import { useState, useCallback } from "react";
import { scenarios, type Scenario, type ScenarioPhase } from "@/data/scenarios";

export type GamePhase = "story" | "speak" | "touch" | "hint" | "celebrate" | "transition";

export interface GameStats {
  scenariosCompleted: number;
  mistakesSpotted: number;
  hintsUsed: number;
}

export interface GameState {
  currentScenarioIndex: number;
  currentPhaseIndex: number;
  phase: GamePhase;
  stats: GameStats;
  highlightedElement: string | null;
  incorrectElements: string[];
  foundElements: string[];
  isComplete: boolean;
  wrongAttempts: number;
  hintTier: 0 | 1 | 2 | 3; // 0=no hint yet, 1=subtle, 2=stronger, 3=direct
  consecutiveSuccesses: number;
  consecutiveHints: number;
}

const initialStats: GameStats = {
  scenariosCompleted: 0,
  mistakesSpotted: 0,
  hintsUsed: 0,
};

export function useGameState(scenarioIndex?: number) {
  const activeScenarios = scenarioIndex !== undefined
    ? [scenarios[scenarioIndex]].filter(Boolean)
    : scenarios;

  const [state, setState] = useState<GameState>({
    currentScenarioIndex: 0,
    currentPhaseIndex: 0,
    phase: "story",
    stats: { ...initialStats },
    highlightedElement: null,
    incorrectElements: [],
    foundElements: [],
    isComplete: false,
    wrongAttempts: 0,
    hintTier: 0,
    consecutiveSuccesses: 0,
    consecutiveHints: 0,
  });

  const currentScenario: Scenario | undefined = activeScenarios[state.currentScenarioIndex];
  const currentPhase: ScenarioPhase | undefined = currentScenario?.phases[state.currentPhaseIndex];

  const setPhase = useCallback((phase: GamePhase) => {
    setState((s) => ({ ...s, phase }));
  }, []);

  const onStoryComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "speak" }));
  }, []);

  const onSpeakComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "touch" }));
  }, []);

  const onElementTap = useCallback(
    (elementId: string) => {
      if (!currentPhase) return;
      const element = currentPhase.elements.find((e) => e.id === elementId);
      if (!element) return;

      if (state.foundElements.includes(elementId)) return;

      if (element.isWrong) {
        // Correct tap — track success
        setState((s) => ({
          ...s,
          foundElements: [...s.foundElements, elementId],
          highlightedElement: elementId,
          stats: { ...s.stats, mistakesSpotted: s.stats.mistakesSpotted + 1 },
          consecutiveSuccesses: s.consecutiveSuccesses + 1,
          consecutiveHints: 0,
        }));

        const wrongElements = currentPhase.elements.filter((e) => e.isWrong);
        const newFound = [...state.foundElements, elementId];
        const allFound = wrongElements.every((e) => newFound.includes(e.id));

        if (allFound) {
          setTimeout(() => {
            setState((s) => ({ ...s, phase: "celebrate" }));
          }, 800);
        }
      } else {
        // Incorrect tap — escalate hint tier, never punish
        const nextTier = Math.min(state.hintTier + 1, 3) as 0 | 1 | 2 | 3;
        setState((s) => ({
          ...s,
          incorrectElements: [...s.incorrectElements, elementId],
          wrongAttempts: s.wrongAttempts + 1,
          hintTier: nextTier,
          consecutiveSuccesses: 0,
          consecutiveHints: s.consecutiveHints + 1,
        }));

        // Tier 3: auto-highlight the correct element after a moment
        if (nextTier >= 3) {
          const correctWrong = currentPhase.elements.find(
            (e) => e.isWrong && !state.foundElements.includes(e.id)
          );
          if (correctWrong) {
            setTimeout(() => {
              setState((s) => ({
                ...s,
                highlightedElement: correctWrong.id,
              }));
            }, 500);
          }
        }

        setTimeout(() => {
          setState((s) => ({
            ...s,
            incorrectElements: s.incorrectElements.filter((id) => id !== elementId),
          }));
        }, 600);
      }
    },
    [currentPhase, state.foundElements, state.wrongAttempts, state.hintTier],
  );

  const onCelebrationComplete = useCallback(() => {
    setState((s) => {
      const scenario = activeScenarios[s.currentScenarioIndex];
      const nextPhaseIndex = s.currentPhaseIndex + 1;

      if (scenario && nextPhaseIndex < scenario.phases.length) {
        return {
          ...s,
          currentPhaseIndex: nextPhaseIndex,
          phase: "story",
          highlightedElement: null,
          incorrectElements: [],
          foundElements: [],
          wrongAttempts: 0,
          hintTier: 0,
        };
      }

      const nextScenarioIndex = s.currentScenarioIndex + 1;
      if (nextScenarioIndex < activeScenarios.length) {
        return {
          ...s,
          currentScenarioIndex: nextScenarioIndex,
          currentPhaseIndex: 0,
          phase: "transition",
          highlightedElement: null,
          incorrectElements: [],
          foundElements: [],
          wrongAttempts: 0,
          hintTier: 0,
          stats: { ...s.stats, scenariosCompleted: s.stats.scenariosCompleted + 1 },
        };
      }

      return {
        ...s,
        isComplete: true,
        stats: { ...s.stats, scenariosCompleted: s.stats.scenariosCompleted + 1 },
      };
    });
  }, [activeScenarios]);

  const onTransitionComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "story" }));
  }, []);

  // Tier-based hint text using errorless learning language
  const getHintText = useCallback((): string => {
    if (!currentPhase) return "Take another look around...";
    const { hints } = currentPhase;
    const tier = state.hintTier;
    if (tier <= 1) return hints.attempt1;
    if (tier === 2) return hints.attempt2;
    return hints.attempt3;
  }, [currentPhase, state.hintTier]);

  const getHintTier = useCallback((): 0 | 1 | 2 | 3 => {
    return state.hintTier;
  }, [state.hintTier]);

  const useHint = useCallback(() => {
    const nextTier = Math.min(state.hintTier + 1, 3) as 0 | 1 | 2 | 3;
    setState((s) => ({
      ...s,
      phase: "hint",
      hintTier: nextTier,
      stats: { ...s.stats, hintsUsed: s.stats.hintsUsed + 1 },
      consecutiveHints: s.consecutiveHints + 1,
      consecutiveSuccesses: 0,
    }));
  }, [state.hintTier]);

  const dismissHint = useCallback(() => {
    // Tier 3: auto-advance after dismissing — highlight the answer
    if (state.hintTier >= 3 && currentPhase) {
      const correctWrong = currentPhase.elements.find(
        (e) => e.isWrong && !state.foundElements.includes(e.id)
      );
      if (correctWrong) {
        setState((s) => ({
          ...s,
          phase: "touch",
          highlightedElement: correctWrong.id,
        }));
        return;
      }
    }
    setState((s) => ({ ...s, phase: "touch" }));
  }, [state.hintTier, currentPhase, state.foundElements]);

  const resetGame = useCallback(() => {
    setState({
      currentScenarioIndex: 0,
      currentPhaseIndex: 0,
      phase: "story",
      stats: { ...initialStats },
      highlightedElement: null,
      incorrectElements: [],
      foundElements: [],
      isComplete: false,
      wrongAttempts: 0,
      hintTier: 0,
      consecutiveSuccesses: 0,
      consecutiveHints: 0,
    });
  }, []);

  return {
    state,
    currentScenario,
    currentPhase,
    setPhase,
    onStoryComplete,
    onSpeakComplete,
    onElementTap,
    onCelebrationComplete,
    onTransitionComplete,
    useHint,
    dismissHint,
    resetGame,
    getHintText,
    getHintTier,
  };
}
