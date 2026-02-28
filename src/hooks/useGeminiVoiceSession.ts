import { useState, useCallback, useRef, useEffect } from "react";
import { PipecatClient, BotTTSTextData } from "@pipecat-ai/client-js";
import { GeminiLiveWebsocketTransport } from "@pipecat-ai/gemini-live-websocket-transport";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export interface ConversationMessage {
    role: "user" | "assistant";
    content: string;
}

export function useGeminiVoiceSession(
    scenarioContext: string,
    narrative: string,
    playerName: string,
    wrongElements: string[]
) {
    const [voiceState, setVoiceState] = useState<VoiceState>("idle");
    const [transcript, setTranscript] = useState<string | null>(null);
    const [npcReply, setNpcReply] = useState<string | null>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [pendingVoiceTranscript, setPendingVoiceTranscript] = useState(false);
    const pcClientRef = useRef<PipecatClient | null>(null);
    const npcReplyRef = useRef<string>("");
    const wrongElementsRef = useRef<string[]>(wrongElements);

    // Keep wrongElementsRef in sync without triggering effect re-runs
    useEffect(() => {
        wrongElementsRef.current = wrongElements;
    }, [wrongElements]);

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    // Build and initialize Pipecat Client once per scenario/phase
    useEffect(() => {
        if (!apiKey || !scenarioContext || !narrative) return;

        const systemPrompt = `You are Detective Johnny, a hard-boiled but friendly detective talking to your partner ${playerName}.

Start by narrating this scene: "${narrative}"

Then wait for the user to respond. They need to find what is wrong in the scene.

Context: ${scenarioContext}

When the user makes a guess, respond naturally — encourage them if wrong, congratulate them if right. You will be told explicitly via a [RESULT] message whether their answer was correct or not. React accordingly.

Keep responses brief and conversational.`;

        const transport = new GeminiLiveWebsocketTransport({
            api_key: apiKey,
            model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
            initial_messages: [
                { role: "user", content: systemPrompt }
            ] as any,
            settings: {
                response_modalities: "audio",
                speech_config: {
                    voice_config: {
                        prebuilt_voice_config: {
                            voice_name: "Puck",
                        },
                    },
                },
            },
        });

        const client = new PipecatClient({ transport, enableMic: true });

        client.on("connected", () => {
            console.log("[Gemini] Connected");
            setIsConnected(true);
            setVoiceState("idle");
            setVoiceError(null);
        });

        client.on("disconnected", () => {
            console.log("[Gemini] Disconnected");
            setIsConnected(false);
            setIsUserSpeaking(false);
            setVoiceState("idle");
        });

        client.on("botStartedSpeaking", () => {
            setVoiceState("speaking");
        });

        client.on("botStoppedSpeaking", () => {
            if (npcReplyRef.current) {
                const fullReply = npcReplyRef.current;
                setConversationHistory(prev => [...prev, { role: "assistant", content: fullReply }]);
                npcReplyRef.current = "";
            }
            setVoiceState("idle");
        });

        client.on("userStartedSpeaking", () => {
            setIsUserSpeaking(true);
            setVoiceState("listening");
        });

        client.on("userStoppedSpeaking", () => {
            setIsUserSpeaking(false);
            setVoiceState("processing");
        });

        client.on("userTranscript", (data: any) => {
            if (data.text && data.final) {
                const userText = data.text as string;
                setTranscript(userText);
                setConversationHistory(prev => [...prev, { role: "user", content: userText }]);

                // Client-side answer checking against wrong elements
                const guess = userText.toLowerCase();
                const isMatch = wrongElementsRef.current.some(el => {
                    const elLower = el.toLowerCase();
                    const words = elLower.split(/\s+/);
                    return words.some(word => word.length > 3 && guess.includes(word)) || guess.includes(elLower);
                });

                if (isMatch) {
                    console.log("[check_answer] CORRECT — match in:", userText);
                    setIsCorrect(true);
                    // Tell Gemini the answer was correct so it can respond naturally
                    if ((client.transport as any)._sendTextInput) {
                        (client.transport as any)._sendTextInput(
                            `[RESULT: CORRECT] The user correctly identified the issue. Congratulate them warmly and confirm they found it.`,
                            "user",
                            true
                        );
                    }
                } else {
                    console.log("[check_answer] INCORRECT — no match in:", userText);
                    // Tell Gemini the answer was wrong so it can respond naturally
                    if ((client.transport as any)._sendTextInput) {
                        (client.transport as any)._sendTextInput(
                            `[RESULT: INCORRECT] The user's guess was wrong. Encourage them to keep looking and give a subtle hint.`,
                            "user",
                            true
                        );
                    }
                }
            }
        });

        client.on("botTtsText", (data: BotTTSTextData) => {
            if (data.text) {
                npcReplyRef.current += data.text;
                setNpcReply(npcReplyRef.current);
            }
        });

        client.on("error", (e) => {
            console.error("[Gemini] Error:", e);
            setVoiceError("Connection error. Please try reconnecting.");
            setVoiceState("idle");
        });

        pcClientRef.current = client;

        return () => {
            if (client.transport?.state !== "disconnected") {
                client.disconnect().catch(() => { });
            }
            pcClientRef.current = null;
        };
        // intentionally exclude wrongElements — we use wrongElementsRef instead
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, scenarioContext, narrative, playerName]);

    const connectSession = useCallback(async () => {
        const client = pcClientRef.current;
        if (!client) return;
        setVoiceState("processing");
        npcReplyRef.current = "";
        setNpcReply(null);
        setIsCorrect(false);
        try {
            await client.connect();
        } catch (e) {
            console.error("[Gemini] connect failed:", e);
            setVoiceError("Failed to connect to AI voice.");
            setVoiceState("idle");
        }
    }, []);

    const disconnectSession = useCallback(() => {
        const client = pcClientRef.current;
        if (client && client.transport?.state !== "disconnected") {
            client.disconnect().catch(() => { });
        }
        setIsConnected(false);
        setIsUserSpeaking(false);
        setVoiceState("idle");
    }, []);

    const clearError = useCallback(() => setVoiceError(null), []);

    const resetConversation = useCallback(() => {
        setConversationHistory([]);
        setNpcReply(null);
        setTranscript(null);
        setIsCorrect(false);
        setVoiceError(null);
        npcReplyRef.current = "";
        setVoiceState("idle");
    }, []);

    const playNarration = connectSession;
    const stopNarration = disconnectSession;
    const startListening = useCallback(() => { }, []);
    const stopListening = useCallback(() => { }, []);
    const submitText = useCallback((_text: string) => { }, []);
    const streamResponse = useCallback((_text: string) => { }, []);

    // Send a text message to Gemini (e.g. to trigger congratulations on correct tap)
    const sendTextToGemini = useCallback((text: string) => {
        const client = pcClientRef.current;
        if (!client) return;
        const transport = client.transport as any;
        if (transport?._sendTextInput) {
            transport._sendTextInput(text, "user", true);
        }
    }, []);

    return {
        voiceState,
        transcript,
        npcReply,
        voiceError,
        conversationHistory,
        isCorrect,
        isConnected,
        isUserSpeaking,
        pendingVoiceTranscript,
        setPendingVoiceTranscript,
        startListening,
        stopListening,
        submitText,
        streamResponse,
        playNarration,
        stopNarration,
        connectSession,
        disconnectSession,
        sendTextToGemini,
        clearError,
        resetConversation,
    };
}
