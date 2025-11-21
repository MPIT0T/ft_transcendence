  import type { StatsPage } from "../interface/gameInterface.js"
  import {Layout} from "./Layout";

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
<div class="bg-transparent flex flex-col w-[70vw] pt-20 items-start">
	<!-- Header avec onglets -->
		<div class="mb-6 w-[70vw] mx-auto">
	<div class="relative backdrop-blur-2xs border border-gray-50 flex overflow-hidden">
			<!-- Sliding indicator -->
			<div id="tab-indicator" class="absolute top-0 left-0 h-full w-1/2 bg-gray-700 transition-transform duration-300 ease-in-out" style="transform:${indicatorTransform};"></div>
			<button 
				id="profile-tab"
				class="relative z-10 flex-1 px-6 py-3 text-center transition-colors duration-200 hover:bg-gray-700/40 text-white">
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
			class="relative z-10 flex-1 px-6 py-3 text-center transition-colors duration-200 hover:bg-gray-700/40 text-white">
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

	<div id="content-container" class="w-[70vw] mx-auto min-h-[60vh] max-h-[70vh] overflow-y-auto">
		${activeTab === 'profile' ? this.renderProfile() : this.renderHistory()}
	</div>
		<div class="w-[70vw] mx-auto flex items-center justify-center p-6 gap-6">
		<button class="text-blue-500  px-6 py-2 text-2xl font-bold backdrop-blur-2xs hover:bg-gray-700 hover:bg-opacity-50">🇫🇷</button>
		<button class="text-red-500  px-6 py-2 text-2xl font-bold backdrop-blur-2xs hover:bg-gray-700 hover:bg-opacity-50">🇬🇧</button>
		<button class="text-yellow-400  px-6 py-2 text-2xl font-bold backdrop-blur-2xs hover:bg-gray-700 hover:bg-opacity-50">🇪🇸</button>
	</div>
