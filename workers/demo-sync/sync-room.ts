import { DurableObject } from 'cloudflare:workers';
import { mergeDemoSyncPayload, type DemoSyncPayload } from './merge';

const STATE_KEY = 'currentState';

export class SyncRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('iHomeCare demo sync — WebSocket only', {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.ctx.acceptWebSocket(server);

    const currentState = await this.ctx.storage.get<DemoSyncPayload>(STATE_KEY);
    if (currentState) {
      server.send(JSON.stringify({ type: 'sync', payload: currentState }));
    }

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    try {
      const parsed = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message));
      if (parsed?.type !== 'sync' || !parsed.payload) return;

      const currentState = await this.ctx.storage.get<DemoSyncPayload>(STATE_KEY);
      const merged = mergeDemoSyncPayload(currentState ?? null, parsed.payload as DemoSyncPayload);
      await this.ctx.storage.put(STATE_KEY, merged);

      const raw = JSON.stringify({ type: 'sync', payload: merged });
      for (const socket of this.ctx.getWebSockets()) {
        socket.send(raw);
      }
    } catch {
      // ignore malformed payloads
    }
  }
}
