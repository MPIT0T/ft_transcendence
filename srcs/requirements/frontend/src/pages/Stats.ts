import type { StatsPage } from "../interface/gameInterface.js"
import { Layout } from "./Layout";

function drawPieChart(slices: { value: number; color: string }[], elementId: string, maxValue: number = 100) {
  const svg = document.getElementById(elementId) as SVGElement | null;
  if (!svg) return;

  // Nettoyer l'ancien contenu
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // Si une seule part = 100% ou valeur maxValue, on dessine un cercle complet
  if (slices.length === 1 || slices[0].value >= maxValue) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '16');
    circle.setAttribute('cy', '16');
    circle.setAttribute('r', '16');
    circle.setAttribute('fill', slices[0].color);
    svg.appendChild(circle);
    return;
  }

  // Fonction pour calculer coordonnées
  const getCoordinates = (percent: number) => {
    const x = 16 + Math.cos(2 * Math.PI * percent) * 16;
    const y = 16 + Math.sin(2 * Math.PI * percent) * 16;
    return [x, y];
  };

  let cumulative = 0;

  slices.forEach(slice => {
    // Ne jamais mettre 0 exactement pour SVG
    const value = slice.value === 0 ? 0.01 : slice.value;
    const percent = value / maxValue;

    const [startX, startY] = getCoordinates(cumulative);
    cumulative += percent;
    const [endX, endY] = getCoordinates(cumulative);

    // Déterminer si l'arc est supérieur à 50%
    const largeArc = percent > 0.5 ? 1 : 0;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M16 16 L ${startX} ${startY} A 16 16 0 ${largeArc} 1 ${endX} ${endY} Z`);
    path.setAttribute('fill', slice.color);
    svg.appendChild(path);
  });
}


let activeTab: 'profile' | 'history' = 'profile';

if (!Layout.isLoggedIn()) {
  const p = '/';
  history.pushState(null, '', p);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const Stats: StatsPage = {
  render() {
    // Position the sliding indicator
    const indicatorTransform = activeTab === 'profile'
      ? 'translateX(0%)' : 'translateX(100%)';
    return `
<div class="bg-transparent flex flex-col w-[60vw] pt-20 items-start">
	<!-- Header avec onglets -->
  <div class="mb-6 w-[60vw] mx-auto">
	  <div class="relative backdrop-blur-2xs border border-gray-50 flex overflow-hidden">
			<!-- Sliding indicator -->
			<div id="tab-indicator" class="absolute top-0 left-0 h-full w-1/2 bg-gray-700 transition-transform duration-300 ease-in-out" style="transform:${indicatorTransform};"></div>
			<button 
		    	id="profile-tab"
				  class="relative z-10 flex-1 px-6 py-3 text-center transition-colors duration-200 hover:bg-gray-700/50 text-white">
				<div class="relative inline-block">
					<div class="relative z-10 text-7xl text-transparent bg-clip-text
							bg-linear-to-r from-red-500 via-blue-500 to-green-500
							bg-size-[200%_100%] bg-position-[0%_100%]">
						Profil
					</div>
				</div>
		  </button>
		  <button 
			    id="history-tab"
			    class="relative z-10 flex-1 px-6 py-3 text-center transition-colors duration-200 hover:bg-gray-700/50 text-white">
			  <div class="relative inline-block">
					<div class="relative z-10 text-7xl text-transparent bg-clip-text
							bg-linear-to-r from-red-500 via-blue-500 to-green-500
							bg-size-[200%_100%] bg-position-[100%_100%]">
						Historique
					</div>
				</div>
			</button>
		</div>
	</div>

	<div id="content-container" class="w-[60vw] mx-auto min-h-[60vh] max-h-[60vh] overflow-y-auto">
		${activeTab === 'profile' ? this.renderProfile() : this.renderHistory()}
	</div>
		<div class="w-[60vw] mx-auto flex items-center justify-center p-6 gap-6">
		<button class="text-blue-500  px-6 py-2 text-2xl font-bold backdrop-blur-2xs hover:bg-gray-700/50">🇫🇷</button>
		<button class="text-red-500  px-6 py-2 text-2xl font-bold backdrop-blur-2xs hover:bg-gray-700/50">🇬🇧</button>
		<button class="text-yellow-400  px-6 py-2 text-2xl font-bold backdrop-blur-2xs hover:bg-gray-700/50">🇪🇸</button>
	</div>
</div>
	`;
  },

  renderProfile() {
    const avatar = Layout.getUserInfoFromJwt(sessionStorage.getItem('token')).avatar;
    const avatar_name = avatar.split('.').slice(0, -1).join('.');
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Profil Section -->
        <div class="backdrop-blur-2xs border border-gray-50 p-6">
        <!-- Avatar -->
        <div class="text-center mb-6">
          <button
            id="open-avatar-modal"
            class="px-4 py-2 text-sm text-gray-100 hover:bg-gray-700/50 transition-colors"
          >
            <div class="w-64 h-64 mx-auto mb-4 flex items-center rounded-full border border-gray-50 justify-center overflow-hidden">
              <img src="${avatar}" id="user-avatar" alt="avatar" class="w-64 h-64 object-cover"/>
            </div>
          </button>
        </div>

        <!-- Username -->
        <div class="mb-6">
          <label class="block text-xs text-gray-300 mb-2">Username</label>
          <div class="relative">
            <span
              id="change-username"
              class="flex w-full px-3 py-2 border border-gray-400 text-2xl font-bold text-gray-200 focus:outline-none focus:border-gray-50"
              contenteditable="false"
            >
              ${sessionStorage.getItem('username')}
            </span>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
              Cliquez pour modifier
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 justify-between gap-6">
          <div class="mb-6">
            <button
              id="open-password-modal"
              class="w-full py-7 font-bold border bg-gray-50/5 border-gray-50 text-2xl text-gray-100 text-center hover:border-blue-500 hover:bg-gray-700/50 transition-transform"
            >
              Changer le mot de passe
            </button>
          </div>
          <div class="mb-6">
            <button
              class="w-full py-7 font-bold border bg-gray-50/5 border-gray-50 text-2xl text-gray-50 text-center hover:border-red-500 hover:bg-gray-700/50 transition-transform"
              id="disconnectBtn"
             >
               Se déconnecter
             </button>
          </div>
        </div>
        

        <!-- Main stats -->
        <div class="grid grid-cols-3 gap-4 text-center mt-8">
          <div>
          <div class="text-2xl font-bold text-gray-100" id="change-elo">?</div>
          <div class="text-sm text-gray-400">Elo</div>
          </div>
          <div>
          <div class="text-2xl font-bold text-gray-100" id="stats-win-rate">0%</div>
          <div class="text-sm text-gray-400">Win Rate</div>
          </div>
          <div>
          <div class="text-2xl font-bold text-gray-100" id="friends-counter">0</div>
          <div class="text-sm text-gray-400">Friends</div>
          
          </div>
        </div>
        </div>


        <!-- Friends Lists with tabs -->
        <div class="backdrop-blur-2xs border border-gray-50 p-6">
        <h3 class="text-2xl font-bold text-gray-100">Amis</h3>
        
        <div class="mb-4">
          <label for="add-friend-input" class="block text-sm text-gray-300 mb-2">Ajouter un ami</label>
          <div class="flex gap-2">
          <input id="add-friend-input" type="text" placeholder="Nom de l'ami" class="flex w-full px-3 py-2 border border-gray-400 text-lg font-bold text-gray-200 focus:outline-none focus:border-gray-50" />
          <button id="add-friend-btn" class="px-3 py-2 bg-transparent border border-gray-400 text-gray-50 text-lg hover:bg-gray-700/50 hover:border-blue-500 transition-colors">Ajouter</button>
          </div>
        </div>
        
        <div class="mb-4 flex items-center justify-between">
          <div class="relative w-60">
          <div id="friends-tab-indicator" class="absolute top-0 left-0 h-full w-1/3 bg-gray-700 transition-transform duration-200" style="transform: translateX(0%);"></div>
          <div class="relative z-10 flex">
            <button id="friends-online-tab" class="flex-1 px-3 py-2 text-sm hover:bg-gray-700/50 text-white text-center">Online</button>
            <button id="friends-offline-tab" class="flex-1 px-3 py-2 text-sm hover:bg-gray-700/50 text-white text-center">Offline</button>
            <button id="friends-request-tab" class="flex-1 px-3 py-2 text-sm hover:bg-gray-700/50 text-white text-center">Request</button>
          </div>
          </div>
        </div>

        <div id="friends-container">
          <div id="online-friends" class="space-y-3 p-6 overflow-y-auto max-h-[37vh]">
          <ul id="online-friends-container">
          </ul>
          </div>

          <div id="offline-friends" class="space-y-3 p-6 overflow-y-auto max-h-[37vh]">
          <ul id="offline-friends-container"></ul>
          </div>
          <div id="request-friends" class="space-y-3 p-6 overflow-y-auto max-h-[37vh]">
          <ul id="request-friends-container"></ul>
          </div>
        </div>
        </div>
      </div>

      <!-- Avatar Modal -->
      <div id="avatar-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
        <div class="bg-transparent border border-gray-50 w-full max-w-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-100">Choisir un avatar</h4>
            <button type="button" class="text-gray-300 hover:text-white hover:bg-gray-700/50 py-2 px-3" data-close-avatar-modal>✕</button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            ${['alien.png', 'astronaut.png', 'martian.png', 'robot.png'].map(a => `
              <button type="button" data-avatar="${a}" class="group flex flex-col items-center gap-3 focus:outline-none">
                <div class="w-24 h-24 overflow-hidden group-hover:bg-gray-700/50 transition-transform">
                  <img src="${a}" alt="${a.split('.')[0]}" class="w-24 h-24 object-cover"/>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Password Modal -->
      <div id="password-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
        <div class="bg-transparent border border-gray-50 w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-100">Changer le mot de passe</h4>
            <button type="button" class="text-gray-300 hover:text-white hover:bg-gray-700/50 py-2 px-3" data-close-password-modal>✕</button>
          </div>
          <form id="password-form" class="space-y-4">
            <div>
              <label for="old-password" class="block text-xs text-gray-400 mb-1">Mot de passe actuel</label>
              <input id="old-password" type="password" required
                     class="w-full px-3 py-2 bg-white/5 border border-gray-400 text-sm text-gray-200 focus:outline-none focus:border-gray-50"/>
            </div>
            <div>
              <label for="new-password" class="block text-xs text-gray-400 mb-1">Nouveau mot de passe</label>
              <input id="new-password" type="password" minlength="6" required
                     class="w-full px-3 py-2 bg-white/5 border border-gray-400 text-sm text-gray-200 focus:outline-none focus:border-gray-50"/>
            </div>
            <div>
              <label for="confirm-password" class="block text-xs text-gray-400 mb-1">Confirmer</label>
              <input id="confirm-password" type="password" required
                     class="w-full px-3 py-2 bg-white/5 border border-gray-400 text-sm text-gray-200 focus:outline-none focus:border-gray-50"/>
            </div>
            <div class="flex space-x-4 mt-6">
              <button
                type="submit"
                id="submit-password-btn"
                class="flex-1 text-white py-2 px-4 border border-gray-50 hover:border-blue-500 hover:bg-gray-700/50 transition-colors font-bold"
              >
                Enregistrer
              </button>
              <button
                type="button" 
                class="flex-1 text-white py-2 px-4 border border-gray-50 hover:border-red-500 hover:bg-gray-700/50 transition-colors font-bold"
                data-close-password-modal
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
        `;
  },

  renderHistory() {
    window.clearInterval((globalThis as any).showOnlineFriendsIntervalId);
    window.clearInterval((globalThis as any).showOfflineFriendsIntervalId);
    window.clearInterval((globalThis as any).showFriendRequestIntervalId);
    return `
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <div class="backdrop-blur-2xs border border-gray-50">
    <div class="px-6 py-4 border-b border-gray-700">
      <h3 class="text-lg font-semibold text-gray-100">Stats des matches</h3>
    </div>
    <div class="flex gap-10 flex-wrap justify-center">
      <div class="p-6 rounded-xl shadow-md w-80 text-center">
        <svg id="wr-pieChart" width="100" height="100" viewBox="0 0 32 32"></svg>
        <div class="mt-4">
          <div class="flex items-center gap-2 text-gray-400">
            <span class="w-3 h-3 bg-green-400 rounded-full"></span>
            <span id="victory-class">Tu n'as jamais joué !</span>
          </div>
        </div>
      </div>
  
      <div class="p-6 rounded-xl shadow-md w-80 text-center">
        <svg id="play-daily-pieChart" width="100" height="100" viewBox="0 0 32 32"></svg>
        <div class="mt-4">
          <div class="flex items-center gap-2 text-gray-400">
            <span class="w-3 h-3 bg-fuchsia-400 rounded-full"></span>
            <span id="day-time-played">You didnt played today</span>
          </div>
        </div>
      </div>
  
      <div class="p-6 rounded-xl shadow-md w-80 text-center">
        <svg id="play-weekly-pieChart" width="100" height="100" viewBox="0 0 32 32"></svg>
        <div class="mt-4">
          <div class="flex items-center gap-2 text-gray-400">
            <span class="w-3 h-3 bg-blue-400 rounded-full"></span>
            <span id="week-time-played">You didnt played this week</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
  <div class="backdrop-blur-2xs border border-gray-50 ">
    <div class="px-6 py-4 border-b border-gray-700">
      <h3 class="text-lg font-semibold text-gray-100">Historique des matches</h3>
    </div>
    <div class="p-6 overflow-y-auto min-h-[38vh] max-h-[38vh]">
      <table class="w-full">
        <thead class="bg-transparent">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Adversaire</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Résultat</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mode de jeu</th>
          </tr>
        </thead>
        <tbody class="bg-transparent divide-y divide-gray-800" id="history-container"></tbody>
      </table>
    </div>
  </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
    <div class="text-3xl font-bold text-blue-400" id="histo-weekly-played">0</div>
    <div class="text-sm text-gray-400">Parties cette semaine</div>
  </div>
  <div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
    <div class="text-3xl font-bold text-green-400" id="histo-victory">0</div>
    <div class="text-sm text-gray-400">Victoires</div>
  </div>
  <div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
    <div class="text-3xl font-bold text-red-400" id="histo-loose">0</div> 
    <div class="text-sm text-gray-400">Défaites</div>
  </div>
  <div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
    <div class="text-3xl font-bold text-purple-400" id="histo-wr">0%</div>
    <div class="text-sm text-gray-400">Winrate</div>
  </div>
</div>

					`;
  },

  mount(root) {
    // Gestion des onglets
    let _friends = 0;
    Object.defineProperty(globalThis, "friends", {
      get() {
        return _friends;
      },
      set(value) {
        _friends = value;
        updateFriendsUI(value);
      },
      configurable: true,
      enumerable: true
    });

    // ELO fetched after profile content is rendered so element exists
    const fetchElo = () => {
      const indicatorEl = document.getElementById('change-elo');
      if (!indicatorEl) return;
      fetch('/user/api/get-elo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ username: sessionStorage.getItem('username') })
      })
        .then(res => {
          if (!res.ok) return res.json().then(data => Promise.reject(data));
          return res.json();
        })
        .then((data: { elo: number }) => {
          indicatorEl.textContent = data.elo?.toFixed(0).toString() ?? '?';
        })
        .catch(err => {
          const msg = err?.error || 'Impossible de recevoir l\'elo du joueur';
          Layout.showNotification(msg, 'error');
        });
    };

    function updateFriendsUI(count: number) {
      const el = document.getElementById("friends-counter");
      if (el) el.textContent = count.toString();
    }

    // for (let index = 0; index < 15; index++) {

    //   const usernames = [];
    //   usernames.push(sessionStorage.getItem("username"));
    //   usernames.push(sessionStorage.getItem("username"));
    //   const scores = {
    //     player1: 12,
    //     player2: 2,
    //   };
    //   const tokens = [];
    //   tokens.push(sessionStorage.getItem("token"));
    //   tokens.push(sessionStorage.getItem("token"));
    //   fetch('/user/api/post-match', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    //     },
    //     body: JSON.stringify({
    //       usernames: usernames, winner: 1, scores, gameMode: 'challenge', tokens: tokens
    //     })
    //   })
    // }

    const profileTab = root.querySelector('#profile-tab') as HTMLButtonElement;
    const historyTab = root.querySelector('#history-tab') as HTMLButtonElement;
    const contentContainer = root.querySelector('#content-container') as HTMLDivElement;
    const indicator = root.querySelector('#tab-indicator') as HTMLDivElement | null;

    const renderContent = () => {
      if (!contentContainer) return;
      contentContainer.innerHTML = activeTab === 'profile' ? this.renderProfile() : this.renderHistory();
      if (activeTab === 'profile') {
        this.mountProfileEvents(contentContainer);
        fetchElo(); // ensure ELO loads after element is present
      }
    };

    const updateIndicator = () => {
      if (!indicator) return;
      const translate = activeTab === 'profile' ? 'translateX(0%)' : 'translateX(100%)';
      indicator.style.transform = translate;
    };

    const switchToProfile = () => {
      if (activeTab === 'profile') return;
      activeTab = 'profile';
      updateIndicator();
      renderContent();
    };

    const switchToHistory = () => {
      if (activeTab === 'history') return;
      activeTab = 'history';
      updateIndicator();
      renderContent();
      this.updateContentHistory();
    };

    if (profileTab) {
      profileTab.addEventListener('click', switchToProfile);
    }

    if (historyTab) {
      historyTab.addEventListener('click', switchToHistory);
    }

    // Initial content/events mount based on active tab

    renderContent();
    // In case initial tab is profile and ELO element already in DOM
    if (activeTab === 'profile') fetchElo();

  },

  mountProfileEvents(root: HTMLElement) {

    this.showOnlineFriends(root);

    const addFriendBtn = root.querySelector('#add-friend-btn') as HTMLButtonElement;
    if (addFriendBtn) {
      addFriendBtn.addEventListener('click', () => {
        this.handleAddFriendClick(root);
      });
    }

    const wrStat = document.getElementById('stats-win-rate');
    if (wrStat && sessionStorage.getItem('token')) {
      const currentUser = sessionStorage.getItem('username');
      fetch('/user/api/get-match-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ username: currentUser })
      })
        .then(res => {
          if (!res.ok) return res.json().then(data => Promise.reject(data));
          return res.json(); // réponse déjà en JSON
        })
        .then((data: { matchHistory: Array<any> }) => {
          if (!data.matchHistory || data.matchHistory.length === 0) return;

          // Calculer les victoires directement sur le tableau
          const victories = data.matchHistory.reduce((acc, match) => acc + (match.winner ? 1 : 0), 0);
          const wr = (victories / data.matchHistory.length) * 100;

          wrStat.textContent = wr.toFixed(2) + '%';
        })
        .catch(err => {
          const msg = err?.error || 'Impossible de recevoir l\'historique des matches';
          Layout.showNotification(msg, 'error');
        });
    }

    //change username
    const usernameEl = document.getElementById("change-username");
    if (usernameEl) {
      usernameEl.addEventListener("click", () => {
        usernameEl.contentEditable = "true";
        usernameEl.focus();
      });
      usernameEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          usernameEl.blur();
        }
      });

      usernameEl.addEventListener("blur", () => {
        usernameEl.contentEditable = "false";
        if (!usernameEl.textContent || usernameEl.textContent === '')
          usernameEl.textContent = sessionStorage.getItem('username');
        if (usernameEl.textContent && usernameEl.textContent.trim() !== sessionStorage.getItem('username')) {
          const newUsername = usernameEl.textContent.trim();
          fetch('/user/api/change-name', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              username: sessionStorage.getItem('username'),
              newUsername: newUsername,
            })
          })
            .then(async (res) => {
              const text = await res.text();
              let data;
              try {
                data = JSON.parse(text);
              } catch {
                data = text;
              }
              if (!res.ok) {
                return Promise.reject(data);
              }
              return data;
            })
            .then((data: { message: string; token?: string }) => {
              if (data.token) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', Layout.getUserInfoFromJwt(data.token).username);
                Layout.updateUsername();
              }
              Layout.showNotification(data.message || 'username changé avec succès', 'success');
            })
            .catch(err => {
              console.error('Fetch error:', err);
              const msg = (err && (err.error || err.message)) || 'Impossible de changer de nom d\'utilisateur';
              Layout.showNotification(msg, 'error');
            });
        }
      });
    }

    // Disconnect
    const disconnectBtn = root.querySelector('#disconnectBtn') as HTMLButtonElement;
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        Layout.updateLoginButton(document.body, false);
        clearInterval((globalThis as any).loginIntervalId);
        const p = '/';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    // Password modal handlers
    const openPwdBtn = root.querySelector('#open-password-modal') as HTMLButtonElement | null;
    const pwdModal = root.querySelector('#password-modal') as HTMLDivElement | null;
    if (openPwdBtn && pwdModal) {
      const closeEls = pwdModal.querySelectorAll('[data-close-password-modal]');
      openPwdBtn.addEventListener('click', () => pwdModal.classList.remove('hidden'));
      closeEls.forEach(el => el.addEventListener('click', () => pwdModal.classList.add('hidden')));
      const form = pwdModal.querySelector('#password-form') as HTMLFormElement | null;
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const oldPass = (form.querySelector('#old-password') as HTMLInputElement).value.trim();
          const newPass = (form.querySelector('#new-password') as HTMLInputElement).value.trim();
          const confirmPass = (form.querySelector('#confirm-password') as HTMLInputElement).value.trim();
          if (newPass !== confirmPass) {
            Layout.showNotification('Les mots de passe ne correspondent pas', 'error');
            return;
          }
          fetch('/user/api/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
              username: sessionStorage.getItem('username'),
              password: oldPass,
              newPassword: newPass
            })
          })
            .then(res => res.text().then(t => {
              let data: any;
              try { data = JSON.parse(t); } catch { data = { message: t }; }
              if (!res.ok) return Promise.reject(data);
              return data;
            }))
            .then(data => {
              Layout.showNotification(data.message || 'Mot de passe changé', 'success');
              form.reset();
              pwdModal.classList.add('hidden');
            })
            .catch(err => {
              const msg = (err && (err.error || err.message)) || 'Impossible de changer le mot de passe';
              Layout.showNotification(msg, 'error');
            });
        });
      }
    }

    //change avatar
    const openAvatarBtn = root.querySelector('#open-avatar-modal') as HTMLButtonElement | null;
    const avatarModal = root.querySelector('#avatar-modal') as HTMLDivElement | null;
    const closeAvatarEls = avatarModal ? avatarModal.querySelectorAll('[data-close-avatar-modal]') : [];
    if (openAvatarBtn && avatarModal) {
      openAvatarBtn.addEventListener('click', () => avatarModal.classList.remove('hidden'));
      closeAvatarEls.forEach(el => el.addEventListener('click', () => avatarModal.classList.add('hidden')));
      avatarModal.querySelectorAll('[data-avatar]').forEach(btn => {
        btn.addEventListener('click', () => {
          const file = (btn as HTMLElement).getAttribute('data-avatar');
          if (!file) return;
          this.changeNewAvatar(root, file);
          avatarModal.classList.add('hidden');
        });
      });
    }

    // Friends tabs (Online / Offline)
    const onlineTab = root.querySelector('#friends-online-tab') as HTMLButtonElement | null;
    const offlineTab = root.querySelector('#friends-offline-tab') as HTMLButtonElement | null;
    const requestTab = root.querySelector('#friends-request-tab') as HTMLButtonElement | null;
    const tabIndicator = root.querySelector('#friends-tab-indicator') as HTMLDivElement | null;
    const onlineSection = root.querySelector('#online-friends') as HTMLElement | null;
    const offlineSection = root.querySelector('#offline-friends') as HTMLElement | null;
    const requestSection = root.querySelector('#request-friends') as HTMLElement | null;

    const showOnline = () => {
      if (tabIndicator) tabIndicator.style.transform = 'translateX(0%)';
      if (onlineSection) onlineSection.classList.remove('hidden');
      if (offlineSection) offlineSection.classList.add('hidden');
      if (requestSection) requestSection.classList.add('hidden');
      window.clearInterval((globalThis as any).showOfflineFriendsIntervalId);
      window.clearInterval((globalThis as any).showFriendRequestIntervalId);
      this.showOnlineFriends(root);
      clearInterval((globalThis as any).showOnlineFriendsIntervalId);
      (globalThis as any).showOnlineFriendsIntervalId = setInterval(async () => {
        this.showOnlineFriends(root);
      }, 5000);
    };

    const showOffline = () => {
      if (tabIndicator) tabIndicator.style.transform = 'translateX(100%)';
      if (offlineSection) offlineSection.classList.remove('hidden');
      if (onlineSection) onlineSection.classList.add('hidden');
      if (requestSection) requestSection.classList.add('hidden');
      window.clearInterval((globalThis as any).showOnlineFriendsIntervalId);
      window.clearInterval((globalThis as any).showFriendRequestIntervalId);
      this.showOfflineFriends(root);
      clearInterval((globalThis as any).showOfflineFriendsIntervalId);
      (globalThis as any).showOfflineFriendsIntervalId = setInterval(async () => {
        this.showOfflineFriends(root);
      }, 5000);
    };

    const showRequestTab = () => {
      if (tabIndicator) tabIndicator.style.transform = 'translateX(200%)';
      if (requestSection) requestSection.classList.remove('hidden');
      if (onlineSection) onlineSection.classList.add('hidden');
      if (offlineSection) offlineSection.classList.add('hidden');
      window.clearInterval((globalThis as any).showOnlineFriendsIntervalId);
      window.clearInterval((globalThis as any).showOfflineFriendsIntervalId);
      this.showFriendRequest(root);
      clearInterval((globalThis as any).showFriendRequestIntervalId);
      (globalThis as any).showFriendRequestIntervalId = setInterval(async () => {
        this.showFriendRequest(root);
      }, 5000);
    };

    if (onlineTab) onlineTab.addEventListener('click', showOnline);
    if (offlineTab) offlineTab.addEventListener('click', showOffline);
    if (requestTab) requestTab.addEventListener('click', showRequestTab);
  },

  handleAddFriendClick(root: HTMLElement) {
    const input = root.querySelector('#add-friend-input') as HTMLInputElement;
    const invitedUsername = input?.value?.trim();

    if (!invitedUsername) {
      Layout.showNotification('Veuillez entrer un nom d\'utilisateur', 'error');
      return;
    }

    const currentUser = sessionStorage.getItem('username');
    if (!currentUser) {
      Layout.showNotification('Vous devez être connecté', 'error');
      return;
    }

    if (invitedUsername === currentUser) {
      Layout.showNotification('Vous ne pouvez pas vous ajouter vous-même !', 'error');
      return;
    }

    fetch('/user/friends/invite-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({
        author: currentUser,
        invited: invitedUsername
      })
    })
      .then(res => {
        if (res.ok) {
          Layout.showNotification(`Invitation envoyée à ${invitedUsername} !`);
          input.value = '';
        } else {
          return res.json().then(data => Promise.reject(data));
        }
      })
      .catch(err => {
        const msg = err.error || 'Impossible d\'envoyer l\'invitation';
        Layout.showNotification(msg, 'error');
      });
  },

  showFriendRequest(root: HTMLElement) {
    const currentUser = sessionStorage.getItem('username');
    const container = root.querySelector('#request-friends-container') as HTMLDivElement;

    if (!currentUser) {
      Layout.showNotification('Vous devez être connecté', 'error');
      return;
    }

    fetch('/user/friends/get-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username: currentUser,
      })
    })
      .then(res => {
        container.innerHTML = '';
        if (!res.ok) {
          return res.json().then(data => Promise.reject(data));
        }
        return res.json();
      })
      .then((data: { invites: { username: string }[] }) => {

        const usernames = data.invites
          .filter((entry) => entry && entry.username)
          .map((entry) => entry.username);
        usernames.forEach((username: string) => {
          const li = document.createElement('li');
          li.className = 'flex items-center justify-between mb-3';
          li.innerHTML = `
<div class="flex items-center">
  <span class="inline-block w-2 h-2 mr-2 relative">
    <span class="absolute bottom-0 left-0 w-0 h-0
       border-l-[4px] border-r-[4px] border-b-[6px]
       border-l-transparent border-r-transparent border-b-purple-500"></span>
  </span>
  <span class="text-gray-200 text-xl">${username}</span>
</div>
<button class="invite-btn px-3 py-1 text-md text-white border border-gray-50 hover:border-blue-500 hover:bg-gray-700/50 transition-colors" id="Btn-${username}">
  Accepter
</button>
  `;
          const btn = li.querySelector('button') as HTMLButtonElement;
          btn.addEventListener('click', () => {
            this.acceptFriendRequest(username, li);
          });
          container.appendChild(li);
        });
      })
      .catch(err => {
        const msg = err.error || 'Impossible de recevoir les requetes d\'amis';
        Layout.showNotification(msg, 'error');
      });
  },

  acceptFriendRequest(username: string, element: HTMLElement) {
    fetch('/user/friends/accept-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({ author: sessionStorage.getItem('username'), accepted: username })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => Promise.reject(data));
        }
        element.remove();
        Layout.showNotification(`Vous avez accepté ${username}`, 'success');
      })
      .catch(err => {
        const msg = err.error || `Impossible d'accepter ${username}`;
        Layout.showNotification(msg, 'error');
      });
  },

  showOnlineFriends(root: HTMLElement) {
    const currentUser = sessionStorage.getItem('username');
    const container = root.querySelector('#online-friends-container') as HTMLDivElement;

    if (!currentUser) {
      Layout.showNotification('Vous devez être connecté', 'error');
      return;
    }

    fetch('/user/friends/get-friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username: currentUser,
      })
    })
      .then(res => {
        container.innerHTML = '';
        if (!res.ok) {
          return res.json().then(data => Promise.reject(data));
        }
        return res.json();
      })
      .then((data: { friends: { username: string }[], friendsStatus: { online: boolean }[] }) => {
        const usersWithStatus = data.friends
          .filter(entry => entry && entry.username)
          .map((entry, index) => ({
            username: entry.username,
            online: data.friendsStatus[index]?.online ?? false
          }));
        (globalThis as any).friends = usersWithStatus.length;
        usersWithStatus.forEach((user) => {
          if (user.online) {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between';
            li.innerHTML = `
					<span class="text-gray-200 flex text-xl items-center">
					<span class="w-2 h-2 bg-green-500 mr-2"></span>
					${user.username}
					</span>
					`;
            container.appendChild(li);
          }
        });
      })
      .catch(err => {
        const msg = err.error || 'Impossible de recevoir les requetes d\'amis';
        Layout.showNotification(msg, 'error');
      });
  },

  changeNewAvatar(root: HTMLElement, newAvatar: string) {
    const currentUser = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');

    if (!currentUser) {
      Layout.showNotification('Vous devez être connecté', 'error');
      return;
    }

    fetch('/user/api/change-avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: currentUser,
        avatar: newAvatar
      })
    })
      .then(async (res) => {
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        console.log('Response status:', res.status);
        console.log('Response data:', data);

        if (!res.ok) {
          return Promise.reject(data);
        }
        return data;
      })
      .then((data: { message: string; token?: string }) => {
        if (data.token) {
          sessionStorage.setItem('token', data.token);
          this.updateAvatar();
        }
        Layout.showNotification(data.message || 'Avatar changé avec succès', 'success');
      })
      .catch(err => {
        console.error('Fetch error:', err);
        const msg = (err && (err.error || err.message)) || 'Impossible de changer d\'avatar';
        Layout.showNotification(msg, 'error');
      });
  },

  showOfflineFriends(root: HTMLElement) {
    const currentUser = sessionStorage.getItem('username');
    const container = root.querySelector('#offline-friends-container') as HTMLDivElement;

    if (!currentUser) {
      Layout.showNotification('Vous devez être connecté', 'error');
      return;
    }

    fetch('/user/friends/get-friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username: currentUser,
      })
    })
      .then(res => {
        container.innerHTML = '';
        if (!res.ok) {
          return res.json().then(data => Promise.reject(data));
        }
        return res.json();
      })
      .then((data: { friends: { username: string }[], friendsStatus: { online: boolean }[] }) => {
        const usersWithStatus = data.friends
          .filter(entry => entry && entry.username)
          .map((entry, index) => ({
            username: entry.username,
            online: data.friendsStatus[index]?.online ?? false
          }));
        (globalThis as any).friends = usersWithStatus.length;
        usersWithStatus.forEach((user) => {
          if (!user.online) {
            const li = document.createElement('li');
            li.className = 'flex items-center';
            li.innerHTML = `
					<span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
					<span class="text-gray-200 text-xl">${user.username}</span>
					`;
            container.appendChild(li);
          }
        });
      })
      .catch(err => {
        const msg = err.error || 'Impossible de recevoir les requetes d\'amis';
        Layout.showNotification(msg, 'error');
      });
  },

  updateAvatar() {
    const avatar = document.getElementById('user-avatar') as HTMLImageElement;

    if (avatar) {
      avatar.src = Layout.getUserInfoFromJwt(sessionStorage.getItem('token')).avatar;
      Layout.updateAvatar();
    }
  },

  playedTimesinHours(matches, timesInHours): {
    matchesPlayed: number;
    timePlayed: number;
  } {
    const HOUR = 3600000;
    let matchInPoT = 0;
    let timePlayedInPot = 0;

    if (!matches || !matches.length)
    {
      return {
        matchesPlayed: matchInPoT,
        timePlayed: timePlayedInPot
      };
    }
    matches.forEach(match => {
      const matchTime = (() => {
        const [d, t] = match.date.split(' ');
        const [day, month, year] = d.split('/').map(Number);
        const [h, m, s] = t.split(':').map(Number);
        return new Date(year, month - 1, day, h, m, s).getTime();
      })();
      const timeStamp = Date.now() - matchTime;
      if (timeStamp < HOUR * timesInHours)
      {
        matchInPoT++;
        timePlayedInPot += match.duration;
      }
    });
    return {
      matchesPlayed: matchInPoT,
      timePlayed: timePlayedInPot
    };
  },

  updateTimeplayed(matches) {
    const matchDay = this.playedTimesinHours(matches, 24);
    const matchWeek = this.playedTimesinHours(matches, 24 * 7);
    const matchWeeklyPlayed = document.getElementById('histo-weekly-played') as HTMLElement;
    const timePlayDaily = document.getElementById('day-time-played') as HTMLElement;
    const timePlayWeekly = document.getElementById('week-time-played') as HTMLElement;

    if (!matchDay.matchesPlayed || !matchWeek.matchesPlayed) {
      const dailySlices = [
        {value: 0.01, color: '#e879f9'},
        {value: 23.99, color: '#18181b'}
      ];
      drawPieChart(dailySlices, 'play-daily-pieChart', 24);
      const weeklySlices = [
        {value: 0.01, color: '#60a5fa'},
        {value: 167.99, color: '#18181b'}
      ];
      drawPieChart(weeklySlices, 'play-weekly-pieChart', 168);
      return;
    }
    if (matchWeeklyPlayed) matchWeeklyPlayed.textContent = matchWeek.matchesPlayed.toString();
    const dailySlices = [
      {value: Math.max(0.01, Math.min(matchDay.timePlayed / 3600, 24)), color: '#e879f9'},
      {value: Math.max(0.01, 24 - Math.min(matchDay.timePlayed / 3600, 24)), color: '#18181b'}
    ];
    drawPieChart(dailySlices, 'play-daily-pieChart', 24);
    if (timePlayDaily) {
      timePlayDaily.textContent = (matchDay.timePlayed.toString() !== 'NaN') ? "You played: " +
        Math.floor(matchDay.timePlayed / 3600) + "h " +
        Math.floor((matchDay.timePlayed % 3600) / 60) + "min " +
        (matchDay.timePlayed % 60) + "sec today" : 'You didnt played today';
    }
    const weeklySlices = [
      {value: Math.max(0.01, Math.min(matchWeek.timePlayed / 3600, 168)), color: '#60a5fa'},
      {value: Math.max(0.01, 168 - Math.min(matchWeek.timePlayed / 3600, 168)), color: '#18181b'}
    ];
    drawPieChart(weeklySlices, 'play-weekly-pieChart', 168);
    if (timePlayWeekly) {
      timePlayWeekly.textContent = (matchWeek.timePlayed.toString() !== 'NaN') ? 'You played: ' + Math.floor(matchWeek.timePlayed / 3600) + "h " +
        Math.floor((matchWeek.timePlayed % 3600) / 60) + "min " +
        (matchWeek.timePlayed % 60) + "sec this week" : 'You didnt played this week';

    }
  },

  updateContentHistory() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const currentUser = sessionStorage.getItem('username');
    const container = document.querySelector('#history-container') as HTMLTableSectionElement;
    if (!container) return;

    fetch('/user/api/get-match-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username: currentUser })
    })
    .then(res => {
      container.innerHTML = '';
      if (!res.ok) return res.json().then(data => Promise.reject(data));
      return res.json();
    })
    .then((data: { matchHistory: Array<any> }) => {
      if (!data.matchHistory || data.matchHistory.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-300" colspan="5">
                  Jouez des parties pour avoir un historique
              </td>`;
        container.appendChild(tr);
          const fallbackSlices = [
            { value: 0.01, color: '#4ade80' },
            { value: 99.99, color: '#18181b' },
          ];
          drawPieChart(fallbackSlices, 'wr-pieChart');
          this.updateTimeplayed(data.matchHistory);
          return;
      }
      data.matchHistory.forEach(match => {
        const victory = match.winner ? "✅ Victoire" : "❌ Défaite";
        const victoryColor = match.winner ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-700/40';
        tr.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${match.date}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-50">
                          <img src="${match.avatar || '/default-avatar.png'}" alt="avatar"/>
                      </div>
                      <span class="text-sm font-medium text-gray-100">${match.versus || 'Inconnu'}</span>
                  </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">${match.score}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold ${victoryColor} rounded-full">
                      ${victory}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${match.gamemode}</td>
          `;
        container.appendChild(tr);
      });

      const wrStat = document.getElementById('stats-win-rate');
      if (wrStat) {
        let victories = data.matchHistory.reduce((acc, m) => acc + (m.winner ? 1 : 0), 0);
        const wr = data.matchHistory.length > 0 ? (victories / data.matchHistory.length) * 100 : 0;
        wrStat.textContent = wr.toFixed(2) + '%';
      }
      const wrStat2 = document.getElementById('histo-wr');
      if (wrStat2)
      {
        let victories = data.matchHistory.reduce((acc, m) => acc + (m.winner ? 1 : 0), 0);
        const wr = data.matchHistory.length > 0 ? (victories / data.matchHistory.length) * 100 : 0;
        wrStat2.textContent = wr.toFixed(2) + '%';
      }
      const total = data.matchHistory.length;
      const victories = data.matchHistory.reduce((acc, m) => acc + (m.winner ? 1 : 0), 0);
      const defeats = total - victories;
      const victoryStat = document.getElementById('histo-victory');
      const defeatStat = document.getElementById('histo-loose');

      if (victoryStat) victoryStat.textContent = victories.toString();
      if (defeatStat) defeatStat.textContent = defeats.toString();
      this.updateTimeplayed(data.matchHistory);
      const slices = [
        { value: total > 0 ? (victories / total) * 100 : 0, color: '#4ade80' },
        { value: total > 0 ? (defeats / total) * 100 : 0, color: '#18181b' },
      ];
      if (slices[0].value === 100) {
        slices[0].value = 99.99;
        slices[1].value = 0.01;
      }
      if (slices[1].value === 100) {
        slices[1].value = 99.99;
        slices[0].value = 0.01;
      }
      drawPieChart(slices, 'wr-pieChart');
      const victorySpan = document.getElementById('victory-class') as HTMLDivElement;
      const defeatSpan = document.getElementById('defeat-class') as HTMLDivElement;
      victorySpan.textContent = "Victory: "  + (total > 0 ? (victories / total) * 100 : 0).toFixed(2) + "%";
    })
    .catch(err => {
      const msg = err?.error || 'Impossible de recevoir l\'historique des matches';
      Layout.showNotification(msg, 'error');
    });
  }
}

const popstateHandler = (event: PopStateEvent) => {
  window.clearInterval((globalThis as any).showOnlineFriendsIntervalId);
  window.clearInterval((globalThis as any).showOfflineFriendsIntervalId);
  window.clearInterval((globalThis as any).showFriendRequestIntervalId);
  window.removeEventListener('popstate', popstateHandler);
};
window.addEventListener('popstate', popstateHandler);

export default Stats
