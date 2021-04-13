import { hash } from 'bcrypt';
import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        const user = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (user) {
          return { ok: false, error: 'This username/email is already token.' };
        }
        const hashedPassword = await hash(password, 10);
        await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
          },
        });
        return { ok: true };
      } catch (error) {
        return { ok: false, error: 'Could not create account.' };
      }
    },
  },
};

export default resolvers;
