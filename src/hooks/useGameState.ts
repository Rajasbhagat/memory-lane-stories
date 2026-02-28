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
}

const initialStats: GameStats = {
  scenariosCompleted: 0,
  mistakesSpotted: 0,
  hintsUsed: 0,
};

export function useGameState() {
  const [state, setState] = useState<GameState>({
    currentScenarioIndex: 0,
    currentPhaseIndex: 0,
    phase: "story",
    stats: { ...initialStats },
    highlightedElement: null,
    incorrectElements: [],
    foundElements: [],
    isComplete: false,
  });

  const currentScenario: Scenario | undefined = scenarios[state.currentScenarioIndex];
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
        setState((s) => ({
          ...s,
          incorrectElements: [...s.incorrectElements, elementId],
        }));
        setTimeout(() => {
          setState((s) => ({
            ...s,
            incorrectElements: s.incorrectElements.filter((id) => id !== elementId),
          }));
        }, 600);
      }
    },
    [currentPhase, state.foundElements],
  );

  const onCelebrationComplete = useCallback(() => {
    setState((s) => {
      const scenario = scenarios[s.currentScenarioIndex];
      const nextPhaseIndex = s.currentPhaseIndex + 1;

      if (scenario && nextPhaseIndex < scenario.phases.length) {
        return {
          ...s,
          currentPhaseIndex: nextPhaseIndex,
          phase: "story",
          highlightedElement: null,
          incorrectElements: [],
          foundElements: [],
        };
      }

      const nextScenarioIndex = s.currentScenarioIndex + 1;
      if (nextScenarioIndex < scenarios.length) {
        return {
          ...s,
          currentScenarioIndex: nextScenarioIndex,
          currentPhaseIndex: 0,
          phase: "transition",
          highlightedElement: null,
          incorrectElements: [],
          foundElements: [],
          stats: { ...s.stats, scenariosCompleted: s.stats.scenariosCompleted + 1 },
        };
      }

      return {
        ...s,
        isComplete: true,
        stats: { ...s.stats, scenariosCompleted: s.stats.scenariosCompleted + 1 },
      };
    });
  }, []);

  const onTransitionComplete = useCallback(() => {
    setState((s) => ({ ...s, phase: "story" }));
  }, []);

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
  };
}
