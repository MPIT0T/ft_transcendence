import type { Page } from "../interface/gameInterface.js";

export const Test: Page = {
  render: () => {
    return `
      <div id="page-content" class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <h1 class="text-2xl font-bold mb-4">Test API Request</h1>
        <p id="output" class="text-lg text-blue-600">Loading...</p>
      </div>
    `;
  },

  mount: async (root: HTMLElement) => {
    const output = root.querySelector("#output") as HTMLElement;
    if (!output) return;

    try {
      // Change depending on your Docker setup
      // inside docker: http://backend:3000/ping
      // exposed locally: http://localhost:8080/ping
      const response = await fetch("/api/ping");

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.text();
      output.textContent = `Response: ${data}`;
      output.className = "text-lg text-green-600";
    } catch (err: any) {
      output.textContent = `Error: ${err.message}`;
      output.className = "text-lg text-red-600";
    }
  },
};
