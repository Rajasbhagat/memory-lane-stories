

## Analysis: Current Voice System

The current system uses **REST API calls**, not WebSockets:
- `gemini-voice` edge function: REST call to Lovable AI gateway for NPC text replies
- `elevenlabs-tts` edge function: REST call to Gemini TTS API for audio
- Browser Web Speech API: for speech-to-text

The Gemini Multimodal Live API requires a persistent WebSocket connection. However, **Lovable Cloud edge functions do not support WebSocket upgrades**, so a direct WebSocket proxy is not possible.

## Proposed Architecture: Streaming Live Conversation

The best approach within platform constraints is a **streaming conversation loop** that feels live and responsive:

```text
User speaks (Web Speech API)
       │
       ▼
Browser sends transcript to edge function
       │
       ▼
Edge function streams AI reply via SSE (Lovable AI gateway)
       │
       ▼
Client renders text token-by-token in speech bubble
       │
       ▼
Once full reply arrives, call TTS edge function for audio
       │
       ▼
Play audio while showing text → user can respond again
```

This creates a **continuous conversation loop** where the user and Johnny go back and forth naturally, not just one exchange per phase.

---

## Implementation Steps

### 1. Create streaming edge function `gemini-voice-stream`
- New edge function at `supabase/functions/gemini-voice-stream/index.ts`
- Uses SSE streaming via Lovable AI gateway (`stream: true`)
- System prompt includes Johnny's persona + full scenario context + conversation history
- Returns streamed tokens so the client can render them live
- Handles 429/402 errors

### 2. Rewrite `useVoiceSession` hook for live conversation
- Add `conversationHistory` state — array of `{role, content}` messages persisted across the session
- New `streamResponse()` method that:
  - Sends full conversation history + new user message to the streaming edge function
  - Parses SSE tokens and updates `npcReply` progressively (token-by-token)
  - Sets state to `speaking` once first token arrives
  - Triggers TTS after full response is received
- Remove the old `processWithGemini` one-shot call
- Add `resetConversation()` to clear history between scenarios

### 3. Update `VoiceControls` for continuous conversation
- Remove the `disabled` prop gating — voice controls are always active during `speak` phase
- Add a "conversation mode" where the mic button re-enables after Johnny finishes speaking
- Show conversation history as a mini chat log (last 2-3 exchanges)
- Auto-start listening after Johnny finishes speaking (optional, with toggle)

### 4. Update `NPCCompanion` for streaming text
- Accept a `streamingText` prop that updates character-by-character as tokens arrive
- Show typing indicator while waiting for first token
- Smooth text appearance animation

### 5. Update `Play.tsx` game loop for multi-turn conversation
- Remove the fixed `setTimeout(onSpeakComplete, 1500)` after one exchange
- Instead, let the conversation continue until:
  - The AI's response includes a signal that the user got the right answer (parsed from response)
  - Or a maximum of 5 exchanges (then auto-advance to touch phase)
- Pass conversation history to the edge function so Johnny remembers what was already discussed
- The AI system prompt instructs Johnny to say "correct" signals when the user identifies the problem

### 6. Update `gemini-voice` system prompt (in the new streaming function)
- Add instruction: when the user correctly identifies the problem, include `[CORRECT]` marker in response
- Add instruction: after 3+ wrong guesses, give increasingly direct hints
- Include the scenario's wrong elements in context so the AI can evaluate answers
- Keep the warm, encouraging Johnny persona

### Files to create/modify:
- **Create**: `supabase/functions/gemini-voice-stream/index.ts`
- **Modify**: `src/hooks/useVoiceSession.ts` — streaming + conversation history
- **Modify**: `src/components/game/VoiceControls.tsx` — continuous conversation UI
- **Modify**: `src/components/game/NPCCompanion.tsx` — streaming text display
- **Modify**: `src/pages/Play.tsx` — multi-turn game loop
- **Modify**: `supabase/config.toml` — register new edge function

