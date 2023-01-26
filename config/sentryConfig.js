const Sentry = require('@sentry/node');

function sentryInit() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.SENTRY_TRACING_RATE,
  });

  Sentry.configureScope((scope) => {
    scope.setTag('environment', process.env.NODE_ENV);
  });
}

module.exports = { sentryInit };
