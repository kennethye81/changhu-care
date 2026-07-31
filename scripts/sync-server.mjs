import { WebSocketServer } from 'ws';
import { mergeDemoSyncPayload } from './sync-merge.mjs';

const PORT = Number(process.env.IHOMECARE_SYNC_PORT || 5199);
let currentState = null;

const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });

function broadcast(message) {
  const raw = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(raw);
  }
}

wss.on('connection', (ws) => {
  if (currentState) {
    ws.send(JSON.stringify({ type: 'sync', payload: currentState }));
  }

  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(String(raw));
      if (message?.type !== 'sync' || !message.payload) return;
      currentState = mergeDemoSyncPayload(currentState, message.payload);
      broadcast({ type: 'sync', payload: currentState });
    } catch {
      // ignore malformed payloads
    }
  });
});

console.log(`ihomecare sync server listening on ws://0.0.0.0:${PORT}`);
