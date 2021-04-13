import { verify } from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }
    const verified = verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({
      where: { id: verified['id'] },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: 'Please log in to perform this action.',
      };
    }
    return ourResolver(root, args, context, info);
  };
}
