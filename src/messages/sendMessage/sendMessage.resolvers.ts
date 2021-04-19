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
          await client.message.create({
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
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not send message' };
        }
      }
    ),
  },
};

export default resolvers;
