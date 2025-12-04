import { startRouter } from "./router.js";
import { initI18n } from "./utils/i18n.js";

// Initialize i18n first, then start router
initI18n().then(() => {
  startRouter();
});
