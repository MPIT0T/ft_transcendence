/**
 * @fileoverview SPA Router for ft_transcendence
 * Handles navigation between pages without full page reloads
 */

import type { Page } from "./interface/gameInterface.js";
import { Home } from      "./pages/Home.js";
import { Game } from      "./pages/Game.js";
import { Layout } from    "./pages/Layout.js";
import Stats from     "./pages/Stats.js";
import { GameLobby } from  "./pages/GameLobby.js";
import { OnlineLobby } from  "./pages/OnlineLobby.js";
import { LocalLobby } from  "./pages/LocalLobby.js";
import { GameOnline } from "./pages/GameOnline.js";
import { GameOnlineTournament } from "./pages/GameOnlineTournament.js";
import { GameRoom } from "./pages/GameRoom.js";
import { TournamentRoom } from "./pages/TournamentRoom.js";
import { TournamentOnline } from "./pages/TournamentOnline.js";
import { TournamentLocal } from "./pages/TournamentLocal.js";
import { applyTranslations, t } from "./utils/i18n.js";

/** Route table - maps URL paths to page components */
const routes: Record<string, Page> = {
  "/": Home,
  "/stats": Stats,
  "/gameLobby": GameLobby,
  "/onlineLobby": OnlineLobby,
  "/localLobby": LocalLobby,
  "/gameOnline": GameOnline,
  "/gameOnlineTournament": GameOnlineTournament,
  "/gameRoom": GameRoom,
  "/tournamentRoom": TournamentRoom,
  "/tournamentOnline": TournamentOnline,
  "/tournamentLocal": TournamentLocal,
  "/game": Game,
}

/**
 * Gets the current URL path
 * @returns The current URL pathname (e.g., "/stats", "/game")
 */
const getPath = (): string => {
  const base = "";
  let path = window.location.pathname.replace(base, "") || "/";
  return path;
}

/**
 * Starts the SPA router and sets up event listeners
 * - Renders pages based on URL
 * - Intercepts clicks on internal links
 * - Listens to popstate events for browser back button
 */
export function startRouter(){
  const root = document.getElementById("root")!;

  const render = () => {
    const path = getPath();
    const page = routes[path];
    if (page) {
      const pageContent = page.render();
      const layoutHTML = Layout.render(pageContent);
      root.innerHTML = layoutHTML;
      Layout.mount(root);
      const pageContentElement = root.querySelector('#page-content') as HTMLElement;
      if (pageContentElement) page.mount(pageContentElement);
      // Apply translations after page render
      applyTranslations(root);
    } else {
      const notFoundHTML = Layout.render(`<h1 class="text-3xl text-red-500" data-i18n="layout.pageNotFound">404 - ${t('layout.pageNotFound')}</h1>`);
      root.innerHTML = notFoundHTML;
      Layout.mount(root);
      applyTranslations(root);
    }
  }

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
      history.pushState(null, '', to);
      render();
    }
  }

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('/') && !a.hasAttribute('data-external')) {
      e.preventDefault();
      navigate(href);
    }
  });

  window.addEventListener("popstate", render);
  window.addEventListener("load", render);
  render();
}
