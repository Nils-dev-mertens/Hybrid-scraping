import { parentPort, workerData } from "worker_threads";

(async () => {
  try {
    // Dynamically import a module from the storage folder by name.
    // The previous pattern used a glob ("*."), which is invalid for dynamic imports.
    // Resolve to a relative path without an extension; Node will resolve the file.
    const modulePath = `../storage/${workerData.moduleName}`;

    const mod = await import(modulePath);
    const fn = (mod && (mod.default ?? mod)) as any;

    // If the imported value is a function, call it; otherwise pass it through.
    const response = typeof fn === "function" ? await fn() : fn;

    parentPort?.postMessage({ success: true, response });
  } catch (err) {
    parentPort?.postMessage({ success: false, error: String(err) });
  }
})();
