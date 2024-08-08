export type IUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio: string;
  age: number;
  gender: string;
}

export type IMatch = {
  id: string;
  user: IUser;
  status: "new" | "active" | "inactive";
  createdAt: string;
}

export type IChat = {
  id: string;
  matchId: string;
  content: string;
  user: IUser;
  seen: boolean;
  sentByYou: boolean;
}

export type IMessage = {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  senderName: string;
  senderProfilePicture: string;
}

export type AppData = {
  matches: IMatch[];
  chats: IChat[];
  users: IUser[];
  user: IUser;
}
