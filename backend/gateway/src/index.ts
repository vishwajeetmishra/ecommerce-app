import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import cors from 'cors';
import bodyParser from 'body-parser';

async function startGateway() {
  const app = express();
  const httpServer = http.createServer(app);

  // Compose subgraphs using introspection from running services
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'product', url: 'http://localhost:4001/graphql' },
        //{ name: 'order', url: 'http://localhost:4002/graphql' },
      ],
    }),
  });

  const server = new ApolloServer({
    gateway,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  httpServer.listen(4000, () => {
    console.log('Gateway ready at http://localhost:4000/graphql');
  });
}

startGateway().catch(console.error);