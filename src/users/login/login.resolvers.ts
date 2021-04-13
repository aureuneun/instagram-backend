import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
      try {
        const user = await client.user.findUnique({ where: { username } });
        if (!user) {
          return { ok: false, error: 'User not found.' };
        }
        const check = await compare(password, user.password);
        if (!check) {
          return { ok: false, error: 'Password is wrong.' };
        }
        const token = sign({ id: user.id }, process.env.SECRET_KEY);
        return { ok: true, token };
      } catch (error) {
        return { ok: false, error: 'Could not log in' };
      }
    },
  },
};

export default resolvers;
