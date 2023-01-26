const amqp = require('amqplib');

const queueName = process.env.RABBITMQ_QUEUE_NAME;
const options = {
  credentials: amqp.credentials.plain(process.env.RABBITMQ_USERNAME, process.env.RABBITMQ_PASSWORD),
};

let connection;

async function rabbitConnect() {
  if (!connection) {
    connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOSTNAME}`, options);
  }
}

async function rabbitSendMessage(message) {
  try {
    await rabbitConnect();
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Sent JSON message to queue: ${JSON.stringify(message)}`);
    await channel.close();
  } catch (err) {
    console.error(`Error occurred while sending JSON message: ${err}`);
  }
}

module.exports = { rabbitSendMessage };
