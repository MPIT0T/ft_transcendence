const initPastelBackground = () => {
    const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate random pastel colors
    const pastelColor = () => {
        const r = Math.floor(Math.random() * 128 + 127);
        const g = Math.floor(Math.random() * 128 + 127);
        const b = Math.floor(Math.random() * 128 + 127);
        return `rgba(${r},${g},${b},0.8)`;
    };

    // Create floating particles
    const particles = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        color: pastelColor(),
        velX: (Math.random() - 0.5) * 0.3,
        velY: (Math.random() - 0.5) * 0.3,
    }));

    const loop = () => {
        // Black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        for (const p of particles) {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);

            p.x += p.velX;
            p.y += p.velY;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        }

        requestAnimationFrame(loop);
    };

    loop();
};


export const Layout = {
  render(content: string): string {
    return `
      <div class="flex flex-col h-screen font-tiny5">
        <nav class="h-16 bg-gray-400 flex items-center">
          <div class="flex my-5 gap-3 mx-5">
            <button id="home-btn" class="flex items-center px-3 py-1 rounded hover:bg-gray-300 transition">
              <span class="text-2xl flex items-center justify-center w-8 h-8 p-0 m-0">🏠</span>
              <span class="ml-2 font-custom">Home</span>
              </button>
              <button id="game-btn" class="flex items-center px-3 py-1 rounded hover:bg-gray-300 transition">
                <span class="text-2xl flex items-center justify-center w-8 h-8 p-0 m-0">🎮</span>
                <span class="ml-2">Game</span>
              </button>
              <button id="stats-btn" class="flex items-center px-3 py-1 rounded hover:bg-gray-300 transition">
                <span class="text-2xl flex items-center justify-center w-8 h-8 p-0 m-0">📊</span>
                <span class="ml-2">Stats</span>
              </button>
          </div>
        </nav>
        <canvas id="background-canvas" class="fixed top-0 left-0 w-full h-full -z-10"></canvas>
        <div class="flex flex-1 p-3 gap-6">
          <div class="flex flex-1 items-center justify-center rounded-xl relative">
            <div id="page-content">
              ${content}
            </div>
          </div>
        </div>
      </div>
    `;
  },


  mount(root: HTMLElement): void {
    const homeBtn = root.querySelector('#home-btn') as HTMLButtonElement;
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.location.hash = '/';
      });
    }
    const statsBtn = root.querySelector('#stats-btn') as HTMLButtonElement;
    if (statsBtn){
      statsBtn.addEventListener('click', () =>{
        window.location.hash = '/stats';
      })
    }
    const gameBtn = root.querySelector('#game-btn') as HTMLButtonElement;
    if (gameBtn){
      gameBtn.addEventListener('click', () =>{
        window.location.hash = '/gameLoby';
      })
    }
    initPastelBackground();
  }
};