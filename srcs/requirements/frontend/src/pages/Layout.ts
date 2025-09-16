export const Layout = {
  render(content: string): string {
    return `
      <div class="flex flex-col h-screen font-custom">
        <nav class="h-16 bg-gray-400 flex items-center justify-between">
          <!-- Navigation gauche -->
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
          
          <!-- Navigation droite -->
          <div class="flex items-center gap-4 mx-5">
            <!-- Sélecteur de langue -->
            <div class="flex items-center gap-2">
              <button 
                id="lang-fr" 
                class="w-8 h-6 rounded transition hover:scale-110 hover:shadow-md border-2 border-transparent" 
                data-lang="fr"
                title="Français">
                🇫🇷
              </button>
              <button 
                id="lang-en" 
                class="w-8 h-6 rounded transition hover:scale-110 hover:shadow-md border-2 border-transparent" 
                data-lang="en"
                title="English">
                🇺🇸
              </button>
              <button 
                id="lang-es" 
                class="w-8 h-6 rounded transition hover:scale-110 hover:shadow-md border-2 border-transparent" 
                data-lang="es"
                title="Español">
                🇪🇸
              </button>
            </div>
            
            <!-- Séparateur -->
            <div class="w-px h-8 bg-gray-600"></div>
            
            <!-- Bouton Login -->
            <button 
              id="login-btn" 
              class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg">
              <span class="text-lg mr-2">👤</span>
              <span class="font-semibold">Login</span>
            </button>
          </div>
        </nav>
        <div class="flex bg-[#e9ddcb] flex-1 p-3 gap-6">
          <div class="flex flex-1 items-center justify-center rounded-xl relative">
            <div id="page-content">
              ${content}
            </div>
          </div>
        </div>

        <!-- Modal Login -->
        <div id="login-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
          <div class="bg-white border-4 border-black p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold mb-6 text-center">Login</h3>
            
            <form id="login-form" class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2">Username:</label>
                <input 
                  type="text" 
                  id="username" 
                  class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
                  placeholder="Enter your username"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-bold mb-2">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                >
              </div>
              
              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input type="checkbox" id="remember-me" class="mr-2">
                  <span class="text-sm">Remember me</span>
                </label>
                <button type="button" class="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </button>
              </div>
              
              <div class="flex space-x-4 mt-6">
                <button 
                  type="submit" 
                  class="flex-1 bg-blue-500 text-white py-2 px-4 border-2 border-black hover:bg-blue-600 transition-colors font-bold">
                  LOGIN
                </button>
                <button 
                  type="button" 
                  id="cancel-login" 
                  class="flex-1 bg-red-500 text-white py-2 px-4 border-2 border-black hover:bg-red-600 transition-colors font-bold">
                  CANCEL
                </button>
              </div>
              
              <div class="text-center mt-4 pt-4 border-t border-gray-300">
                <p class="text-sm text-gray-600">Don't have an account?</p>
                <button type="button" id="signup-btn" class="text-blue-500 hover:underline font-semibold">
                  Sign up here
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Register -->
        <div id="register-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
          <div class="bg-white border-4 border-black p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold mb-6 text-center">Register</h3>
            
            <form id="register-form" class="space-y-4">
              <div>
                <label class="block text-sm font-bold mb-2">Username:</label>
                <input 
                  type="text" 
                  id="reg-username" 
                  class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
                  placeholder="Choose a username"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-bold mb-2">Email:</label>
                <input 
                  type="email" 
                  id="reg-email" 
                  class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-bold mb-2">Password:</label>
                <input 
                  type="password" 
                  id="reg-password" 
                  class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
                  placeholder="Create a password"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-bold mb-2">Confirm Password:</label>
                <input 
                  type="password" 
                  id="reg-confirm-password" 
                  class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:border-blue-500"
                  placeholder="Confirm your password"
                  required
                >
              </div>
              
              <div class="flex space-x-4 mt-6">
                <button 
                  type="submit" 
                  class="flex-1 bg-green-500 text-white py-2 px-4 border-2 border-black hover:bg-green-600 transition-colors font-bold">
                  REGISTER
                </button>
                <button 
                  type="button" 
                  id="cancel-register" 
                  class="flex-1 bg-red-500 text-white py-2 px-4 border-2 border-black hover:bg-red-600 transition-colors font-bold">
                  CANCEL
                </button>
              </div>
              
              <div class="text-center mt-4 pt-4 border-t border-gray-300">
                <p class="text-sm text-gray-600">Already have an account?</p>
                <button type="button" id="back-to-login" class="text-blue-500 hover:underline font-semibold">
                  Login here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  mount(root: HTMLElement): void {
    // Navigation buttons
    const homeBtn = root.querySelector('#home-btn') as HTMLButtonElement;
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.location.hash = '/';
      });
    }

    const statsBtn = root.querySelector('#stats-btn') as HTMLButtonElement;
    if (statsBtn) {
      statsBtn.addEventListener('click', () => {
        window.location.hash = '/stats';
      });
    }

    const gameBtn = root.querySelector('#game-btn') as HTMLButtonElement;
    if (gameBtn) {
      gameBtn.addEventListener('click', () => {
        window.location.hash = '/gameLoby';
      });
    }

    // Language management
    const langButtons = root.querySelectorAll('[data-lang]') as NodeListOf<HTMLButtonElement>;
    const currentLang = localStorage.getItem('language') || 'fr';
    
    this.setActiveLanguage(root, currentLang);
    
    langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedLang = btn.dataset.lang;
        if (selectedLang) {
          this.changeLanguage(root, selectedLang);
        }
      });
    });

    // Login button and modal management
    const loginBtn = root.querySelector('#login-btn') as HTMLButtonElement;
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.handleLoginClick(root);
      });
    }

    // Login modal events
    this.setupLoginModal(root);
    this.setupRegisterModal(root);

    // Check if user is already logged in
    this.updateLoginButton(root, localStorage.getItem('isLoggedIn') === 'true');
  },

  setupLoginModal(root: HTMLElement): void {
    const loginModal = root.querySelector('#login-modal') as HTMLDivElement;
    const cancelLoginBtn = root.querySelector('#cancel-login') as HTMLButtonElement;
    const loginForm = root.querySelector('#login-form') as HTMLFormElement;
    const signupBtn = root.querySelector('#signup-btn') as HTMLButtonElement;

    // Cancel button
    if (cancelLoginBtn) {
      cancelLoginBtn.addEventListener('click', () => {
        this.closeModal(loginModal);
      });
    }

    // Close on background click
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        this.closeModal(loginModal);
      }
    });

    // Login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(root);
      });
    }

    // Switch to register
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        this.closeModal(loginModal);
        this.openModal(root.querySelector('#register-modal') as HTMLDivElement);
      });
    }
  },

  setupRegisterModal(root: HTMLElement): void {
    const registerModal = root.querySelector('#register-modal') as HTMLDivElement;
    const cancelRegisterBtn = root.querySelector('#cancel-register') as HTMLButtonElement;
    const registerForm = root.querySelector('#register-form') as HTMLFormElement;
    const backToLoginBtn = root.querySelector('#back-to-login') as HTMLButtonElement;

    // Cancel button
    if (cancelRegisterBtn) {
      cancelRegisterBtn.addEventListener('click', () => {
        this.closeModal(registerModal);
      });
    }

    // Close on background click
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        this.closeModal(registerModal);
      }
    });

    // Register form submission
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister(root);
      });
    }

    // Switch to login
    if (backToLoginBtn) {
      backToLoginBtn.addEventListener('click', () => {
        this.closeModal(registerModal);
        this.openModal(root.querySelector('#login-modal') as HTMLDivElement);
      });
    }
  },

  handleLoginClick(root: HTMLElement): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      // If already logged in, show logout confirmation
      if (confirm('Voulez-vous vous déconnecter ?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        this.showNotification('Déconnexion réussie');
        this.updateLoginButton(root, false);
      }
    } else {
      // Open login modal
      const loginModal = root.querySelector('#login-modal') as HTMLDivElement;
      this.openModal(loginModal);
    }
  },

  handleLogin(root: HTMLElement): void {
    const username = (root.querySelector('#username') as HTMLInputElement).value;
    const password = (root.querySelector('#password') as HTMLInputElement).value;
    const rememberMe = (root.querySelector('#remember-me') as HTMLInputElement).checked;

    console.log('🔐 Login attempt:', { username, rememberMe });

    // Simulate login API call
    setTimeout(() => {
      // Simple validation (you would do real authentication here)
      if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        this.showNotification(`Bienvenue ${username} !`);
        this.updateLoginButton(root, true);
        
        // Close modal and reset form
        const loginModal = root.querySelector('#login-modal') as HTMLDivElement;
        this.closeModal(loginModal);
        (root.querySelector('#login-form') as HTMLFormElement).reset();
      } else {
        this.showNotification('Nom d\'utilisateur ou mot de passe invalide', 'error');
      }
    }, 1000);
  },

  handleRegister(root: HTMLElement): void {
    const username = (root.querySelector('#reg-username') as HTMLInputElement).value;
    const email = (root.querySelector('#reg-email') as HTMLInputElement).value;
    const password = (root.querySelector('#reg-password') as HTMLInputElement).value;
    const confirmPassword = (root.querySelector('#reg-confirm-password') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      this.showNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    console.log('📝 Register attempt:', { username, email });

    // Simulate register API call
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      
      this.showNotification(`Compte créé avec succès ! Bienvenue ${username} !`);
      this.updateLoginButton(root, true);
      
      // Close modal and reset form
      const registerModal = root.querySelector('#register-modal') as HTMLDivElement;
      this.closeModal(registerModal);
      (root.querySelector('#register-form') as HTMLFormElement).reset();
    }, 1000);
  },

  openModal(modal: HTMLDivElement): void {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  closeModal(modal: HTMLDivElement): void {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  },

  // Méthode pour changer la langue
  changeLanguage(root: HTMLElement, lang: string): void {
    localStorage.setItem('language', lang);
    this.setActiveLanguage(root, lang);
    
    console.log(`🌍 Langue changée vers: ${lang}`);
    
    // Exemple de traduction simple
    const translations = {
      fr: { home: 'Accueil', game: 'Jeu', stats: 'Stats', login: 'Connexion' },
      en: { home: 'Home', game: 'Game', stats: 'Stats', login: 'Login' },
      es: { home: 'Inicio', game: 'Juego', stats: 'Stats', login: 'Iniciar' }
    };

    const t = translations[lang as keyof typeof translations];
    if (t) {
      const homeSpan = root.querySelector('#home-btn span:last-child');
      const gameSpan = root.querySelector('#game-btn span:last-child');
      const statsSpan = root.querySelector('#stats-btn span:last-child');
      const loginSpan = root.querySelector('#login-btn span:last-child');

      if (homeSpan) homeSpan.textContent = t.home;
      if (gameSpan) gameSpan.textContent = t.game;
      if (statsSpan) statsSpan.textContent = t.stats;
      if (loginSpan && !localStorage.getItem('isLoggedIn')) loginSpan.textContent = t.login;
    }

    this.showNotification(`Langue changée vers ${this.getLanguageName(lang)}`);
  },

  setActiveLanguage(root: HTMLElement, lang: string): void {
    const langButtons = root.querySelectorAll('[data-lang]') as NodeListOf<HTMLButtonElement>;
    
    langButtons.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.className = 'w-8 h-6 rounded transition hover:scale-110 hover:shadow-md border-2 border-blue-500 shadow-lg transform scale-110';
      } else {
        btn.className = 'w-8 h-6 rounded transition hover:scale-110 hover:shadow-md border-2 border-transparent';
      }
    });
  },

  updateLoginButton(root: HTMLElement, isLoggedIn: boolean): void {
    const loginBtn = root.querySelector('#login-btn') as HTMLButtonElement;
    if (loginBtn) {
      if (isLoggedIn) {
        const username = localStorage.getItem('username') || 'User';
        loginBtn.innerHTML = `
          <span class="text-lg mr-2">👋</span>
          <span class="font-semibold">${username}</span>
        `;
        loginBtn.className = 'flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg';
      } else {
        loginBtn.innerHTML = `
          <span class="text-lg mr-2">👤</span>
          <span class="font-semibold">Login</span>
        `;
        loginBtn.className = 'flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg';
      }
    }
  },

  showNotification(message: string, type: string = 'success'): void {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  getLanguageName(lang: string): string {
    const names = {
      fr: 'Français',
      en: 'English',
      es: 'Español'
    };
    return names[lang as keyof typeof names] || lang;
  }
};