import { createWriteStream } from 'fs';
import { hash } from 'bcrypt';
import { Resolvers } from '../../types';
import { protectedResolver } from '../users.utils';

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, username, email, password, bio, avatar },
        { loggedInUser, client }
      ) => {
        try {
          const { filename, createReadStream } = await avatar;
          const readStram = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + '/uploads/' + filename
          );
          readStram.pipe(writeStream);
          let hashedPassword = null;
          if (password) {
            hashedPassword = await hash(password, 10);
          }
          await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              firstName,
              lastName,
              username,
              email,
              bio,
              ...(hashedPassword && { password: hashedPassword }),
            },
          });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: 'Could not edit profile.' };
        }
      }
    ),
  },
};

export default resolvers;
