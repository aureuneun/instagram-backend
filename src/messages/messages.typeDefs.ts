import { gql } from 'apollo-server-core';

export default gql`
  type Room {
    id: ID!
    createdAt: String!
    updatedAt: String!
    users: [User]
    messages: [Message]
    unreadTotal: Int!
  }
  type Message {
    id: ID!
    createdAt: String!
    updatedAt: String!
    user: User!
    room: Room!
    payload: String!
    read: Boolean!
  }
`;
