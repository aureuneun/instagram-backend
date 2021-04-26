import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({
        where: { id: userId },
      }),
    hashtags: ({ id }, _, { client }) =>
      client.hashtag.findMany({
        where: { photos: { some: { id } } },
      }),
    likes: ({ id }, _, { client }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),
    commentNumber: ({ id }, _, { client }) =>
      client.comment.count({
        where: {
          photoId: id,
        },
      }),
    comments: ({ id }, _, { client }) =>
      client.comment.findMany({
        where: { photoId: id },
        include: {
          user: true,
        },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser, client }) => {
      const like = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
      });
      if (like) {
        return true;
      }
      return false;
    },
  },
  Hashtag: {
    photos: ({ id }, { page }, { client }) =>
      client.hashtag
        .findUnique({
          where: { id },
        })
        .photos({
          take: 5,
          skip: (page - 1) * 5,
        }),
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({
        where: { hashtags: { some: { id } } },
      }),
  },
};

export default resolvers;
