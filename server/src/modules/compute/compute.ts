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

export function executeModule(moduleName: string): Promise<boolean> {
  return new Promise((resolve) => {
    const startJob = () => {
      activeWorkers++;
      const workerPath = path.resolve(__dirname, "moduleWorker.js");
      const worker = new Worker(workerPath, { workerData: { moduleName } });

      worker.on("message", (msg) => resolve(msg.success));
      worker.on("error", () => resolve(false));
      worker.on("exit", (code) => {
        activeWorkers--;
        runNext();
        if (code !== 0) resolve(false);
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