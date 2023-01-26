require('dotenv').config();
const { twict } = require('./config/twictConfig');
const { rabbitSendMessage } = require('./config/rabbitmqConfig');
const { sentryInit } = require('./config/sentryConfig');

async function main() {
  sentryInit(process.env.SENTRY_DSN);

  twict.onDirectMessage((event) => {
    rabbitSendMessage(event);
  });

  twict.onFollow((event) => {
    rabbitSendMessage(event);
  });

  twict.onTweetCreate((event) => {
    rabbitSendMessage(event);
  });

  await twict.listen(process.env.PORT || 3000);
}

main();
