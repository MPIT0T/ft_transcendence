import type { Page } from "./interface/gameInterface.js";
import { Home } from      "./pages/Home.js";
import { Game } from      "./pages/Game.js";
import { Layout } from    "./pages/Layout.js";
import { Stats } from     "./pages/Stats.js";
import { GameLoby } from  "./pages/GameLobby.js";
import { GameOnline } from "./pages/GameOnline.js";
import { GameRoom } from "./pages/GameRoom.js";
import { TournamentRoom } from "./pages/TournamentRoom.js";
import { TournamentOnline } from "./pages/TournamentOnline.js";

const routes: Record<string, Page> = {
  "/": Home,
  "/stats": Stats,
  "/gameLoby": GameLoby,
  "/gameOnline": GameOnline,
  "/gameRoom": GameRoom,
  "/tournamentRoom": TournamentRoom,
  "/tournamentOnline": TournamentOnline,
  "/game": Game,
}

const getPath = (): string => {
  // const hash = window.location.hash || "/";
  // const path = hash.replace(/^#/, "");
  // return path;
  let path = window.location.hash.slice(1) || "/";

  if (path.includes('?')) {
        path = path.split('?')[0];
    }
  return path;
}



export function startRouter(){
  const root = document.getElementById("root")!;

  const render = () => {
	const path = getPath();
	const page = routes[path];
	
	if (page) {
	  // Render page content inside layout
	  const pageContent = page.render();
	  const layoutHTML = Layout.render(pageContent);
	  root.innerHTML = layoutHTML;
	  
	  // Mount layout first
	  Layout.mount(root);
	  
	  // Then mount page-specific functionality
	  const pageContentElement = root.querySelector('#page-content') as HTMLElement;
	  if (pageContentElement) {
		page.mount(pageContentElement);
	  }
	} else {
	  // Handle 404
	  const notFoundHTML = Layout.render('<h1 class="text-3xl text-red-500">404 - Page Not Found</h1>');
	  root.innerHTML = notFoundHTML;
	  Layout.mount(root);
	}
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("load", render);
  render();
}