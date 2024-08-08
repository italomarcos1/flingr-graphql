import { gql } from "@apollo/client";

export const GET_USER = gql`
  query($userId: String!) {
    getUser(userId: $userId) {
      id
      name
      bio
      profilePicture
      age
      allAvailableUsers {
        id
        name
        bio
        profilePicture
        age
        gender
      }
      allChats {
        id
        matchId
        lastMessage {
          content
          seen
          receiver {
            id
            name
            profilePicture
          }
          sender {
            id
            name
            profilePicture
          }
        }
      }
      allMatchesLiked {
        id
        createdAt
        status
        matched {
          id
          name
          age
          bio
          profilePicture
        }
      }
      allMatchesReceived {
        id
        createdAt
        status
        liked {
          id
          name
          age
          bio
          profilePicture
        }
      }
    }
  }
`;

export const GET_LAST_MATCH = gql`
  query($matchId: String!) {
    lastMatch(matchId: $matchId) {
      id
      createdAt
      liked {
        id
        name
        age
        bio
        profilePicture
      }
      matched {
        id
        name
        age
        bio
        profilePicture
      }
    }
  }
`;

export const GET_USERS = gql`
  query {
    allUsers {
      id
      name
      bio
      profilePicture
      age
      gender
    }
  }
`;

export const GET_CHAT_DATA = gql`
  query($chatId: String!) {
    getChat(chatId: $chatId) {
      id
      matchId
      starter {
        id
        bio
        age
        name
        profilePicture
      }
      receiver {
        id
        bio
        age
        name
        profilePicture
      }
      messages {
        id
        seen
        content
        senderId
        receiverId
        sender {
          id
          name
          profilePicture
        }
        receiver {
          id
          name
          profilePicture
        }
      }
    }
  }
`;