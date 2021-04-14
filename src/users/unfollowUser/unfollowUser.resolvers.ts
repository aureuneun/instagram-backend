import { Resolvers } from '../../types';
import { protectedResolver } from '../users.utils';

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        try {
          const user = await client.user.findUnique({ where: { username } });
          if (!user) {
            return { ok: false, error: 'That user does not exist.' };
          }
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              following: {
                disconnect: {
                  username,
                },
              },
            },
          });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not unfollow.' };
        }
      }
    ),
  },
};

export default resolvers;
