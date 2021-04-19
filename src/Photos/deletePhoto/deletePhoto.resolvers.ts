import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        try {
          const photo = await client.photo.findUnique({
            where: {
              id,
            },
            select: {
              userId: true,
            },
          });
          if (!photo) {
            return {
              ok: false,
              error: 'Photo not found',
            };
          } else if (photo.userId !== loggedInUser.id) {
            return {
              ok: false,
              error: 'Not authorized',
            };
          } else {
            await client.photo.delete({
              where: {
                id,
              },
            });
          }
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not delete photo.' };
        }
      }
    ),
  },
};

export default resolvers;