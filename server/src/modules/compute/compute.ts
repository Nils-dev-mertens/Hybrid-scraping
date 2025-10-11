import fs from "fs-extra";
import {generateRandomString} from "../../utils/string"
import { Worker } from "worker_threads";
import path from "path";

const MAX_WORKERS = 4;
let activeWorkers = 0;
const queue: (() => void)[] = [];

function runNext() {
  if (activeWorkers < MAX_WORKERS && queue.length > 0) {
    const job = queue.shift();
    job && job();
  }
}
export function executeModule(moduleName: string): Promise<any> {
  return new Promise((resolve) => {
    const startJob = () => {
      activeWorkers++;
      const workerPath = path.resolve(__dirname, "moduleWorker.js");
      const worker = new Worker(workerPath, { workerData: { moduleName } });

      let resolved = false; // prevent double resolve

      worker.on("message", (msg) => {
        if (!resolved) {
          resolved = true;
          resolve(msg);
        }
      });

      worker.on("error", (err) => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: String(err) });
        }
      });

      worker.on("exit", (code) => {
        activeWorkers--;
        runNext();
        // Only resolve if we haven't already
        if (!resolved && code !== 0) {
          resolved = true;
          resolve({ success: false, error: `Worker exited with code ${code}` });
        }
      });
    };

    queue.push(startJob);
    runNext();
  });
}


export async function createNewModule(context:string):Promise<string>{
    const fileString = generateRandomString(20);
    await fs.writeFile(`./src/modules/storage/${fileString}.ts`, context, "utf-8");
    return fileString;
}