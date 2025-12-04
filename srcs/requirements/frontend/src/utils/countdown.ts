import { sleep } from "./sleep.js";

export function createCountdown() {
  let controller: AbortController | null = null;

  return {
    async start(modal: HTMLElement, text: HTMLElement) {
      // Cancel any existing animation first
      if (controller) {
        controller.abort();
        controller = null;
      }
      controller = new AbortController();
      const { signal } = controller;

      modal.classList.remove("hidden");
      text.textContent = "3";

      try {
        for (let i = 3; i >= 1; i--) {
          text.textContent = String(i);
          text.style.transform = 'scale(1.5)';
          text.style.opacity = '1';
          await sleep(100, signal);
          text.style.transform = 'scale(1)';
          await sleep(700, signal);
          text.style.opacity = '0';
          await sleep(200, signal);
        }
        modal.classList.add('hidden');
      } catch (err: any) {
        modal.classList.add('hidden');
        text.style.transform = 'scale(1)';
        text.style.opacity = '1';
        if (err && (err.name === 'AbortError' || err instanceof DOMException)) {
          throw err;
        }
        throw err;
      } finally {
        text.style.transform = 'scale(1)';
        text.style.opacity = '1';
        controller = null;
      }
    },

    abort() {
      if (controller) {
        controller.abort();
        controller = null;
      }
    }
  };
}
