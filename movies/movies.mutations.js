import client from '../client';

export default {
  Mutation: {
    createMovie: (root, { title, year, genre }, context, info) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (root, { id }, context, info) =>
      client.movie.delete({ where: { id } }),
    updateMovie: (root, { id, year }, context, info) =>
      client.movie.update({ where: { id }, data: { year } }),
  },
};
