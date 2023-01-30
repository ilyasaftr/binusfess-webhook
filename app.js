require('dotenv').config();
const { twict } = require('./config/twictConfig');
const { rabbitSendMessage } = require('./config/rabbitmqConfig');
const { sentryInit } = require('./config/sentryConfig');

async function main() {
  sentryInit(process.env.SENTRY_DSN);

  twict.onDirectMessage((event) => {
    rabbitSendMessage('event_directMessage', event);
  });

  twict.onFollow((event) => {
    rabbitSendMessage('event_follow', event);
  });

  twict.onTweetCreate((event) => {
    rabbitSendMessage('event_tweetCreate', event);
  });

  await twict.listen(process.env.PORT || 3000);
}

main();
