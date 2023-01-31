require('dotenv').config();
const { twict } = require('./config/twictConfig');
const { rabbitSendMessage } = require('./config/rabbitmqConfig');
const { sentryInit } = require('./config/sentryConfig');

async function main() {
  sentryInit(process.env.SENTRY_DSN);

  twict.onDirectMessage((event) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Triggered] event_directMessage');
      console.log(event);
    }

    rabbitSendMessage('event_directMessage', event);
  });

  twict.onFollow((event) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Triggered] event_follow');
      console.log(event);
    }

    rabbitSendMessage('event_follow', event);
  });

  twict.onTweetCreate((event) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Triggered] event_tweetCreate');
      console.log(event);
    }

    rabbitSendMessage('event_tweetCreate', event);
  });

  await twict.listen(process.env.SERVER_PORT || 3001);
}

main();
