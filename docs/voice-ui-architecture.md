# MindSet — Voice UI Architecture

## Overview

The voice system enables a **Talk-then-Touch** interaction pattern:
1. Johnny (NPC) speaks a narrative via text-to-speech or typed text
2. User responds verbally (or via text fallback)
3. System processes response → advances game state

Built with a **mock-first** approach: all voice interactions work with simulated delays and hardcoded responses. The architecture is structured for drop-in replacement with the **Gemini Live API** via WebSocket.

---

## `useVoiceSession` Hook

### Interface

```typescript
interface UseVoiceSessionReturn {
  // State
  state: VoiceState;
  transcript: string | null;
  npcText: string | null;
  isNPCTyping: boolean;
  error: string | null;

  // Actions
  startListening: () => void;
  stopListening: () => void;
  playNarration: (text: string) => void;
  stopNarration: () => void;
  reset: () => void;

  // Config
  isMockMode: boolean;
}

type VoiceState = 
  | 'idle'           // No activity
  | 'listening'      // Mic active, capturing audio
  | 'processing'     // Sending to API, waiting for response
  | 'speaking'       // NPC is narrating (TTS or typed)
  | 'error';         // Something went wrong

interface VoiceSessionConfig {
  mockMode?: boolean;          // Default: true (for MVP)
  onTranscript?: (text: string) => void;
  onNPCResponse?: (text: string) => void;
  onStateChange?: (state: VoiceState) => void;
  geminiApiKey?: string;       // For live mode
  geminiModel?: string;        // Default: 'gemini-2.0-flash-exp'
}
```

### Usage

```tsx
const {
  state,
  transcript,
  npcText,
  isNPCTyping,
  startListening,
  stopListening,
  playNarration,
} = useVoiceSession({
  mockMode: true,
  onTranscript: (text) => {
    // User said something — evaluate and advance game
    gameState.handleUserResponse(text);
  },
});
```

---

## State Machine

```
                    ┌──────────┐
                    │   idle   │ ← reset()
                    └────┬─────┘
                         │
              startListening()
                         │
                         ▼
                    ┌──────────┐
                    │listening │ ── user speaks ──┐
                    └────┬─────┘                  │
                         │                        │
              stopListening()              auto-detect
                         │                  silence
                         ▼                        │
                    ┌──────────┐                  │
                    │processing│ ◄────────────────┘
                    └────┬─────┘
                         │
                   API response
                         │
                         ▼
                    ┌──────────┐
                    │ speaking │ ── narration complete ──► idle
                    └──────────┘

        Any state ──── error ────► ┌───────┐
                                   │ error │ ── reset() ──► idle
                                   └───────┘
```

---

## Mock Mode Implementation

In mock mode (MVP default), the hook simulates all voice interactions:

### `startListening()` (mock)
1. Set state → `listening`
2. After 2-3 seconds (simulated listening), auto-transition to `processing`
3. Set transcript to a hardcoded response based on current scenario

### Mock Transcripts by Scenario

```typescript
const mockTranscripts: Record<string, string> = {
  'scenario-1': "I think the battery is in the wrong kit",
  'scenario-2': "The kettle is still turned on",
  'scenario-3-route': "Take the main road, it's the fastest",
  'scenario-3-street': "That coffee shop is a distraction",
  'scenario-3-envelope': "Envelope A matches the case number and officer name",
};
```

### `playNarration()` (mock)
1. Set state → `speaking`
2. Set `isNPCTyping` → true
3. Display text character by character (typing effect, ~40ms per char)
4. On complete: `isNPCTyping` → false, state → `idle`

### Mock Timing

| Action | Duration |
|--------|----------|
| Listening simulation | 2000-3000ms |
| Processing simulation | 800-1200ms |
| Typing speed | 40ms per character |
| Post-narration pause | 1500ms |

---

## Gemini Live API Integration (Future)

### Connection Setup

```typescript
// WebSocket connection to Gemini Live API
const GEMINI_WS_URL = 'wss://generativelanguage.googleapis.com/ws';

interface GeminiLiveConfig {
  model: 'gemini-2.0-flash-exp';
  systemInstruction: string;  // Johnny's persona + scenario context
  tools: [];                  // No function calling needed
  speechConfig: {
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: 'Kore' | 'Puck' | 'Charon';  // Warm, friendly voice
      };
    };
  };
}
```

### System Prompt (Johnny Persona)

```
You are Johnny, a friendly and warm detective character in a cognitive exercise game for older adults.

Your role:
- Narrate scenarios in a warm, encouraging tone
- Never be clinical or condescending
- Give gentle hints when the user is stuck
- Celebrate successes enthusiastically but naturally
- Keep responses short (1-2 sentences max)
- Use the user's name when you know it

Current scenario context will be provided per turn.
```

### WebSocket Message Flow

```
Client → Server: BidiGenerateContentSetup
  { model, systemInstruction, speechConfig }

Client → Server: BidiGenerateContentClientContent
  { turns: [{ role: "user", parts: [{ text: userTranscript }] }] }

Server → Client: BidiGenerateContentServerContent
  { modelTurn: { parts: [{ text: responseText }] } }

Server → Client: BidiGenerateContentServerContent
  { modelTurn: { parts: [{ inlineData: { mimeType: "audio/pcm", data: base64Audio } }] } }
```

### Audio Handling

```typescript
// Input: MediaRecorder API
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus'
});

// Output: Web Audio API for PCM playback
const audioContext = new AudioContext({ sampleRate: 24000 });
// Decode base64 PCM → AudioBuffer → play
```

### Swap Strategy

The `useVoiceSession` hook is designed so swapping from mock to live requires:

1. Replace `startListening()` internals:
   - Mock: setTimeout simulation
   - Live: `navigator.mediaDevices.getUserMedia()` + MediaRecorder → WebSocket

2. Replace `processing` handler:
   - Mock: hardcoded transcript lookup
   - Live: send audio chunks via WebSocket, receive transcript

3. Replace `playNarration()` internals:
   - Mock: character-by-character typing effect
   - Live: receive audio PCM data, play via AudioContext + show text

4. Everything else (state machine, callbacks, UI bindings) stays identical.

---

## UI Components for Voice

### Mic Button

```
┌─────────────────┐
│                  │
│    ┌────────┐   │
│    │  🎤    │   │   64px circle
│    │        │   │   Sage green bg when idle
│    └────────┘   │   Pulsing green ring when listening
│                  │   Coral bg when processing
│  "Tap to speak"  │   Disabled when speaking
│                  │
└─────────────────┘
```

### Waveform Visualizer

- Horizontal bar below mic button
- 20-30 vertical bars, heights animated
- Active during `listening` and `speaking` states
- Heights driven by:
  - Mock: random animation (sine wave pattern)
  - Live: `AnalyserNode.getByteFrequencyData()`

### Text Fallback Input

- Always visible below waveform
- Placeholder: "Or type your answer here..."
- Submit on Enter key
- Same flow as voice: text goes through `onTranscript` callback
- Helpful for users who prefer typing or have mic issues

---

## Error Handling

| Error | User Sees | Recovery |
|-------|-----------|----------|
| Mic permission denied | "Mic access needed — you can type instead!" | Text fallback always works |
| WebSocket disconnect | "Connection lost, reconnecting..." | Auto-retry 3x, then fallback to mock |
| No speech detected | "I didn't catch that — try again or type below" | Reset to idle |
| API rate limit | Silent fallback to mock mode | User unaware |

**Principle:** Voice is an enhancement, never a blocker. The text fallback ensures the game is always playable.
