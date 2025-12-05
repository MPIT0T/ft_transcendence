/**
 * @fileoverview SPA Router for ft_transcendence
 * Handles navigation between pages without full page reloads
 */

import type { Page } from "./interface/gameInterface.js";
import { Home } from      "./pages/Home.js";
import { LocalGame } from "./pages/local/LocalGame";
import { Layout } from    "./pages/Layout.js";
import Stats from     "./pages/profile/Stats.js";
import { Lobby } from "./pages/lobbies/Lobby";
import { OnlineLobby } from "./pages/lobbies/OnlineLobby";
import { LocalLobby } from "./pages/lobbies/LocalLobby";
import { GameOnline } from "./pages/online/game/GameOnline";
import { OnlineTournamentGame } from "./pages/online/tournament/OnlineTournamentGame";
import { GameRoom } from "./pages/online/game/GameRoom";
import { OnlineTournamentRoom } from "./pages/online/tournament/OnlineTournamentRoom";
import { OnlineTournamentBracket } from "./pages/online/tournament/OnlineTournamentBracket";
import { LocalTournament } from "./pages/local/LocalTournament";
import { applyTranslations, t } from "./utils/i18n.js";

/** Route table - maps URL paths to page components */
const routes: Record<string, Page> = {
  "/": Home,
  "/stats": Stats,
  "/gameLobby": Lobby,
  "/onlineLobby": OnlineLobby,
  "/localLobby": LocalLobby,
  "/gameOnline": GameOnline,
  "/gameOnlineTournament": OnlineTournamentGame,
  "/gameRoom": GameRoom,
  "/tournamentRoom": OnlineTournamentRoom,
  "/tournamentOnline": OnlineTournamentBracket,
  "/tournamentLocal": LocalTournament,
  "/game": LocalGame,
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
