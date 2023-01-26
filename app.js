require('dotenv').config();
const { twict } = require('./config/twictConfig');
const { rabbitSendMessage } = require('./config/rabbitmqConfig');
const { sentryInit, sentryStartTransaction, sentryEndTransaction } = require('./config/sentryConfig');

async function main() {
  sentryInit(process.env.SENTRY_DSN);

  twict.onDirectMessage((event) => {
    sentryStartTransaction('twict-ondirectmessage', 'rabbitmq-send-message');
    rabbitSendMessage(event);
    sentryEndTransaction();
  });

  twict.onFollow((event) => {
    sentryStartTransaction('twict-onfollow', 'rabbitmq-send-message');
    rabbitSendMessage(event);
    sentryEndTransaction();
  });

  twict.onTweetCreate((event) => {
    sentryStartTransaction('twict-ontweetcreate', 'rabbitmq-send-message');
    rabbitSendMessage(event);
    sentryEndTransaction();
  });
}

main();
