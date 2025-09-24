import type { Page } from "../interface/gameInterface.js"

export const Stats: Page = {
    render() {
        return `
            <div class="h-screen bg-transparent p-6 flex flex-col items-center justify-center">
                <!-- Header avec onglets -->
                <div class="max-w-6xl mx-auto mb-6">
                    <div class="bg-white shadow-lg p-1 flex">
                        <button 
                            id="profile-tab" 
                            class="flex-1 px-6 py-3 text-center font-semibold transition-all duration-200 bg-blue-500 text-white">
                            👤 Profile
                        </button>
                        <button 
                            id="history-tab" 
                            class="flex-1 px-6 py-3 text-center font-semibold transition-all duration-200 text-gray-600 hover:bg-gray-100">
                            📈 Match History
                        </button>
                    </div>
                </div>

                <!-- Contenu dynamique -->
                <div id="content-container" class="max-w-6xl mx-auto">
                    ${this.renderProfile()}
                </div>
            </div>
        `;
    },

    renderProfile() {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Profil Section -->
                <div class="bg-white shadow-lg p-6">
                    <!-- Avatar -->
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span class="text-3xl">👤</span>
                        </div>
                        <p class="text-xs text-blue-500 underline cursor-pointer" id="change-avatar">CHANGE AVATAR</p>
                    </div>
                    
                    <!-- Username -->
                    <div class="text-center mb-6">
                        <p class="text-sm text-gray-600 bg-gray-200 font-semibold mb-1 p-2">LUCAS</p>
                        <p class="text-xs text-blue-500 underline cursor-pointer" id="change-username">CHANGE USERNAME</p>
                    </div>
                    
                    <!-- Mail -->
                    <div class="text-center mb-6">
                        <p class="text-sm text-gray-600 bg-gray-200 font-semibold mb-1 p-2">LUCA@GMAIL.COM</p>
                        <p class="text-xs text-blue-500 underline cursor-pointer" id="change-mail">CHANGE MAIL</p>
                    </div>
                    
                    <!-- Statistiques principales -->
                    <div class="grid grid-cols-3 gap-4 text-center mt-8">
                        <div>
                            <div class="text-2xl font-bold text-gray-800" id="stats-rank">2</div>
                            <div class="text-sm text-gray-600">Rank</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-gray-800" id="stats-win-rate">42%</div>
                            <div class="text-sm text-gray-600">Win Rate</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-gray-800" id="stats-friends">0</div>
                            <div class="text-sm text-gray-600">Friends</div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques détaillées -->
                <div class="bg-white shadow-lg p-6">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">📊 Statistiques</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="text-sm font-medium text-gray-700">Parties jouées :</span>
                            <span class="text-sm font-bold text-gray-900" id="stats-games-played">42</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="text-sm font-medium text-gray-700">Victoires :</span>
                            <span class="text-sm font-bold text-green-600" id="stats-wins">18</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="text-sm font-medium text-gray-700">Défaites :</span>
                            <span class="text-sm font-bold text-red-600" id="stats-losses">24</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-100">
                            <span class="text-sm font-medium text-gray-700">Meilleur score :</span>
                            <span class="text-sm font-bold text-purple-600" id="stats-best-score">1200</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-sm font-medium text-gray-700">Temps de jeu :</span>
                            <span class="text-sm font-bold text-blue-600" id="stats-playtime">12h 34m</span>
                        </div>
                    </div>
                </div>

                <!-- Friends Lists -->
                <div class="space-y-6">
                    <!-- Online Friends -->
                    <div class="bg-white shadow-lg p-6">
                        <h3 class="text-lg font-semibold mb-4 text-gray-800">🟢 Online Friends</h3>
                        <ul class="space-y-3">
                            <li class="flex items-center justify-between">
                                <span class="text-gray-700 flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    BOB
                                </span>
                                <button class="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                    Invite
                                </button>
                            </li>
                            <li class="flex items-center justify-between">
                                <span class="text-gray-700 flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Mike
                                </span>
                                <button class="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                    Invite
                                </button>
                            </li>
                            <li class="flex items-center justify-between">
                                <span class="text-gray-700 flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Mathis
                                </span>
                                <button class="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                    Invite
                                </button>
                            </li>
                        </ul>
                    </div>

                    <!-- Offline Friends -->
                    <div class="bg-white shadow-lg p-6">
                        <h3 class="text-lg font-semibold mb-4 text-gray-800">🔴 Offline Friends</h3>
                        <ul class="space-y-3">
                            <li class="flex items-center">
                                <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                <span class="text-gray-700">Lucas</span>
                            </li>
                            <li class="flex items-center">
                                <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                <span class="text-gray-700">Marie</span>
                            </li>
                            <li class="flex items-center">
                                <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                <span class="text-gray-700">Jean</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    renderHistory() {
        return `
            <div class="space-y-6">
                <!-- Filtres -->
                <div class="bg-white shadow-lg p-6">
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
                <div class="bg-white shadow-lg overflow-hidden">
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
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/01/2024 14:30</td>
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
                    <div class="bg-white shadow-lg p-6 text-center">
                        <div class="text-3xl font-bold text-blue-600">4</div>
                        <div class="text-sm text-gray-600">Parties cette semaine</div>
                    </div>
                    <div class="bg-white shadow-lg p-6 text-center">
                        <div class="text-3xl font-bold text-green-600">2</div>
                        <div class="text-sm text-gray-600">Victoires</div>
                    </div>
                    <div class="bg-white shadow-lg p-6 text-center">
                        <div class="text-3xl font-bold text-red-600">2</div>
                        <div class="text-sm text-gray-600">Défaites</div>
                    </div>
                    <div class="bg-white shadow-lg p-6 text-center">
                        <div class="text-3xl font-bold text-purple-600">50%</div>
                        <div class="text-sm text-gray-600">Winrate</div>
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

        const switchToProfile = () => {
            profileTab.className = 'flex-1 px-6 py-3 text-center font-semibold rounded-md transition-all duration-200 bg-blue-500 text-white';
            historyTab.className = 'flex-1 px-6 py-3 text-center font-semibold rounded-md transition-all duration-200 text-gray-600 hover:bg-gray-100';
            contentContainer.innerHTML = this.renderProfile();
            this.mountProfileEvents(root);
        };

        const switchToHistory = () => {
            historyTab.className = 'flex-1 px-6 py-3 text-center font-semibold rounded-md transition-all duration-200 bg-blue-500 text-white';
            profileTab.className = 'flex-1 px-6 py-3 text-center font-semibold rounded-md transition-all duration-200 text-gray-600 hover:bg-gray-100';
            contentContainer.innerHTML = this.renderHistory();
        };

        if (profileTab) {
            profileTab.addEventListener('click', switchToProfile);
        }

        if (historyTab) {
            historyTab.addEventListener('click', switchToHistory);
        }

        // Monter les événements du profil par défaut
        this.mountProfileEvents(root);
    },

    mountProfileEvents(root: HTMLElement) {
        // Change username
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

        // Invite buttons
        const inviteButtons = root.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
        inviteButtons.forEach(btn => {
            if (btn.textContent?.includes('Invite')) {
                btn.addEventListener('click', (e) => {
                    const friendName = btn.closest('li')?.querySelector('span')?.textContent?.trim();
                    alert(`🎮 Invitation envoyée à ${friendName} !`);
                });
            }
        });
    }
}