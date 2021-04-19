import { gql } from 'apollo-server-core';

export default gql`
  type Photo {
    id: ID!
    createdAt: String!
    updatedAt: String!
    file: String!
    caption: String
    user: User!
    hashtags: [Hashtag]
    likes: Int!
    isMine: Boolean!
    comments: Int!
  }
  type Hashtag {
    id: ID!
    createdAt: String!
    updatedAt: String!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
  }
  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
