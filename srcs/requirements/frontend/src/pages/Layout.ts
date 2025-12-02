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

declare global {
  interface Window {
    googleAuthListenerAdded?: boolean;
  }
}

export const Layout = {
  render(content: string): string {
    return `
      <div class="flex flex-col h-screen font-custom font-tiny5 ">
        <nav class="fixed w-screen z-20 h-24 flex items-center justify-between backdrop-blur-2xs border-b border-gray-50">
          <!-- Navigation gauche -->
          <div class="flex my-5 gap-3 mx-5">
            <button id="home-btn" class="flex items-center px-3 py-1  hover:bg-gray-700/50 transition-all duration-300">
              <div class="relative inline-block
                  z-10 text-4xl text-transparent bg-clip-text
                  bg-linear-to-r from-red-500 via-blue-500 to-green-500
                  bg-size-[400%_400%] animate-gradientShift">
                ft_
              </div>
            </button>
          </div>
          
          <!-- Navigation droite -->
          <div class="flex items-center gap-4 mx-5">
            <!-- Sélecteur de langue -->
<!--            <div class="flex items-center gap-2">-->
<!--              <button -->
<!--                id="lang-fr" -->
<!--                class="w-8 h-6 transition bg-transparent hover:bg-gray-300" -->
<!--                data-lang="fr"-->
<!--                title="Français">-->
<!--                🇫🇷-->
<!--              </button>-->
<!--              <button -->
<!--                id="lang-en"-->
<!--                class="w-8 h-6 transition hover:bg-gray-300 border-2"-->
<!--                data-lang="en"-->
<!--                title="English">-->
<!--                🇺🇸-->
<!--              </button>-->
<!--              <button-->
<!--                id="lang-es"-->
<!--                class="w-8 h-6 transition hover:bg-gray-300 border-2"-->
<!--                data-lang="es"-->
<!--                title="Español">-->
<!--                🇪🇸-->
<!--              </button>-->
<!--            </div>-->
            
            <!-- Séparateur -->
<!--            <div class="w-px h-8 bg-gray-600"></div>-->
            
            <!-- Bouton Login -->
            <button
              id="login-btn"
              class="flex items-center px-3 py-2
                  bg-gray-800 text-gray-50
                  shadow-[3px_3px_0_#000]
                  hover:bg-gray-700/50
                  hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_#000]
                  transition-all duration-100">
              <span class="text-lg mr-2">👤</span>
              <span data-i18n="login-btn" class="text-xs text-gray-50">Connexion</span>
            </button>
          </div>
        </nav>
        <canvas id="background-canvas" class="fixed top-0 left-0 w-full h-full -z-10"></canvas>
        <div class="flex flex-1 p-3 gap-6">
          <div class="flex flex-1 items-center justify-center relative">
            <div id="page-content">
              ${content}
            </div>
          </div>
        </div>

        <!-- Modal Login -->
        <div id="login-modal" class="fixed inset-0 hidden items-center justify-center backdrop-blur-lg z-50">
          <div class="border border-gray-50 p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold mb-6 text-center text-gray-50">Login</h3>
            
            <form id="login-form" class="space-y-4">
              <div>
                <label class="block text-sm text-gray-50 font-bold mb-2">Username:</label>
                <input 
                  type="text" 
                  id="username" 
                  class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
                  placeholder="Enter your username"
                  pattern="^[a-zA-Z0-9]{3,12}$"
                  title="Le nom doit contenir uniquement des lettres et chiffres (3-12 caractères)"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm text-gray-500 font-bold mb-2">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
                  placeholder="Enter your password"
                  pattern="^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,18}$"
                  title="Le mot de passe doit contenir 6-18 caractères, au moins 1 majuscule et 1 chiffre"
                  required
                >
              </div>
              
<!--              <div class="flex items-center justify-between">-->
<!--                <label class="flex items-center">-->
<!--                  <input type="checkbox" id="remember-me" class="mr-2">-->
<!--                  <span class="text-sm text-gray-50">Remember me</span>-->
<!--                </label>-->
<!--                <button type="button" class="text-sm text-gray-50 hover:underline">-->
<!--                  Forgot password?-->
<!--                </button>-->
<!--              </div>-->
              
              <div class="flex space-x-4 mt-6">
                <button 
                  type="submit" 
                  class="flex-1 text-white py-2 px-4 border border-gray-50 hover:border-blue-500 hover:bg-gray-700 transition-all font-bold">
                  LOGIN
                </button>
                <button 
                  type="button" 
                  id="cancel-login" 
                  class="flex-1 text-white py-2 px-4 border border-gray-50 hover:border-red-500 hover:bg-gray-700 transition-all font-bold">
                  CANCEL
                </button>
              </div>
              
              <div class="text-center mt-4 pt-4 border-t border-gray-300">
                <button type="button" id="signup-btn" class="py-2 text-gray-50 font-bold w-full flex items-center justify-center border border-gray-50 bg-transparent hover:bg-gray-700/50">
                  Sign up here
                </button>
              </div>
              
              <div class="text-center mt-4 pt-4 border-t border-gray-300">
                <button type="button" id="google-btn" class="py-2 text-gray-50 font-bold w-full flex items-center justify-center border border-gray-50 bg-transparent hover:bg-gray-700/50">
                  <img class="w-8 h-8 mr-3" src="google-logo.svg" alt="google-logo"/>
                  Sign in with Google
                </button>
              </div>
              
            </form>
          </div>
        </div>

        <!-- Modal Register -->
        <div id="register-modal" class="fixed inset-0 hidden items-center justify-center z-50 backdrop-blur-lg">
          <div class="border border-white p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl text-gray-50 font-bold mb-6 text-center">Register</h3>
            
            <form id="register-form" class="space-y-4">
              <div>
                <label class="block text-sm text-gray-50 font-bold mb-2">Username:</label>
                <input 
                  type="text" 
                  id="reg-username" 
                  class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
                  placeholder="Choose a username"
                  pattern="^[a-zA-Z0-9]{3,12}$"
                  title="Le nom doit contenir uniquement des lettres et chiffres (3-12 caractères)"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm text-gray-50 font-bold mb-2">Password:</label>
                <input 
                  type="password" 
                  id="reg-password" 
                  class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
                  placeholder="Create a password"
                  pattern="^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,18}$"
                  title="Le mot de passe doit contenir 6-18 caractères, au moins 1 majuscule et 1 chiffre"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm text-gray-50 font-bold mb-2">Confirm Password:</label>
                <input 
                  type="password" 
                  id="reg-confirm-password" 
                  class="w-full px-3 py-2 border border-gray-400 text-gray-200 focus:outline-none focus:border-gray-50"
                  placeholder="Confirm your password"
                  pattern="^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,18}$"
                  title="Le mot de passe doit contenir 6-18 caractères, au moins 1 majuscule et 1 chiffre"
                  required
                >
              </div>
              
              <div class="flex space-x-4 mt-6">
                <button 
                  type="submit" 
                  class="flex-1 text-white py-2 px-4 border border-white hover:border-green-500 hover:bg-gray-700/50 transition-colors font-bold">
                  REGISTER
                </button>
                <button 
                  type="button" 
                  id="cancel-register" 
                  class="flex-1 text-white py-2 px-4 border border-white hover:border-red-500 hover:bg-gray-700/50 transition-colors font-bold">
                  CANCEL
                </button>
              </div>
              
              <div class="text-center mt-4 pt-4 border-t border-gray-300">
                <button type="button" id="back-to-login" class="py-2 text-gray-50 font-bold w-full flex items-center justify-center border border-gray-50 bg-transparent hover:bg-gray-700/50">
                  Login here
                </button>
              </div>
              
              <div class="text-center mt-4 pt-4 border-t border-gray-300">
                <button type="button" id="google-btn2" class="py-2 text-gray-50 font-bold w-full flex items-center justify-center border border-gray-50 bg-transparent hover:bg-gray-700/50">
                  <img class="w-8 h-8 mr-3" src="google-logo.svg" alt="google-logo"/>
                  Sign in with Google
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async handleGoogleLogin(root: HTMLElement, code: string): Promise<void> {

    const res = await fetch("/user/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    })
    if (res.ok) {
      const data = await res.json();
      const userInfo = await this.getUserInfoFromJwt(data.token);
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', userInfo.username);
      this.showNotification(`Bienvenue ${userInfo.username} !`);
      this.updateLoginButton(root, true);
      const loginModal = root.querySelector('#login-modal') as HTMLDivElement;
      this.closeModal(loginModal);
      (root.querySelector('#login-form') as HTMLFormElement).reset();
    }
  },

  mount(root: HTMLElement): void {
    // Navigation buttons

    if (!(globalThis as any).loginIntervalId) {
      (globalThis as any).loginIntervalId = setInterval(async () => {
        if (sessionStorage.getItem('token') && sessionStorage.getItem('username') && sessionStorage.getItem('isLoggedIn')) {
          try {
            const res = await fetch('/user/login/ping', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
              },
              body: JSON.stringify({ username: sessionStorage.getItem('username') }),
            });
            if (!res.ok) {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('isLoggedIn');
              sessionStorage.removeItem('username');
              this.updateLoginButton(root, false);
            }
          } catch (err) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            this.updateLoginButton(root, false);
          }
        }
      }, 5000);
    }

    const homeBtn = root.querySelector('#home-btn') as HTMLButtonElement;
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        const p = '/';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    const statsBtn = root.querySelector('#stats-btn') as HTMLButtonElement;
    if (statsBtn) {
      statsBtn.addEventListener('click', () => {
        const p = '/stats';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    const gameBtn = root.querySelector('#game-btn') as HTMLButtonElement;
    if (gameBtn) {
      gameBtn.addEventListener('click', () => {
        const p = '/gameLoby';
        history.pushState(null, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }

    initPastelBackground();

    // Language management
    const langButtons = root.querySelectorAll('[data-lang]') as NodeListOf<HTMLButtonElement>;
    const currentLang = sessionStorage.getItem('language') || 'fr';

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
    this.updateLoginButton(root, sessionStorage.getItem('isLoggedIn') === 'true');
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

    if (!sessionStorage.getItem('token') || !sessionStorage.getItem('isLoggedIn') || !sessionStorage.getItem('username')) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
    }

    if (sessionStorage.getItem('token') && sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('username')) {
      fetch('/user/api/check-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ token: sessionStorage.getItem('token'), username: sessionStorage.getItem('username') })
      })
        .then(res => {
          if (!res.ok) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
          }
        })
    }
  },

  redirectIfNotLoggedIn(redirectTo = '/', triedTo: boolean = false): void {
    if (!Layout.isLoggedIn()) {
      history.pushState(null, '', redirectTo);
      window.dispatchEvent(new PopStateEvent('popstate'));
      if (triedTo) Layout.showNotification('Connectez-vous pour accéder à ce contenu', 'error');
    }
  },



  setupRegisterModal(root: HTMLElement): void {
    const registerModal = root.querySelector('#register-modal') as HTMLDivElement;
    const cancelRegisterBtn = root.querySelector('#cancel-register') as HTMLButtonElement;
    const registerForm = root.querySelector('#register-form') as HTMLFormElement;
    const backToLoginBtn = root.querySelector('#back-to-login') as HTMLButtonElement;
    const googleBtn = root.querySelector('#google-btn') as HTMLButtonElement;
    const googleBtn2 = root.querySelector('#google-btn2') as HTMLButtonElement;

    window.googleAuthListenerAdded = window.googleAuthListenerAdded || false;

    if (!window.googleAuthListenerAdded) {
      const handler = (event: MessageEvent) => {
        if (event.origin !== window.origin) return;
        if (event.data.type === 'google-auth') {
          const code = event.data.code;
          this.handleGoogleLogin(root, code);
        }
      };

      window.addEventListener('message', handler);
      window.googleAuthListenerAdded = true;
    }

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

    // google registration
    const clientId = "646709615614-o4v2kdnbn5mhjkncnme6mdqhbd0j3lt5.apps.googleusercontent.com";
    const redirectUri = window.location.origin + "/oauth-callback.html";
    console.log(redirectUri);

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}` +
          `&redirect_uri=${redirectUri}` +
          `&response_type=code` +
          `&scope=openid%20email%20profile` +
          `&access_type=online` +
          `&prompt=consent`;

        const googleWindow = window.open(
          googleAuthUrl,
          'Google OAuth',
          `width=${width},height=${height},top=${top},left=${left}`
        );
      });
    }

    if (googleBtn2) {
      googleBtn2.addEventListener('click', () => {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const googleAuthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${clientId}` +
          `&redirect_uri=${redirectUri}` +
          `&response_type=code` +
          `&scope=openid%20email%20profile` +
          `&access_type=online` +
          `&prompt=consent`;

        const googleWindow = window.open(
          googleAuthUrl,
          'Google OAuth',
          `width=${width},height=${height},top=${top},left=${left}`
        );
      });
    }


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
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      const p = '/stats';
      history.pushState(null, '', p);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Open login modal
      const loginModal = root.querySelector('#login-modal') as HTMLDivElement;
      this.openModal(loginModal);
    }
  },

  async handleLogin(root: HTMLElement): Promise<void> {
    const username = (root.querySelector('#username') as HTMLInputElement).value;
    const password = (root.querySelector('#password') as HTMLInputElement).value;

    if (username && password) {
      const res = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        this.showNotification(`Bienvenue ${username} !`);
        this.updateLoginButton(root, true);
        const loginModal = root.querySelector('#login-modal') as HTMLDivElement;
        this.closeModal(loginModal);
        (root.querySelector('#login-form') as HTMLFormElement).reset();
      } else if (res.status === 401) {
        this.showNotification('Nom d\'utilisateur ou mot de passe invalide', 'error');
      }
    }
  },

  getUserInfoFromJwt(token: string | null) {

    if (!token) {
      return {
        username: "anonymous",
        avatar: "/anonymous.png",
      };
    }
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return {
      username: payload.username,
      avatar: payload.avatar,
      elo: payload.elo,
    };
  },

  async handleRegister(root: HTMLElement): Promise<void> {
    const username = (root.querySelector('#reg-username') as HTMLInputElement).value;
    const password = (root.querySelector('#reg-password') as HTMLInputElement).value;
    const confirmPassword = (root.querySelector('#reg-confirm-password') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      this.showNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    console.log('📝 Register attempt:', { username });

    // Simulate register API call
    let stayInModale = false;
    if (username && password) {
      try {
        const res = await fetch('/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('username', username);
          this.showNotification(`Compte créé avec succès ! Bienvenue ${username} !`);

          this.updateLoginButton(root, true);
        }
        else if (res.status === 400) {
          const data = await res.json();

          this.showNotification(data.error, 'error');
          stayInModale = true;
        }
        else if (res.status === 401) {
          this.showNotification("Nom d'utilisateur deja utilise", 'error');
          stayInModale = true;
        }
      } catch (err) {
        this.showNotification("Erreur de serveur, veuillez reessayer ulterieurement", 'error');
      }
      if (!stayInModale) {
        const registerModal = root.querySelector('#register-modal') as HTMLDivElement;
        this.closeModal(registerModal);
        (root.querySelector('#register-form') as HTMLFormElement).reset();
      }
    }
  },

  openModal(modal: HTMLDivElement): void {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  },

  closeModal(modal: HTMLDivElement): void {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  },

  async changeLanguage(root: HTMLElement, lang: string): Promise<void> {
    sessionStorage.setItem("language", lang);
    this.setActiveLanguage(root, lang);

    console.log(`Changed language to ${lang}`);

    const res = await fetch("translations.json");
    const translations = await res.json();

    const t = translations[lang];
    if (!t) return;

    root.querySelectorAll<HTMLElement>("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n as keyof typeof t;

      if (key === "login" && sessionStorage.getItem("isLoggedIn")) return;

      if (t[key]) el.textContent = t[key];
    });
  },

  setActiveLanguage(root: HTMLElement, lang: string): void {
    const langButtons = root.querySelectorAll('[data-lang]') as NodeListOf<HTMLButtonElement>;

    langButtons.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.className = 'w-8 h-6 transition bg-gray-800 hover:bg-gray-800 transform ';
      } else {
        btn.className = 'w-8 h-6 transition hover:bg-gray-800 ';
      }
    });
  },

  isLoggedIn(): boolean {
    return  (sessionStorage.getItem('token')) ? true : false;
  },

  updateLoginButton(root: HTMLElement, isLoggedIn: boolean): void {
    const loginBtn = root.querySelector('#login-btn') as HTMLButtonElement;
    if (loginBtn) {
      if (isLoggedIn) {
        const username = sessionStorage.getItem('username') || 'User';
        const userInfo = this.getUserInfoFromJwt(sessionStorage.getItem('token'));
        const avatarSrc = this.getAvatarPath(userInfo.avatar || 'anonymous.png');

        loginBtn.innerHTML = `
        <img src="${avatarSrc}" alt="avatar" id="user-avatar-layout" class="w-8 h-8 mr-2 rounded-full border border-gray-50" />
        <span class="text-3xl font-bold text-transparent bg-clip-text
        bg-gradient-to-r from-red-500 via-blue-500 to-green-500
        bg-[length:400%_400%] animate-gradientShift" id="username-layout">${username}</span>
      `;
        loginBtn.className = `
        flex items-center px-3 py-2
        hover:bg-gray-700/50
        transition-all duration-100
      `;
      } else {
        loginBtn.innerHTML = `
        <img src="/anonymous.png" alt="login" class="w-8 h-8 mr-2 rounded-full border border-gray-50"/>
        <span data-i18n="login-btn" class="text-2xl text-gray-50">Connexion</span>
      `;
        loginBtn.className = `
        flex items-center px-3 py-2
        text-gray-50
        hover:bg-gray-700/50
        transition-all duration-100
      `;
      }
    }
  },

  showNotification(message: string, type: string = 'success'): void {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20';
    notification.className = `fixed bottom-4 right-4 ${bgColor} text-gray-50 font-tiny5 px-4 py-2 border border-gray-50 z-50 transition-all duration-300 transform translate-x-full`;
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
  },

  updateAvatar() {
    const avatar = document.getElementById('user-avatar-layout') as HTMLImageElement;

    if (avatar) {
      const avatarData = Layout.getUserInfoFromJwt(sessionStorage.getItem('token')).avatar;
      const cacheBuster = `?t=${Date.now()}`;
      avatar.src = this.getAvatarPath(avatarData) + cacheBuster;
    }
  },

  getAvatarPath(avatar: string): string {
    console.log(avatar);
    if (avatar.startsWith('/') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    return '/' + avatar;
  },

  updateUsername() {
    const username = document.getElementById('username-layout') as HTMLSpanElement;

    if (username)
      username.textContent = sessionStorage.getItem('username');
  }
};
