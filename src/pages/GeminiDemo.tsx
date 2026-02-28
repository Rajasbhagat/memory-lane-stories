import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ANIMATION } from "@/config/accessibility.config";

import { PipecatClient } from "@pipecat-ai/client-js";
import { GeminiLiveWebsocketTransport } from "@pipecat-ai/gemini-live-websocket-transport";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: ANIMATION.DURATION_NORMAL / 1000, ease: ANIMATION.EASING } },
};

export default function GeminiDemo() {
    const [pcClient, setPcClient] = useState<PipecatClient | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    useEffect(() => {
        if (!apiKey) {
            setError("VITE_GOOGLE_API_KEY is missing in your .env.local file.");
            return;
        }

        const transport = new GeminiLiveWebsocketTransport({
            api_key: apiKey,
            model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
            initial_messages: [
                {
                    role: "model",
                    content: "You are a helpful and very brief voice assistant. Keep answers to one sentence.",
                },
                { role: "user", content: "Hello!" },
            ],
            settings: {
                response_modalities: "audio",
                speech_config: {
                    voice_config: {
                        prebuilt_voice_config: {
                            voice_name: "Puck"
                        }
                    }
                }
            }
        });

        const client = new PipecatClient({
            transport,
        });

        client.on("connected", () => {
            console.log("Connected to Gemini Live");
            setIsConnected(true);
            setError(null);
        });

        client.on("disconnected", () => {
            console.log("Disconnected from Gemini Live");
            setIsConnected(false);
            setIsBotSpeaking(false);
            setIsUserSpeaking(false);
        });

        client.on("botStartedSpeaking", () => {
            setIsBotSpeaking(true);
        });

        client.on("botStoppedSpeaking", () => {
            setIsBotSpeaking(false);
        });

        client.on("localAudioLevel", (level: number) => {
            setIsUserSpeaking(level > 0.05);
        });

        client.on("error", (e) => {
            console.error("Pipecat error:", e);
            setError("Connection error. See console for details.");
            setIsConnected(false);
        });

        setPcClient(client);

        return () => {
            client.disconnect();
        };
    }, [apiKey]);

    const handleToggleConnect = async () => {
        if (!pcClient) return;

        if (isConnected) {
            await pcClient.disconnect();
        } else {
            try {
                await pcClient.connect();
            } catch (e: any) {
                console.error(e);
                setError(e.message || "Failed to connect");
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            className="flex min-h-screen items-center justify-center bg-background px-6 py-10"
        >
            <motion.div variants={fadeUp} className="w-full max-w-lg">
                <div className="mb-6 flex items-center justify-between">
                    <Link to="/" className="text-primary hover:underline font-medium">
                        &larr; Back to Home
                    </Link>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                </div>

                <Card className="border-2 border-primary/20 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isBotSpeaking ? 'bg-primary/20 scale-110' : 'bg-secondary'}`}>
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-primary text-primary-foreground transition-transform duration-300 ${isBotSpeaking ? 'scale-110' : ''}`}>
                                <span className="text-4xl">🤖</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold mb-2">Gemini Live Demo</h1>
                            <p className="text-muted-foreground">
                                Connect and speak to Gemini Multimodal Live API directly from your browser.
                            </p>
                        </div>

                        {error ? (
                            <div className="flex items-start gap-3 bg-destructive/10 text-destructive p-4 rounded-xl text-left w-full">
                                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        ) : (
                            <div className="flex w-full items-center justify-between bg-secondary/50 p-4 rounded-xl">
                                <span className="text-sm font-medium text-muted-foreground">Your Microphone</span>
                                {isUserSpeaking ? (
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                        </span>
                                        <span className="text-sm font-bold">Detecting audio...</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">Quiet</span>
                                )}
                            </div>
                        )}

                        <Button
                            size="lg"
                            className={`w-full text-lg mt-4 ${isConnected ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                            onClick={handleToggleConnect}
                            disabled={!apiKey}
                        >
                            {isConnected ? (
                                <>
                                    <MicOff className="w-5 h-5 mr-2" />
                                    Disconnect
                                </>
                            ) : (
                                <>
                                    <Mic className="w-5 h-5 mr-2" />
                                    Connect to Gemini
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
