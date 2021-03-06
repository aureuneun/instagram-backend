import { NEW_MESSAGE } from '../../constants';
import pubsub from '../../pubsub';
import { Resolvers } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser, client }) => {
        try {
          let room = null;
          if (userId) {
            const user = await client.user.findUnique({
              where: {
                id: userId,
              },
              select: {
                id: true,
              },
            });
            if (!user) {
              return { ok: false, error: 'User not found' };
            }
            room = await client.room.create({
              data: {
                users: {
                  connect: [
                    {
                      id: userId,
                    },
                    {
                      id: loggedInUser.id,
                    },
                  ],
                },
              },
            });
          } else if (roomId) {
            room = await client.room.findUnique({
              where: {
                id: roomId,
              },
              select: {
                id: true,
              },
            });
            if (!room) {
              return {
                ok: false,
                error: 'Room not found',
              };
            }
          }
          const message = await client.message.create({
            data: {
              payload,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              room: {
                connect: {
                  id: room.id,
                },
              },
            },
          });
          pubsub.publish(NEW_MESSAGE, { roomUpdates: message });
          return { ok: true, id: message.id };
        } catch (error) {
          return { ok: false, error: 'Could not send message' };
        }
      }
    ),
  },
};

export default resolvers;
