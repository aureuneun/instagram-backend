import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    searchPhotos: (_, { keyword, lastId }, { client }) =>
      client.photo.findMany({
        where: {
          caption: {
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
