/**
 * @fileoverview Main entry point for the ft_transcendence application
 * Initializes internationalization and starts the SPA router
 */

import { startRouter } from "./router.js";
import { initI18n } from "./utils/i18n.js";

/**
 * Initialize the application by loading translations first,
 * then starting the SPA router
 */
initI18n().then(() => {
  startRouter();
});
