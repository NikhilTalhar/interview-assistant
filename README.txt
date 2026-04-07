======================================
 INTERVIEW ASSISTANT - SETUP GUIDE
======================================

QUICK START
-----------
1. Install Node.js from https://nodejs.org (LTS version)
2. Double-click SETUP.bat  (installs everything)
3. Double-click START.bat  (launches the app)
4. Get your FREE Groq API key:
   → https://console.groq.com/keys
   → Sign up free → Create API Key → paste it in the app

VOICE MODE (uses Groq Whisper - no browser speech API)
-------------------------------------------------------
Requires SoX to be installed:
  Windows: https://sourceforge.net/projects/sox/files/sox/
           Download latest .exe → install → check "Add to PATH"
  Mac:     brew install sox
  Linux:   sudo apt install sox

Steps:
  1. Click "Record Question" → speak clearly
  2. Click "Stop Recording"
  3. Click "Get Answer" → Whisper transcribes, LLaMA answers

TYPE MODE (no SoX needed, always works)
----------------------------------------
Just paste or type the question and press Ctrl+Enter.
Use this if voice is not working.

KEYBOARD SHORTCUTS
------------------
Ctrl+Shift+Space  →  Show / Hide overlay
Ctrl+Shift+M      →  Minimize to thin bar
Ctrl+Enter        →  Submit typed question

WHY THIS VERSION IS BETTER
---------------------------
- Does NOT use browser Speech Recognition (which was causing "network error")
- Uses Groq's Whisper API for transcription (same key, still free)
- Works behind corporate firewalls and VPNs
