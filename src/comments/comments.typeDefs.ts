import { gql } from 'apollo-server-core';

export default gql`
  type Comment {
    id: ID!
    createdAt: String!
    updatedAt: String!
    user: User!
    photo: Photo!
    payload: String!
    isMine: Boolean!
  }
`;
