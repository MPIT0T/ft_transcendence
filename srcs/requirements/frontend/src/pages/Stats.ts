import type { Page } from "../interface/gameInterface.js"

export const Stats: Page = {
    render() {
        return `
        <div class="flex flex-row " style="gap:10px;">
          <div class="flex flex-col lg:flex-row items-start justify-center  p-6 bg-gray-100 ">
          <!-- Section Profil -->
          <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mb-6 lg:mb-0 lg:mr-8">

          <!-- Avatar-->
        <div class="text-center mb-6">
        <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span class="text-3xl">👤</span>
        </div>
        <p class="text-xs text-blue-500 underline cursor-pointer" id="change-avatar">CHANGE AVATAR</p>
        </div>

        <!-- nom -->
        <div class="text-center mb-6">
        <p class="text-sm text-gray-600 bg-gray-200 rounded font-semibold mb-1">LUCAS</p>
        <p class="text-xs text-blue-500 underline cursor-pointer" id="change-username">CHANGE USERNAME</p>
        </div>


        <!-- mail -->
        <div class="text-center">
        <p class="text-sm text-gray-600 bg-gray-200 rounded font-semibold mb-1">LUCA@GAMIL.COK</p>
        <p class="text-xs text-blue-500 underline cursor-pointer" id="change-mail">CHANGE MAIL</p>
        </div>
          </div>

          <!-- Section Statistiques -->
          <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">

        <!-- Statistiques principales -->
        <div class="grid grid-cols-3 gap-6 text-center mb-8">
        <div>
          <div class="text-3xl font-bold text-gray-800" id="stats-rank">2</div>
          <div class="text-sm text-gray-600">Rank</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-gray-800" id="stats-win-rate">42 %</div>
          <div class="text-sm text-gray-600">Win Rate</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-gray-800" id="stats-friends">0</div>
          <div class="text-sm text-gray-600">Friends</div>
        </div>
        </div>

        <!-- Statistiques détaillées -->
        <div class="space-y-4">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-700">Parties jouées :</span>
          <span class="text-sm font-bold text-gray-900" id="stats-games-played">42</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-700">Victoires :</span>
          <span class="text-sm font-bold text-gray-900" id="stats-wins">18</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-700">Défaites :</span>
          <span class="text-sm font-bold text-gray-900" id="stats-losses">24</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-700">Meilleur score :</span>
          <span class="text-sm font-bold text-gray-900" id="stats-best-score">1200</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-sm font-medium text-gray-700">Temps de jeu :</span>
          <span class="text-sm font-bold text-gray-900" id="stats-playtime">12h 34m</span>
        </div>
        </div>
        </div>
          </div>

          <div class="flex flex-col lg:flex-row items-start justify-center  p-6 bg-gray-100 ">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full h-full max-w-sm mb-6">
            <div class="grid grid-cols-3 gap-6 text-center mb-8">
            <div class="col-span-3">
            <h2 class="text-lg font-semibold mb-4">Online Friends List</h2>

            <ul class="list-disc pl-5 text-left">
            <li class="flex items-center justify-between text-gray-700 mb-2">
              <span>BOB</span>
              <button class="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Invite</button>
            </li>
            <li class="flex items-center justify-between text-gray-700 mb-2">
              <span>Mike</span>
              <button class="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Invite</button>
            </li>
            <li class="flex items-center justify-between text-gray-700 mb-2">
              <span>Mathis</span>
              <button class="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Invite</button>
            </li>
            </ul>
            </div>
            </div>
        </div>
          </div>

          <div class="flex flex-col lg:flex-row items-start justify-center  p-6 bg-gray-100 ">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full h-full max-w-sm mb-6">
            <div class="grid grid-cols-3 gap-6 text-center mb-8">
            <div class="col-span-3">
            <h2 class="text-lg font-semibold mb-4">Ofline Friends List</h2>

            <ul class="list-disc pl-5 text-left">
            <li class="flex items-center justify-between text-gray-700 mb-2">
              <span>Lucas</span>
            </li>
            <li class="flex items-center justify-between text-gray-700 mb-2">
              <span>Marie</span>
            </li>
            <li class="flex items-center justify-between text-gray-700 mb-2">
              <span>Jean</span>
            </li>
            </ul>
            </div>
            </div>
        </div>
          </div>

        </div>
        `;
    },

    mount(root) {

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
                const newMail = prompt('Nouveau mail :', 'LUCA@GAMIL.COK');
                if (newMail) {
                    const mailSpan = root.querySelector('#change-mail')?.previousElementSibling;
                    if (mailSpan) {
                        mailSpan.textContent = newMail.toUpperCase();
                    }
                }
            });
        }

    },

}