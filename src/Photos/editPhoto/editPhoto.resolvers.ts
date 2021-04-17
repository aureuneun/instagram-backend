import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser, client }) => {
        try {
          const photo = await client.photo.findFirst({
            where: {
              id,
              userId: loggedInUser.id,
            },
            include: {
              hashtags: {
                select: {
                  hashtag: true,
                },
              },
            },
          });
          if (!photo) {
            return { ok: false, error: 'Photo not found.' };
          }
          await client.photo.update({
            where: {
              id,
            },
            data: {
              caption,
              hashtags: {
                disconnect: photo.hashtags,
                connectOrCreate: processHashtags(caption),
              },
            },
          });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not edit photo.' };
        }
      }
    ),
  },
};

export default resolvers;
