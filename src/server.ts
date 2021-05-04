require('dotenv').config();
import http from 'http';
import express from 'express';
import morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import client from './client';
import { getUser } from './users/users.utils';

const PORT = process.env.PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        loggedInUser: connection.context['loggedInUser'],
        client,
      };
    }
    const token = req.headers['authorization'];
    return {
      loggedInUser: await getUser(token),
      client,
    };
  },
  subscriptions: {
    onConnect: async (params) => {
      const token = params['Authorization'];
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token);
      return { loggedInUser };
    },
  },
});

const app = express();
app.use(morgan('dev'));
app.use('/static', express.static('uploads'));
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () =>
  console.log(`🚀Server is running on http://localhost:${PORT} ✅`)
);
