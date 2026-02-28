import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Convert raw PCM bytes to a valid WAV ArrayBuffer for browser playback */
function pcmToWav(pcmData: Uint8Array, sampleRate: number, channels: number, bitDepth: number): ArrayBuffer {
  const byteRate = sampleRate * channels * (bitDepth / 8);
  const blockAlign = channels * (bitDepth / 8);
  const dataSize = pcmData.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  new Uint8Array(buffer, 44).set(pcmData);
  return buffer;
}

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export function useVoiceSession() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [npcReply, setNpcReply] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gemini TTS — warm Sulafat voice
  const playNarration = useCallback(async (text: string) => {
    setVoiceState("speaking");

    // Start browser TTS immediately for zero-latency playback
    fallbackTTS(text);

    // Fetch Gemini audio in background — if it arrives, swap to it
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      if (!data.audioContent) return;

      // Stop browser TTS and play Gemini audio instead
      window.speechSynthesis?.cancel();

      const pcmBytes = Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0));
      const wavBuffer = pcmToWav(pcmBytes, 24000, 1, 16);
      const audioBlob = new Blob([wavBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setVoiceState("idle");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setVoiceState("idle");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (e) {
      // Browser TTS already playing, so just log
      console.warn("Gemini TTS background fetch failed:", e);
    }
  }, []);

  // Browser TTS fallback
  const fallbackTTS = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) {
      setVoiceState("idle");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.lang = "en-US";

    // Try to pick a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) => v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Karen")
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onend = () => setVoiceState("idle");
    utterance.onerror = () => setVoiceState("idle");
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopNarration = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setVoiceState("idle");
  }, []);

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
