import { gql } from "@apollo/client";

export const NEW_MATCH = gql`
  subscription($userId: String!)  {
    newMatch(userId: $userId) {
      id
      matchName
      matchProfilePicture
      createdAt
    }
  }
`;

export const NEW_MESSAGE = gql`
  subscription($userId: String!)  {
    newMessage(userId: $userId) {
      id
      chatId
      content
      senderId
      senderName
      senderProfilePicture
    }
  }
`;

export const NEW_MESSAGE_FROM_CURRENT_CHAT = gql`
  subscription($chatId: String!)  {
    newMessageFromCurrentChat(chatId: $chatId) {
      id
      chatId
      content
      senderId
      senderName
      senderProfilePicture
    }
  }
`;

export const TEST_NEST = gql`
  subscription  {
    catCreated {
      id
      name
      age
    }
  }
`;