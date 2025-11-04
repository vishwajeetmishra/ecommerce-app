import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('✅ Kafka producer connected');
};

export const sendProductCreated = async (product: any) => {
  await producer.send({
    topic: 'product-created',
    messages: [{ value: JSON.stringify(product) }],
  });
  console.log(`📤 Published product-created event for product ${product.id}`);
};