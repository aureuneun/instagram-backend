import { User } from '.prisma/client';
import { PrismaClient } from '.prisma/client';

type Context = {
  loggedInUser: User;
  client: PrismaClient;
};

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
