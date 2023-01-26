const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

function sentryInit() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.SENTRY_TRACING_RATE,
  });

  Sentry.configureScope((scope) => {
    scope.setTag('environment', process.env.NODE_ENV);
  });

  Tracing.init({
    tracesSampleRate: process.env.SENTRY_TRACING_RATE,
  });
}

function sentryStartTransaction(transactionName, op) {
  Sentry.configureScope((scope) => {
    scope.setTransactionName(transactionName);
    scope.setTag('transaction_op', op);
    scope.startTransaction();
  });
  Tracing.startTransaction({ name: transactionName, op });
}

function sentryEndTransaction() {
  Sentry.finishTransaction();
  Tracing.finishTransaction();
}

module.exports = { sentryInit, sentryStartTransaction, sentryEndTransaction };
