import { write, notify } from './logger.js';

(function () {
  const error = console.error;
  const warn = console.warn;
  const info = console.info;
  console.error = function (message) {
    const enrichedMessage = `ERROR ${message}\n`;
    write(enrichedMessage);
    notify('MyGES scraper error', enrichedMessage);
    error.apply(console, [message]);
  }
  console.warn = function (message) {
    const enrichedMessage = `WARN ${message}\n`;
    write(enrichedMessage);
    warn.apply(console, [message]);
  }
  console.info = function (message) {
    const enrichedMessage = `INFO ${message}\n`;
    write(enrichedMessage);
    info.apply(console, [message]);
  }
})();
