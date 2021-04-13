import { gql } from 'apollo-server-core';

export default gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
`;