/**
 * @fileoverview Async sleep utility with cancellation support
 */

/**
 * Pauses execution for a specified duration
 * Can be cancelled via an AbortSignal
 * @param ms - Duration of the pause in milliseconds
 * @param signal - Optional AbortSignal for cancellation
 * @returns Promise that resolves after the delay or rejects if cancelled
 * @throws {DOMException} "AbortError" if the signal is aborted
 * @example
 * // Simple 1 second pause
 * await sleep(1000);
 * 
 * // Cancellable pause
 * const controller = new AbortController();
 * await sleep(5000, controller.signal);
 */
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
