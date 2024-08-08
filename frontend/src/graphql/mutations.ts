import { gql } from "@apollo/client";

export const NEW_CHAT = gql`
  mutation($receiverId: String!, $starterId: String!, $matchId: String!) {
    newChat(receiverId: $receiverId, starterId: $starterId, matchId: $matchId) {
      id
    }
  }
`;

export const SEND_LIKE = gql`
  mutation ($senderId: String!, $receiverId: String!) {
    sendLike(senderId: $senderId, receiverId: $receiverId) {
      id
    }
  }
`

export const SEND_DISLIKE = gql`
  mutation ($senderId: String!, $receiverId: String!) {
    sendDislike(senderId: $senderId, receiverId: $receiverId) {
      id
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation($chatId: String!, $content: String!, $receiverId: String!, $senderId: String!) {
    sendMessage(chatId: $chatId, content: $content, receiverId: $receiverId, senderId: $senderId) {
      id
      content
    }
  }
`;

export const UPDATE_MATCH = gql`
  mutation($matchId: String!, $status: String!) {
    updateMatch(matchId: $matchId, status: $status)
  }
`;

export const UPDATE_MESSAGE_TO_SEEN = gql`
  mutation($chatId: String!) {
    updateMessageToSeen(chatId: $chatId)
  }
`;

export const DELETE_MATCH = gql`
  mutation($matchId: String!) {
    deleteMatch(matchId: $matchId)
  }
`;

export const UNMATCH = gql`
  mutation($chatId: String!, $matchId: String!) {
    deleteChat(chatId: $chatId, matchId: $matchId)
  }
`;

