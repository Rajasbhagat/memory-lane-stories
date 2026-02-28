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
  wrongAttempts: number; // track wrong taps for hint escalation
}

const initialStats: GameStats = {
  scenariosCompleted: 0,
  mistakesSpotted: 0,
  hintsUsed: 0,
};

export function useGameState(scenarioIndex?: number) {
  // Filter to single scenario if specified
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
        setState((s) => ({
          ...s,
          foundElements: [...s.foundElements, elementId],
          highlightedElement: elementId,
          stats: { ...s.stats, mistakesSpotted: s.stats.mistakesSpotted + 1 },
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
        // Wrong tap — increment wrongAttempts for hint escalation
        setState((s) => ({
          ...s,
          incorrectElements: [...s.incorrectElements, elementId],
          wrongAttempts: s.wrongAttempts + 1,
        }));

        // On 3+ wrong attempts, auto-highlight the correct element
        if (state.wrongAttempts + 1 >= 3) {
          const correctWrong = currentPhase.elements.find(
            (e) => e.isWrong && !state.foundElements.includes(e.id)
          );
          if (correctWrong) {
            setState((s) => ({
              ...s,
              highlightedElement: correctWrong.id,
            }));
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
    [currentPhase, state.foundElements, state.wrongAttempts],
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

  // Hint escalation: returns the appropriate hint text based on wrongAttempts
  const getHintText = useCallback((): string => {
    if (!currentPhase) return "Look more carefully...";
    const { hints } = currentPhase;
    if (state.wrongAttempts <= 1) return hints.attempt1;
    if (state.wrongAttempts === 2) return hints.attempt2;
    return hints.attempt3;
  }, [currentPhase, state.wrongAttempts]);

  const useHint = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: "hint",
      stats: { ...s.stats, hintsUsed: s.stats.hintsUsed + 1 },
    }));
  }, []);

  const dismissHint = useCallback(() => {
    setState((s) => ({ ...s, phase: "touch" }));
  }, []);

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
  };
}
