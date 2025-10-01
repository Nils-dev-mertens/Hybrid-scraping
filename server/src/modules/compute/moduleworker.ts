import { parentPort, workerData } from "worker_threads";

(async () => {
  try {
    // Dynamically import from storage folder
    const mod = await import(`../storage/${workerData.moduleName}.*`);
    const fn = mod.default ?? mod;
    const response = await fn();

    parentPort?.postMessage({ success: true, response: response });
  } catch (err) {
    parentPort?.postMessage({ success: false, error: String(err) });
  }
})();
