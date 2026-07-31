import { spawn } from 'node:child_process';
import net from 'node:net';

const SYNC_PORT = Number(process.env.IHOMECARE_SYNC_PORT || 5199);

function isPortInUse(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', () => resolve(true));
    probe.once('listening', () => {
      probe.close(() => resolve(false));
    });
    probe.listen(port, '0.0.0.0');
  });
}

function startVite() {
  return spawn('npm', ['run', 'dev:vite'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  });
}

function shutdown(code = 0) {
  if (hfWatcher?.pid) hfWatcher.kill('SIGTERM');
  if (sync?.pid) sync.kill('SIGTERM');
  if (vite?.pid) vite.kill('SIGTERM');
  process.exit(code);
}

let sync = null;
let vite = null;
let hfWatcher = null;

async function main() {
  const syncPortBusy = await isPortInUse(SYNC_PORT);

  if (syncPortBusy) {
    console.log(`sync server already listening on :${SYNC_PORT} — reusing existing relay`);
  } else {
    sync = spawn(process.execPath, ['scripts/sync-server.mjs'], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    sync.on('exit', (code) => {
      if (code && code !== 0) {
        console.warn(`sync server exited (${code}) — Vite keeps running; same-browser sync still works`);
      }
    });
  }

  vite = startVite();

  // Start HyperFrames sync watcher — auto-updates roadshow-hyperframes.html on src/ changes
  hfWatcher = spawn(process.execPath, ['scripts/hyperframes-sync.mjs', '--watch'], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  hfWatcher.on('exit', (code) => {
    if (code && code !== 0) {
      console.warn(`hyperframes watcher exited (${code}) — Vite keeps running`);
    }
  });

  process.on('SIGINT', () => shutdown(0));
  process.on('SIGTERM', () => shutdown(0));

  vite.on('exit', (code) => {
    shutdown(code ?? 0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
