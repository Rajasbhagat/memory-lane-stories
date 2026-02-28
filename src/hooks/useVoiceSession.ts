import { useState, useCallback, useRef } from "react";

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
  view.setUint16(20, 1, true);
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

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export function useVoiceSession() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [npcReply, setNpcReply] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [pendingVoiceTranscript, setPendingVoiceTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Gemini TTS — warm Sulafat voice
  const playNarration = useCallback(async (text: string) => {
    setVoiceState("speaking");

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

      if (!response.ok) {
        console.warn("Gemini TTS failed, falling back to browser TTS");
        fallbackTTS(text);
        return;
      }

      const data = await response.json();
      if (!data.audioContent) {
        console.warn("No audio content, falling back to browser TTS");
        fallbackTTS(text);
        return;
      }

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
      console.warn("TTS error, falling back:", e);
      fallbackTTS(text);
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

  // Stream response from AI with conversation history
  const streamResponse = useCallback(
    async (userText: string, scenarioContext?: string) => {
      setVoiceState("processing");
      setIsCorrect(false);

      const newUserMsg: ConversationMessage = { role: "user", content: userText };
      const updatedHistory = [...conversationHistory, newUserMsg];
      setConversationHistory(updatedHistory);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-voice-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: updatedHistory,
              scenarioContext,
            }),
            signal: controller.signal,
          }
        );

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) {
            setVoiceError("Too many requests — wait a moment and try again.");
          } else if (resp.status === 402) {
            setVoiceError("AI credits needed — please add credits.");
          } else {
            setVoiceError("Something went wrong. Try again?");
          }
          setVoiceState("idle");
          return;
        }

        // Parse SSE stream token-by-token
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let fullReply = "";
        let streamDone = false;
        let firstToken = true;

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                if (firstToken) {
                  setVoiceState("speaking");
                  firstToken = false;
                }
                fullReply += content;
                // Update npcReply progressively (strip [CORRECT] marker for display)
                setNpcReply(fullReply.replace(/\[CORRECT\]/gi, "").trim());
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Final flush
        if (textBuffer.trim()) {
          for (let raw of textBuffer.split("\n")) {
            if (!raw) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            if (raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                fullReply += content;
                setNpcReply(fullReply.replace(/\[CORRECT\]/gi, "").trim());
              }
            } catch { /* ignore */ }
          }
        }

        // Check for [CORRECT] marker
        const correct = /\[CORRECT\]/i.test(fullReply);
        setIsCorrect(correct);

        // Add assistant reply to conversation history
        const cleanReply = fullReply.replace(/\[CORRECT\]/gi, "").trim();
        setConversationHistory(prev => [...prev, { role: "assistant", content: cleanReply }]);

        // Play TTS for the reply
        if (cleanReply) {
          await playNarration(cleanReply);
        } else {
          setVoiceState("idle");
        }
      } catch (e: any) {
        if (e.name === "AbortError") return;
        console.error("Stream error:", e);
        setNpcReply("Hmm, let me think about that...");
        setVoiceState("idle");
      }
    },
    [conversationHistory, playNarration],
  );

  const startListening = useCallback(() => {
    setVoiceState("listening");
    setTranscript(null);
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
        setPendingVoiceTranscript(true);
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

  const submitText = useCallback(
    (text: string, scenarioContext?: string) => {
      setTranscript(text);
      setVoiceError(null);
      streamResponse(text, scenarioContext);
    },
    [streamResponse],
  );

  const clearError = useCallback(() => {
    setVoiceError(null);
  }, []);

  const resetConversation = useCallback(() => {
    setConversationHistory([]);
    setNpcReply(null);
    setTranscript(null);
    setIsCorrect(false);
    setVoiceError(null);
    setVoiceState("idle");
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  return {
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
    stopNarration,
    clearError,
    resetConversation,
  };
}
