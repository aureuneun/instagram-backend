import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser, client }) => {
        try {
          const photo = await client.photo.findUnique({
            where: {
              id: photoId,
            },
          });
          if (!photo) {
            return { ok: false, error: 'Photo not found' };
          }
          await client.comment.create({
            data: {
              payload,
              photo: {
                connect: {
                  id: photoId,
                },
              },
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
            },
          });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not create comment' };
        }
      }
    ),
  },
};

export default resolvers;
