import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    searchUser: (_, { keyword, lastId }, { client }) =>
      client.user.findMany({
        where: {
          username: {
            startsWith: keyword,
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};

export default resolvers;
