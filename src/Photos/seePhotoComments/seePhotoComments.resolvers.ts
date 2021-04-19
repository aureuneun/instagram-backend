import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: (_, { id }, { client }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
  },
};

export default resolvers;
