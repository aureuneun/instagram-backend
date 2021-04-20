import { withFilter } from 'graphql-subscriptions';
import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';

const resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        try {
          const room = await context.client.room.findFirst({
            where: {
              id: args.id,
              users: {
                some: {
                  id: context.loggedInUser.id,
                },
              },
            },
            select: {
              id: true,
            },
          });
          if (!room) {
            throw new Error('You shall not see this.');
          }
          return withFilter(
            () => pubsub.asyncIterator(NEW_MESSAGE),
            ({ roomUpdates }, variables) => {
              return roomUpdates.roomId === variables.id;
            }
          )(root, args, context, info);
        } catch (error) {
          throw new Error('You can not listen.');
        }
      },
    },
  },
};

export default resolvers;
