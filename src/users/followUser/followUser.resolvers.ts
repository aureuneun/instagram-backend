import { Resolvers } from '../../types';
import { protectedResolver } from '../users.utils';

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        try {
          const user = await client.user.findUnique({ where: { username } });
          if (!user) {
            return { ok: false, error: 'That user does not exist.' };
          }
          await client.user.update({
            where: { id: loggedInUser.id },
            data: { following: { connect: { username } } },
          });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not follow.' };
        }
      }
    ),
  },
};

export default resolvers;
