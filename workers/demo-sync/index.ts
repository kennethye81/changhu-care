import { SyncRoom } from './sync-room';

export { SyncRoom };

export interface Env {
  SYNC_ROOM: DurableObjectNamespace<SyncRoom>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.SYNC_ROOM.idFromName('ihomecare-demo');
    return env.SYNC_ROOM.get(id).fetch(request);
  },
};
