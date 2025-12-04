/**
 * i18n - Internationalization utility module
 * Provides translation functions and language management
 */

type TranslationDict = Record<string, Record<string, string>>;

// Default language (French)
const DEFAULT_LANG = 'fr';
const SUPPORTED_LANGS = ['fr', 'en', 'es'] as const;
type SupportedLang = typeof SUPPORTED_LANGS[number];

// Cache for translations
let translationsCache: TranslationDict | null = null;
let currentLang: string = DEFAULT_LANG;
let loadingPromise: Promise<TranslationDict> | null = null;

/**
 * Load translations from JSON file (cached)
 * Automatically called - no need to call manually
 */
export async function loadTranslations(): Promise<TranslationDict> {
  if (translationsCache) return translationsCache;
  
  // Prevent multiple simultaneous loads
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = (async () => {
    try {
      const res = await fetch('/translations.json');
      if (!res.ok) throw new Error('Failed to load translations');
      translationsCache = await res.json();
      return translationsCache!;
    } catch (err) {
      console.error('i18n: Failed to load translations', err);
      return {};
    } finally {
      loadingPromise = null;
    }
  })();
  
  return loadingPromise;
}

/**
 * Get the current language from storage or default
 */
export function getCurrentLang(): SupportedLang {
  const stored = localStorage.getItem('language') || sessionStorage.getItem('language');
  if (stored && SUPPORTED_LANGS.includes(stored as SupportedLang)) {
    return stored as SupportedLang;
  }
  return DEFAULT_LANG;
}

/**
 * Set the current language and persist it
 */
export function setCurrentLang(lang: SupportedLang): void {
  currentLang = lang;
  localStorage.setItem('language', lang);
  sessionStorage.setItem('language', lang);
}

/**
 * Translate a key to the current language
 * Falls back to French if key not found, then to the key itself
 * Supports interpolation: t('hello', { name: 'John' }) for "Hello {{name}}"
 */
export function t(key: string, params?: Record<string, string | number>): string {
  if (!translationsCache) {
    // Trigger async load for next time, return key for now
    loadTranslations();
    return key;
  }
  
  const lang = getCurrentLang();
  let text = translationsCache[lang]?.[key] 
    || translationsCache[DEFAULT_LANG]?.[key] 
    || key;
  
  // Handle interpolation {{variable}}
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
    });
  }
  
  return text;
}

/**
 * Apply translations to all elements with data-i18n attribute
 * Call this after rendering a page/component
 */
export async function applyTranslations(root: HTMLElement | Document = document): Promise<void> {
  if (!translationsCache) {
    await loadTranslations();
  }
  
  if (!translationsCache) {
    console.warn('i18n: Failed to load translations');
    return;
  }
  
  const lang = getCurrentLang();
  const translations = translationsCache[lang] || translationsCache[DEFAULT_LANG] || {};
  
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!key) return;
    
    // Special handling for login button when logged in
    if (key === 'login-btn' && sessionStorage.getItem('isLoggedIn')) return;
    
    const translation = translations[key];
    if (translation) {
      // Handle placeholder attribute for inputs
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        (el as HTMLInputElement).placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });
  
  // Also handle data-i18n-placeholder for explicit placeholder translations
  root.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (!key) return;
    const translation = translations[key];
    if (translation) {
      el.placeholder = translation;
    }
  });
}

/**
 * Change language and re-apply all translations
 */
export async function changeLanguage(lang: SupportedLang, root: HTMLElement | Document = document): Promise<void> {
  if (!SUPPORTED_LANGS.includes(lang)) {
    console.warn(`i18n: Unsupported language "${lang}"`);
    return;
  }
  
  setCurrentLang(lang);
  
  // Ensure translations are loaded
  if (!translationsCache) {
    await loadTranslations();
  }
  
  applyTranslations(root);
  
  // Dispatch event for components that need to re-render
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

/**
 * Initialize i18n - call this at app startup
 */
export async function initI18n(): Promise<void> {
  currentLang = getCurrentLang();
  await loadTranslations();
}

/**
 * Get supported languages list (for language selector)
 */
export function getSupportedLanguages(): readonly string[] {
  return SUPPORTED_LANGS;
}

export default {
  t,
  loadTranslations,
  applyTranslations,
  changeLanguage,
  getCurrentLang,
  setCurrentLang,
  initI18n,
  getSupportedLanguages
};
