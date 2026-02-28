import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export function useVoiceSession() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [npcReply, setNpcReply] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const startListening = useCallback(() => {
    setVoiceState("listening");
    setTranscript(null);
    setNpcReply(null);
    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setVoiceState("processing");
      };

      recognition.onerror = (event: any) => {
        if (event.error === "not-allowed") {
          setVoiceError("Mic access needed — you can type instead!");
        } else if (event.error === "no-speech") {
          setVoiceError("I didn't catch that — try again or type below.");
        } else {
          setVoiceError("Something went wrong with the mic. Try typing instead.");
        }
        setVoiceState("idle");
      };

      recognition.onend = () => {
        setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
      };

      recognition.start();
      (window as any).__speechRecognition = recognition;
    } else {
      // Fallback: mock after 2s
      setTimeout(() => {
        setTranscript("I see the problem!");
        setVoiceState("processing");
      }, 2000);
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = (window as any).__speechRecognition;
    if (recognition) {
      recognition.stop();
    }
    setVoiceState("processing");
  }, []);

  // Text-to-Speech for NPC narration
  const playNarration = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setVoiceState("speaking");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    utterance.onend = () => {
      setVoiceState("idle");
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setVoiceState("idle");
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopNarration = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setVoiceState("idle");
  }, []);

  const processWithGemini = useCallback(
    async (text: string, scenarioContext?: string) => {
      setVoiceState("processing");
      try {
        const { data, error } = await supabase.functions.invoke("gemini-voice", {
          body: { transcript: text, scenarioContext },
        });

        if (error) {
          console.error("AI function error:", error);
          setNpcReply("Hmm, I didn't quite catch that. Try again?");
        } else {
          setNpcReply(data.reply);
        }
      } catch (e) {
        console.error("Voice processing error:", e);
        setNpcReply("Hmm, let me think about that...");
      }
      setVoiceState("idle");
    },
    [],
  );

  const submitText = useCallback(
    (text: string, scenarioContext?: string) => {
      setTranscript(text);
      setVoiceError(null);
      processWithGemini(text, scenarioContext);
    },
    [processWithGemini],
  );

  const clearError = useCallback(() => {
    setVoiceError(null);
  }, []);

  return {
    voiceState,
    transcript,
    npcReply,
    voiceError,
    startListening,
    stopListening,
    submitText,
    processWithGemini,
    playNarration,
    stopNarration,
    clearError,
  };
}
