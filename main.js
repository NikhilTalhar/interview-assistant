const { app, BrowserWindow, ipcMain, screen, globalShortcut, session, systemPreferences } = require('electron');
const path = require('path');
const fs   = require('fs');
const os   = require('os');

let overlayWin = null;

async function requestMicPermission() {
  if (process.platform === 'darwin') {
    const status = systemPreferences.getMediaAccessStatus('microphone');
    if (status !== 'granted') await systemPreferences.askForMediaAccess('microphone');
  }
}

function createOverlay() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWin = new BrowserWindow({
    width: 380, height: 600,
    x: width - 400, y: 60,
    frame: false, transparent: true,
    alwaysOnTop: true, skipTaskbar: false,
    resizable: true, hasShadow: false, focusable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  // Grant ALL permissions including microphone
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(true));
  session.defaultSession.setPermissionCheckHandler(() => true);

  // Strip CSP headers so nothing gets blocked
  session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
    const h = { ...details.responseHeaders };
    delete h['content-security-policy'];
    delete h['Content-Security-Policy'];
    cb({ responseHeaders: h });
  });

  overlayWin.setAlwaysOnTop(true, 'screen-saver');
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWin.loadFile('overlay.html');

  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    overlayWin.isVisible() ? overlayWin.hide() : (overlayWin.show(), overlayWin.focus());
  });

  let minimized = false;
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    minimized = !minimized;
    overlayWin.setSize(380, minimized ? 48 : 600);
  });
}

// ── Save audio blob sent from renderer ──
ipcMain.handle('save-audio', async (_event, { arrayBuffer }) => {
  try {
    const buf     = Buffer.from(arrayBuffer);
    const tmpFile = path.join(os.tmpdir(), 'interview_audio_' + Date.now() + '.webm');
    fs.writeFileSync(tmpFile, buf);
    return { ok: true, filePath: tmpFile };
  } catch(e) {
    return { ok: false, error: e.message };
  }
});

// ── Transcribe via Groq Whisper ──
ipcMain.handle('transcribe-audio', async (_event, { filePath, apiKey }) => {
  // Use dynamic import for node-fetch v3, or require for v2
  let fetch, FormData;
  try {
    fetch    = require('node-fetch');
    FormData = require('form-data');
  } catch(e) {
    return { ok: false, error: 'Missing dependencies. Run: npm install' };
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });
    form.append('model', 'whisper-large-v3-turbo');
    form.append('response_format', 'text');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, ...form.getHeaders() },
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err?.error?.message || 'Whisper error ' + res.status };
    }

    const text = await res.text();
    return { ok: true, text: text.trim() };
  } catch(e) {
    return { ok: false, error: e.message };
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(filePath); } catch(_) {}
  }
});

ipcMain.on('resize', (_e, h) => {
  const [w] = overlayWin.getSize();
  overlayWin.setSize(w, Math.min(Math.max(h, 48), 700));
});
ipcMain.on('close', () => overlayWin.hide());
ipcMain.on('quit',  () => app.quit());

app.whenReady().then(async () => {
  await requestMicPermission();
  createOverlay();
});
app.on('will-quit',         () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
