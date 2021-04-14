import { gql } from 'apollo-server-core';

export default gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    avatar: String
    followers: [User]
    following: [User]
    createdAt: String!
    updatedAt: String!
  }
`;