</div>
	`;
	},

	renderProfile() {
		// language=HTML
		return `
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Profil Section -->
	<div class="backdrop-blur-2xs border border-gray-50 p-6">
		<!-- Avatar -->
		<div class="text-center mb-6">
				<div class="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border border-gray-50">
				<span class="text-3xl">👤</span>
			</div>
			<p class="text-xs text-blue-500 underline cursor-pointer" id="change-avatar">CHANGE AVATAR</p>
		</div>

		<!-- Username -->
		<div class="text-center mb-6">
				<p class="text-sm text-gray-200 font-semibold mb-1 px-3 py-2 backdrop-blur-2xs border border-gray-400">LUCAS</p>
			<p class="text-xs text-blue-500 underline cursor-pointer" id="change-username">CHANGE USERNAME</p>
		</div>

		<!-- Mail -->
		<div class="text-center mb-6">
				<p class="text-sm text-gray-200 font-semibold mb-1 px-3 py-2 backdrop-blur-2xs border border-gray-400">LUCA@GMAIL.COM</p>
			<p class="text-xs text-blue-500 underline cursor-pointer" id="change-mail">CHANGE MAIL</p>
		</div>

		<div class="text-center mb-6">
	<button class="px-3 py-3 font-bold border border-gray-50 backdrop-blur-2xs text-2xl hover:border-red-500 hover:bg-gray-700 text-gray-50 transition-transform" id="disconnectBtn">Se déconnecter</button>
		</div>

		<!-- Main stats -->
		<div class="grid grid-cols-3 gap-4 text-center mt-8">
			<div>
				<div class="text-2xl font-bold text-gray-100" id="stats-rank">2</div>
				<div class="text-sm text-gray-400">Rank</div>
			</div>
			<div>
				<div class="text-2xl font-bold text-gray-100" id="stats-win-rate">42%</div>
				<div class="text-sm text-gray-400">Win Rate</div>
			</div>
			<div>
				<div class="text-2xl font-bold text-gray-100" id="stats-friends">0</div>
				<div class="text-sm text-gray-400">Friends</div>
			</div>
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
	</div>

	<!-- Friends Lists with tabs -->
	<div class="backdrop-blur-2xs border border-gray-50 p-6">
		<h3 class="text-lg font-semibold text-gray-100">Friends</h3>
		
		<div class="mb-4">
			<label for="add-friend-input" class="block text-sm text-gray-300 mb-2">Ajouter un ami</label>
			<div class="flex gap-2">
				<input id="add-friend-input" type="text" placeholder="Nom de l'ami" class="flex-1 px-3 py-2 bg-white/5 border border-gray-700 text-sm text-gray-100 rounded" />
				<button id="add-friend-btn" class="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">Ajouter</button>
			</div>
		</div>
		
		<div class="mb-4 flex items-center justify-between">
			<div class="relative w-56">
				<div id="friends-tab-indicator" class="absolute top-0 left-0 h-full w-1/2 bg-gray-700 rounded-md transition-transform duration-200" style="transform: translateX(0%);"></div>
				<div class="relative z-10 flex">
					<button id="friends-online-tab" class="flex-1 px-3 py-2 text-sm text-white text-center">Online</button>
					<button id="friends-offline-tab" class="flex-1 px-3 py-2 text-sm text-white text-center">Offline</button>
				</div>
			</div>
	</div>

		<div id="friends-container">
			<div id="online-friends" class="space-y-3">
				<ul>
					<li class="flex items-center justify-between">
						<span class="text-gray-200 flex items-center">
							<span class="w-2 h-2 bg-green-500 mr-2"></span>
							BOB
						</span>
						<button class="invite-btn px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors">
							Invite
						</button>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-gray-200 flex items-center">
							<span class="w-2 h-2 bg-green-500 mr-2"></span>
							Mike
						</span>
						<button class="invite-btn px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors">
							Invite
						</button>
					</li>
					<li class="flex items-center justify-between">
						<span class="text-gray-200 flex items-center">
							<span class="w-2 h-2 bg-green-500 mr-2"></span>
							Mathis
						</span>
						<button class="invite-btn px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors">
							Invite
						</button>
					</li>
				</ul>
			</div>

			<div id="offline-friends" class="space-y-3 hidden">
				<ul>
					<li class="flex items-center">
						<span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
						<span class="text-gray-200">Lucas</span>
					</li>
					<li class="flex items-center">
						<span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
						<span class="text-gray-200">Marie</span>
					</li>
					<li class="flex items-center">
						<span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
						<span class="text-gray-200">Jean</span>
					</li>
				</ul>
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
									<div class="backdrop-blur-2xs border border-gray-50 p-6">
											<div class="flex flex-wrap gap-4 items-center">
													<div>
															<label class="block text-sm font-medium text-gray-200 mb-1">Période :</label>
															<select class="px-3 py-2 bg-white/5 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
																	<option>Dernière semaine</option>
																	<option>Dernier mois</option>
																	<option>Tout</option>
															</select>
													</div>
													<div>
															<label class="block text-sm font-medium text-gray-200 mb-1">Résultat :</label>
															<select class="px-3 py-2 bg-white/5 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
																	<option>Tous</option>
																	<option>Victoires</option>
																	<option>Défaites</option>
															</select>
													</div>
													<button class="mt-6 px-4 py-2 text-white border border-gray-50 hover:bg-gray-700/50 transition-colors">
															Filtrer
													</button>
											</div>
									</div>
	
									<!-- Historique des matches -->
									<div class="backdrop-blur-2xs border border-gray-50 overflow-hidden">
											<div class="px-6 py-4 border-b border-gray-700">
													<h3 class="text-lg font-semibold text-gray-100">📈 Historique des matches</h3>
											</div>
											
										<div class="overflow-x-auto">
													<table class="w-full">
													<thead class="bg-transparent">
																	<tr>
																<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
																<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Adversaire</th>
																<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
																<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Résultat</th>
																<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durée</th>
																	</tr>
															</thead>
													<tbody class="bg-transparent divide-y divide-gray-800">
														<tr class="hover:bg-gray-700/40">
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">15/01/2024 14:30</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<div class="flex items-center">
																	<div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-50">
																									<span class="text-sm">👤</span>
																							</div>
																	<span class="text-sm font-medium text-gray-100">BOB</span>
																					</div>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">5 - 3</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
																							✅ Victoire
																					</span>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">5m 23s</td>
																	</tr>
														<tr class="hover:bg-gray-700/40">
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">14/01/2024 20:15</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<div class="flex items-center">
																	<div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-50">
																									<span class="text-sm">👤</span>
																							</div>
																	<span class="text-sm font-medium text-gray-100">Mike</span>
																					</div>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">2 - 5</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
																							❌ Défaite
																					</span>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">3m 45s</td>
																	</tr>
														<tr class="hover:bg-gray-700/40">
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">13/01/2024 16:42</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<div class="flex items-center">
																	<div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-50">
																									<span class="text-sm">👤</span>
																							</div>
																	<span class="text-sm font-medium text-gray-100">Mathis</span>
																					</div>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">5 - 1</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
																							✅ Victoire
																					</span>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">4m 12s</td>
																	</tr>
														<tr class="hover:bg-gray-700/40">
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">12/01/2024 11:20</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<div class="flex items-center">
																	<div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 border border-gray-50">
																									<span class="text-sm">👤</span>
																							</div>
																	<span class="text-sm font-medium text-gray-100">Jean</span>
																					</div>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100">3 - 5</td>
																			<td class="px-6 py-4 whitespace-nowrap">
																					<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
																							❌ Défaite
																					</span>
																			</td>
															<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">6m 38s</td>
																	</tr>
															</tbody>
													</table>
											</div>
									</div>
	
									<!-- Statistiques de la période -->
									<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
											<div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
													<div class="text-3xl font-bold text-blue-400">4</div>
													<div class="text-sm text-gray-400">Parties cette semaine</div>
											</div>
											<div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
													<div class="text-3xl font-bold text-green-400">2</div>
													<div class="text-sm text-gray-400">Victoires</div>
											</div>
											<div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
													<div class="text-3xl font-bold text-red-400">2</div>
													<div class="text-sm text-gray-400">Défaites</div>
											</div>
											<div class="backdrop-blur-2xs border border-gray-50 p-6 text-center">
													<div class="text-3xl font-bold text-purple-400">50%</div>
													<div class="text-sm text-gray-400">Winrate</div>
											</div>
									</div>
							</div>
					`;
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

		// Change mail
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
			changeAvatar.addEventListener('click', () => {
				alert('🎨 Fonctionnalité de changement d\'avatar à venir !');
			});
		}

		// Friends tabs (Online / Offline)
		const onlineTab = root.querySelector('#friends-online-tab') as HTMLButtonElement | null;
		const offlineTab = root.querySelector('#friends-offline-tab') as HTMLButtonElement | null;
		const tabIndicator = root.querySelector('#friends-tab-indicator') as HTMLDivElement | null;
		const onlineSection = root.querySelector('#online-friends') as HTMLElement | null;
		const offlineSection = root.querySelector('#offline-friends') as HTMLElement | null;

		const showOnline = () => {
			if (tabIndicator) tabIndicator.style.transform = 'translateX(0%)';
			if (onlineSection) onlineSection.classList.remove('hidden');
			if (offlineSection) offlineSection.classList.add('hidden');
		};

		const showOffline = () => {
			if (tabIndicator) tabIndicator.style.transform = 'translateX(100%)';
			if (offlineSection) offlineSection.classList.remove('hidden');
			if (onlineSection) onlineSection.classList.add('hidden');
		};

		if (onlineTab) onlineTab.addEventListener('click', showOnline);
		if (offlineTab) offlineTab.addEventListener('click', showOffline);

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
  }
}
export default Stats
