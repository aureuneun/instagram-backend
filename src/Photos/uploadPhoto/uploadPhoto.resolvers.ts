import { uploadToS3 } from '../../shared/shared.utils';
import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser, client }) => {
        try {
          let hashtagObj = [];
          if (caption) {
            hashtagObj = processHashtags(caption);
          }
          const fileUrl = await uploadToS3(file, loggedInUser.id, 'uploads');
          return client.photo.create({
            data: {
              file: fileUrl,
              caption,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              ...(hashtagObj.length > 0 && {
                hashtags: {
                  connectOrCreate: hashtagObj,
                },
              }),
            },
          });
        } catch (error) {
          return null;
        }
      }
    ),
  },
};

export default resolvers;
