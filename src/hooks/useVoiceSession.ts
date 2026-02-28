import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export function useVoiceSession() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [npcReply, setNpcReply] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setVoiceState("listening");
    setTranscript(null);
    setNpcReply(null);

    // Use Web Speech API if available
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

      recognition.onerror = () => {
        setVoiceState("idle");
      };

      recognition.onend = () => {
        // If still listening (no result yet), set idle
        setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
      };

      recognition.start();
      // Store for stopListening
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

  const processWithGemini = useCallback(
    async (text: string, scenarioContext?: string) => {
      setVoiceState("processing");
      try {
        const { data, error } = await supabase.functions.invoke("gemini-voice", {
          body: { transcript: text, scenarioContext },
        });

        if (error) {
          console.error("Gemini function error:", error);
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
      processWithGemini(text, scenarioContext);
    },
    [processWithGemini],
  );

  return {
    voiceState,
    transcript,
    npcReply,
    startListening,
    stopListening,
    submitText,
    processWithGemini,
  };
}
