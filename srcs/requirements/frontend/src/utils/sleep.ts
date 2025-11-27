export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      // Reject immediately if already aborted
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const id = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    // Accept event parameter so the function matches EventListener signature
    function onAbort(_ev?: Event) {
      clearTimeout(id);
      cleanup();
      reject(new DOMException('Aborted', 'AbortError'));
    }

    function cleanup() {
      signal?.removeEventListener('abort', onAbort as EventListenerOrEventListenerObject);
    }

    if (signal) signal.addEventListener('abort', onAbort as EventListenerOrEventListenerObject);
  });
}
