import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { connectProducer } from './kafka/producer';
import { connectConsumer } from './kafka/consumer';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
  const server = new ApolloServer({ schema });

  await server.start();

  app.use('/graphql', express.json(), expressMiddleware(server));

  await connectProducer();
  await connectConsumer();

  httpServer.listen(4001, () => console.log('Product Service running at http://localhost:4001/graphql'));
}

startServer().catch(console.error);