import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver((_, { offset }, { loggedInUser, client }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              userId: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        skip: offset,
      })
    ),
  },
};

export default resolvers;
