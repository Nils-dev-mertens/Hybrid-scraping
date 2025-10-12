import path from "path";
import { Worker } from "worker_threads";

const MAX_WORKERS = 4;
let activeWorkers = 0;
const queue: (() => void)[] = [];

function runNext() {
  if (activeWorkers >= MAX_WORKERS || queue.length === 0) return;
  const job = queue.shift();
  job?.();
}


export function executeModule(moduleName: string, value?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const startJob = () => {
      activeWorkers++;

      const workerPath = path.resolve(__dirname, "moduleWorker.js");
      const worker = new Worker(workerPath, {
        workerData: { moduleName, value },
      });

      let settled = false;

      const safeResolve = (data: any) => {
        if (!settled) {
          settled = true;
          resolve(data);
        }
      };

      const safeReject = (err: any) => {
        if (!settled) {
          settled = true;
          reject(err);
        }
      };

      worker.on("message", (msg) => safeResolve(msg));

      worker.on("error", (err) => {
        console.error("❌ Worker error:", err);
        safeReject(err);
      });

      worker.on("exit", (code) => {
        activeWorkers--;
        runNext();
        if (!settled && code !== 0) {
          safeReject(new Error(`Worker exited with code ${code}`));
        }
      });
    };

    queue.push(startJob);
    runNext();
  });
}