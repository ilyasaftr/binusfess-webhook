const Sentry = require('@sentry/node');

function sentryInit() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });

  Sentry.configureScope((scope) => {
    scope.setTag('environment', process.env.NODE_ENV);
  });
}

module.exports = { sentryInit };
