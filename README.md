# interview-assistant
interview assistant using groq and SoX (sound exchange file)

Download Sourceforge.net
https://sourceforge.net/projects/sox/files/sox/

Cloned the interview‑assistant repo and created an initial commit of the existing project files.
Added a TypeScript configuration (tsconfig.json) and updated package.json scripts to use tsc for building.
Migrated the original main.js to a new entry point src/app/main.ts.
Created core domain models: src/core/types.ts and src/core/InterviewSession.ts.
Implemented a ContextManager (src/core/ContextManager.ts) to aggregate provider data.
Built a PromptBuilder (src/core/PromptBuilder.ts) with keyword‑based context ranking.
Added LLM integration: new service src/services/LLMService.ts.
Added speech/whisper integration: new service src/services/SpeechService.ts.
Developed provider modules:
src/providers/AudioProvider.ts (audio transcript injection)
src/providers/ResumeProvider.ts (resume data injection)
src/providers/JDProvider.ts (job‑description injection)
src/providers/OCRProvider.ts (screen OCR injection)
src/providers/MemoryProvider.ts (last‑6‑turns memory injection)
src/providers/CompanyProvider.ts (company intel injection)
Created src/app/InterviewController.ts to register all providers, handle IPC (get-answer, transcribe-audio, save‑audio, update-session), and manage conversation flow.
Modified src/app/main.ts to instantiate InterviewController on Electron startup.
Fixed malformed HTML in overlay.html (moved stray <script> out of <kbd> and added proper closing tags).
Added <script> block to overlay.html that loads Electron’s ipcRenderer, defines UI helpers, and persists the Groq API key via localStorage.
Updated UI event handling in overlay.html to use the new IPC calls (ipcRenderer.invoke('get-answer', …)) and to auto‑trigger transcription after recording.
Corrected a TypeScript compile error in InterviewController by replacing the system role with a user message and adding an initial assistant acknowledgment.
Updated task.md to mark Step 5: App Controller & IPC Integration as completed.
Ran npm run build successfully, confirming the project now compiles without errors.
