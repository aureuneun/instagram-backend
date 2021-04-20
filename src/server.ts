require('dotenv').config();
import * as http from 'http';
import * as express from 'express';
import * as morgan from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import client from './client';
import { getUser } from './users/users.utils';

const PORT = process.env.PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    const token = connection
      ? connection.context['Authorization']
      : req.headers['authorization'];
    return {
      loggedInUser: await getUser(token),
      client,
    };
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
