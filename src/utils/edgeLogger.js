// utils/edgeLogger.js

const NEW_RELIC_LOGGING_ENDPOINT = 'https://log-api.newrelic.com/log/v1';
const NEW_RELIC_LICENSE_KEY = '5d940797802e0c53cdbd9269eb527eb4FFFFNRAL'; // Put your actual key here

async function sendLogToNewRelic(level, message, meta) {
  try {
    await fetch(NEW_RELIC_LOGGING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': NEW_RELIC_LICENSE_KEY,
      },
      body: JSON.stringify([
        {
          message,
          level,
          attributes: meta,
        }
      ])
    });
  } catch (error) {
    console.error('Failed to send log to New Relic', error);
  }
}

export const edgeLogger = {
  info: (message, meta) => {
    console.log(`INFO: ${message}`, meta);
    sendLogToNewRelic('info', message, meta);
  },
  warn: (message, meta) => {
    console.warn(`WARN: ${message}`, meta);
    sendLogToNewRelic('warn', message, meta);
  },
  error: (message, meta) => {
    console.error(`ERROR: ${message}`, meta);
    sendLogToNewRelic('error', message, meta);
  }
};
