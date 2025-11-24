import type { StatsPage } from "../interface/gameInterface.js"
import { Layout } from "./Layout";

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
		// language=HTML
		return `
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Profil Section -->
	<div class="backdrop-blur-2xs border border-gray-50 p-6 h-full flex flex-col">
		<!-- Avatar -->
		<div class="text-center mb-6">
				<div class="w-20 h-20 bg-transparent mx-auto mb-3 flex items-center justify-center border border-gray-50">
				<img src=${Layout.getUserInfoFromJwt(sessionStorage.getItem('token')).avatar} id="user-avatar" alt="avatar" class="w-12"/>
			</div>
			<select class="text-xs text-blue-500 underline cursor-pointer" id="change-avatar">
				<option value="">change avatar</option>
				<option value="alien.png">alien</option>
				<option value="astronaut.png">astronaut</option>
				<option value="martian.png">martian</option>
				<option value="robot.png">robot</option>
			</select>
		</div>

		<!-- Username -->
      <div class="flex justify-between items-center border-b border-gray-700 mb-6">
          <span class="text-3xl text-gray-50 font-semibold">${sessionStorage.getItem('username')}</span>
          <span class="text-xl text-gray-400">pseudo</span>
      </div>

		<!-- Mail -->
		<div class="text-center mb-6">
				<p class="text-sm text-gray-200 font-semibold mb-1 px-3 py-2 backdrop-blur-2xs border border-gray-400">LUCA@GMAIL.COM</p>
			<p class="text-xs text-blue-500 underline cursor-pointer" id="change-mail">CHANGE MAIL</p>
		</div>

		<div class="text-center mb-6">
	<button class="px-3 py-3 font-bold border border-gray-50 backdrop-blur-2xs text-2xl hover:border-red-500 hover:bg-gray-700 text-gray-50 transition-transform" id="disconnectBtn">Se déconnecter</button>
		</div>
	</div>

	<!-- Detailed stats -->
	<div class="backdrop-blur-2xs border border-gray-50 p-6">
		<h3 class="text-lg font-semibold mb-4 text-gray-100">Statistiques</h3>
		<div class="space-y-4">
			<div class="flex justify-between items-center py-2 border-b border-gray-700">
				<span class="text-sm font-medium text-gray-300">Parties jouées :</span>
				<span class="text-sm font-bold text-gray-400" id="stats-games-played">42</span>
			</div>
			<div class="flex justify-between items-center py-2 border-b border-gray-700">
				<span class="text-sm font-medium text-gray-300">Victoires :</span>
				<span class="text-sm font-bold text-green-600" id="stats-wins">18</span>
			</div>
			<div class="flex justify-between items-center py-2 border-b border-gray-700">
				<span class="text-sm font-medium text-gray-300">Défaites :</span>
				<span class="text-sm font-bold text-red-600" id="stats-losses">24</span>
			</div>
			<div class="flex justify-between items-center py-2 border-b border-gray-700">
				<span class="text-sm font-medium text-gray-300">Meilleur score :</span>
				<span class="text-sm font-bold text-purple-600" id="stats-best-score">1200</span>
			</div>
			<div class="flex justify-between items-center py-2">
				<span class="text-sm font-medium text-gray-300">Temps de jeu :</span>
				<span class="text-sm font-bold text-blue-600" id="stats-playtime">12h 34m</span>
			</div>
		</div>
    <!-- Main stats -->
    <div class="grid grid-cols-3 gap-4 text-center mt-8">
      <div>
        <div class="text-2xl font-bold text-gray-800" id="stats-rank">2</div>
        <div class="text-sm text-gray-600">Rang</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-gray-800" id="stats-win-rate">42%</div>
        <div class="text-sm text-gray-600">Win Rate</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-gray-800" id="stats-friends">0</div>
        <div class="text-sm text-gray-600">Amis</div>
      </div>
    </div>
	</div>

	<!-- Friends Lists with tabs -->
	<div class="backdrop-blur-2xs border border-gray-50 p-6">
		<h3 class="text-lg font-semibold text-gray-100">Amis</h3>
		
		<div class="mb-4">
			<label for="add-friend-input" class="block text-sm text-gray-300 mb-2">Ajouter un ami</label>
			<div class="flex gap-2">
				<input id="add-friend-input" type="text" placeholder="Nom de l'ami" class="flex-1 px-3 py-2 bg-white/5 border border-gray-700 text-sm text-gray-100 focus:outline-none focus:border-gray-400" />
				<button id="add-friend-btn" class="px-3 py-2 border border-gray-400 text-white text-sm hover:bg-gray-700/50 hover:border-blue-500 transition-colors">Ajouter</button>
			</div>
		</div>
		
		<div class="mb-4 flex items-center justify-between">
			<div class="relative w-60">
				<div id="friends-tab-indicator" class="absolute top-0 left-0 h-full w-1/3 bg-gray-700 transition-transform duration-200" style="transform: translateX(0%);"></div>
				<div class="relative z-10 flex">
					<button id="friends-online-tab" class="flex-1 px-3 py-2 text-sm hover:bg-gray-700/50 text-white text-center">En Ligne</button>
					<button id="friends-offline-tab" class="flex-1 px-3 py-2 text-sm hover:bg-gray-700/50 text-white text-center">Hors Ligne</button>
					<button id="friends-request-tab" class="flex-1 px-3 py-2 text-sm text-white text-center">Request</button>
				</div>
			</div>
	</div>

		<div id="friends-container">
			<div id="online-friends" class="space-y-3">
				<ul id="online-friends-container">
				</ul>
			</div>

			<div id="offline-friends" class="space-y-3 hidden">
				<ul id="offline-friends-container"></ul>
			</div>
			<div id="request-friends" class="space-y-3">
				<ul id="request-friends-container"></ul>
			</div>
		</div>
	</div>
</div>
	`;
	},

  renderHistory() {
          return `
<div class="space-y-6">
  <!-- Filtres -->
  <div class="bg-white p-6">
    <div class="flex flex-wrap gap-4 items-center">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Période :</label>
        <select class="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Dernière semaine</option>
          <option>Dernier mois</option>
          <option>Tout</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Résultat :</label>
        <select class="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tous</option>
          <option>Victoires</option>
          <option>Défaites</option>
        </select>
      </div>
      <button class="mt-6 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
        Filtrer
      </button>
    </div>
  </div>

    <!-- Historique des matches -->
  <div class="bg-white overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">📈 Historique des matches</h3>
    </div>
      
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adversaire</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Évolution elo</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" id="history-container">
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14/01/2024 20:15</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm">👤</span>
                </div>
                <span class="text-sm font-medium text-gray-900">BOB</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5 - 3</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                ✅ Victoire
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5m 23s</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14/01/2024 20:15</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm">👤</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Mike</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 - 5</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                ❌ Défaite
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3m 45s</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">13/01/2024 16:42</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm">👤</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Mathis</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5 - 1</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                ✅ Victoire
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4m 12s</td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12/01/2024 11:20</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm">👤</span>
                </div>
                <span class="text-sm font-medium text-gray-900">Jean</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3 - 5</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                ❌ Défaite
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6m 38s</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

<!-- Statistiques de la période -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-white p-6 text-center">
      <div class="text-3xl font-bold text-blue-600">4</div>
      <div class="text-sm text-gray-600">Parties cette semaine</div>
    </div>
    <div class="bg-white p-6 text-center">
      <div class="text-3xl font-bold text-green-600">2</div>
      <div class="text-sm text-gray-600">Victoires</div>
    </div>
    <div class="bg-white p-6 text-center">
      <div class="text-3xl font-bold text-red-600">2</div>
      <div class="text-sm text-gray-600">Défaites</div>
    </div>
    <div class="bg-white p-6 text-center">
      <div class="text-3xl font-bold text-purple-600">50%</div>
      <div class="text-sm text-gray-600">Winrate</div>
    </div>
  </div>
</div>
`;
  if (sessionStorage.getItem('token') && sessionStorage.getItem('token')) {
			const currentUser = sessionStorage.getItem('username');
			const container = document.querySelector('#history-container') as HTMLTableSectionElement;

			fetch('/user/api/get-match-history', {
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
			.then((data: { matchHistory: any[] }) => {

				const matches = data.matchHistory
					.filter(entry => entry !== null); // On garde tout l’objet du match

				matches.forEach((match) => {
					const victory = match.winner ? "✅ Victoire" : "❌ Défaite";
					const victoryColor = match.winner ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

					const tr = document.createElement('tr');
					tr.className = 'hover:bg-gray-700/40';

					tr.innerHTML = `
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${match.date}</td>
					<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
									<div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-50">
											<img src="${match.avatar}" alt="avatar"/>
									</div>
									<span class="text-sm font-medium text-gray-100">${match.versus}</span>
							</div>
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">${match.score}</td>
					<td class="px-6 py-4 whitespace-nowrap">
							<span class="px-2 py-1 text-xs font-semibold ${victoryColor} rounded-full">
									${victory}
							</span>
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${match.elo}</td>
					`;

					container.appendChild(tr);
				});
			})
			.catch(err => {
				const msg = err.error || 'Impossible de recevoir l\'historique des matches';
				Layout.showNotification(msg, 'error');
			});
		}
	},

  mount(root) {
    // Gestion des onglets
    const profileTab = root.querySelector('#profile-tab') as HTMLButtonElement;
    const historyTab = root.querySelector('#history-tab') as HTMLButtonElement;
    const contentContainer = root.querySelector('#content-container') as HTMLDivElement;
    const indicator = root.querySelector('#tab-indicator') as HTMLDivElement | null;

    const renderContent = () => {
      if (contentContainer) {
        contentContainer.innerHTML = activeTab === 'profile' ? this.renderProfile() : this.renderHistory();
        if (activeTab === 'profile') {
          this.mountProfileEvents(contentContainer);
        }
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
    };

    if (profileTab) {
      profileTab.addEventListener('click', switchToProfile);
    }

    if (historyTab) {
        historyTab.addEventListener('click', switchToHistory);
      }

      // Initial content/events mount based on active tab
      renderContent();
  },

  mountProfileEvents(root: HTMLElement) {
    this.showOnlineFriends(root);

      // Change username
      const addFriendBtn = root.querySelector('#add-friend-btn') as HTMLButtonElement;
      if (addFriendBtn) {
        addFriendBtn.addEventListener('click', () => {
          this.handleAddFriendClick(root);
        });
      }
    const changeUsername = root.querySelector('#change-username') as HTMLElement;
    if (changeUsername) {
      changeUsername.addEventListener('click', () => {
        const newUsername = prompt('Nouveau nom d\'utilisateur:', 'LUCAS');
          if (newUsername) {
            const usernameSpan = root.querySelector('#change-username')?.previousElementSibling;
              if (usernameSpan) {
                usernameSpan.textContent = newUsername.toUpperCase();
              }
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

		//Change mail
    const changeMail = root.querySelector('#change-mail') as HTMLElement;
    if (changeMail) {
      changeMail.addEventListener('click', () => {
        const newMail = prompt('Nouveau mail :', 'LUCA@GMAIL.COM');
          if (newMail) {
            const mailSpan = root.querySelector('#change-mail')?.previousElementSibling;
              if (mailSpan) {
                mailSpan.textContent = newMail.toUpperCase();
              }
          }
      });
    }

    // Change avatar
    const changeAvatar = root.querySelector('#change-avatar') as HTMLElement;
    if (changeAvatar) {
      changeAvatar.addEventListener('change', (event) => {
				const target = event.target as HTMLSelectElement;
        const selectedValue = target.value;
				if (target.value != '')
					this.changeNewAvatar(root, selectedValue);
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
				li.className = 'flex items-center justify-between';
				li.innerHTML = `
				<span class="text-gray-200 flex items-center">
					<span class="inline-block w-2 h-2 mr-2 relative">
					<span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 
						 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-purple-500"></span>
					</span>
					${username}
				</span>
				<button class="invite-btn px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors" id="Btn-${username}">
					Accept
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
				usersWithStatus.forEach((user) => {
					if (user.online) {
						const li = document.createElement('li');
						li.className = 'flex items-center justify-between';
						li.innerHTML = `
					<span class="text-gray-200 flex items-center">
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
				usersWithStatus.forEach((user) => {
					if (!user.online) {
						const li = document.createElement('li');
						li.className = 'flex items-center';
						li.innerHTML = `
					<span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
					<span class="text-gray-200">${user.username}</span>
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

		if (avatar)
		{
			avatar.src = Layout.getUserInfoFromJwt(sessionStorage.getItem('token')).avatar;
			Layout.updateAvatar();
		}
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
