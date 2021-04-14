import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
      try {
        const user = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!user) {
          return { ok: false, error: 'That user does not exist.' };
        }
        const followers = await client.user
          .findUnique({ where: { username } })
          .followers({
            take: 5,
            skip: (page - 1) * 5,
          });
        const totalFollowers = await client.user.count({
          where: { following: { some: { username } } },
        });
        return {
          ok: true,
          followers,
          totalPage: Math.ceil(totalFollowers / 5),
        };
      } catch (error) {
        return { ok: false, error: 'Could not find followers' };
      }
    },
  },
};

export default resolvers;
