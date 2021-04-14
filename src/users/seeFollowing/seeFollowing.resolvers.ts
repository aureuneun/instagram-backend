import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
      try {
        const user = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!user) {
          return { ok: false, error: 'That user does not exist.' };
        }
        const following = await client.user
          .findUnique({ where: { username } })
          .following({
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
          });
        return { ok: true, following };
      } catch (error) {
        return { ok: false, error: 'Could not find following' };
      }
    },
  },
};

export default resolvers;
