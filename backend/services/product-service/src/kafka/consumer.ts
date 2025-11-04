import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const consumer = kafka.consumer({ groupId: 'product-group' });

export const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-created', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = message.value?.toString();
      console.log(`📥 Received message from topic ${topic}: ${msg}`);
      // Example: here you can trigger inventory update or other business logic
    },
  });

  console.log('✅ Kafka consumer connected and subscribed to order-created');
};