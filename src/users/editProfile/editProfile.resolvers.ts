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
          let avatarUrl = null;
          if (avatar) {
            const { filename, createReadStream } = await avatar;
            const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStram = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + '/uploads/' + newFilename
            );
            readStram.pipe(writeStream);
            avatarUrl = `http://localhost:4000/static/${newFilename}`;
          }
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
              ...(avatarUrl && { avatar: avatarUrl }),
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
