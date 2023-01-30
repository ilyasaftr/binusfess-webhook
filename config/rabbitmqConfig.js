const amqp = require('amqplib');
const Sentry = require('./sentryConfig');

const options = {
  credentials: amqp.credentials.plain(process.env.RABBITMQ_USERNAME, process.env.RABBITMQ_PASSWORD),
};

let connection;

async function rabbitConnect() {
  if (!connection) {
    connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOSTNAME}`, options);
  }
}

async function rabbitSendMessage(queueName, message) {
  try {
    await rabbitConnect();
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log('Sent message to queue');
    await channel.close();
  } catch (err) {
    Sentry.captureException(err);
    console.log(`Error occurred while sending message: ${err}\n`);
  }
}

module.exports = { rabbitSendMessage };
