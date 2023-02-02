const amqp = require('amqplib');
const { sentryCapture } = require('./sentryConfig');

const options = {
  credentials: amqp.credentials.plain(process.env.RABBITMQ_USERNAME, process.env.RABBITMQ_PASSWORD),
};

let connection;
let isConnected = false;

async function rabbitConnect() {
  try {
    if (!isConnected) {
      connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOSTNAME}/${process.env.RABBITMQ_VIRTUALHOST}`, options);
      connection.on('close', () => {
        isConnected = false;
        console.error('[RabbitMQ] RabbitMQ connection closed, attempting to reconnect...');
        rabbitConnect();
      });
      connection.on('error', (error) => {
        isConnected = false;
        console.error(`[RabbitMQ] RabbitMQ connection error: ${error}`);
        rabbitConnect();
      });
      connection.on('blocked', (reason) => {
        console.error(`[RabbitMQ] RabbitMQ connection blocked due to: ${reason}`);
      });
      connection.on('unblocked', () => {
        console.log('[RabbitMQ] RabbitMQ connection unblocked');
      });

      isConnected = true;
      console.log('[RabbitMQ] Successfully connected to RabbitMQ');
    }
  } catch (error) {
    sentryCapture(error);
    isConnected = false;
    console.error(`[RabbitMQ] Error connecting to RabbitMQ: ${error}`);
    setTimeout(rabbitConnect, 5000);
  }
}

async function rabbitSendMessage(queueName, message) {
  try {
    await rabbitConnect();
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log('[RabbitMQ] Sent message to queue');
    await channel.close();
  } catch (err) {
    sentryCapture(err);
    console.log(`[RabbitMQ] Error occurred while sending message: ${err}\n`);
  }
}

module.exports = { rabbitSendMessage };
