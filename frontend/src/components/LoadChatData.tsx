// @ts-nocheck
import { useQuery } from "@apollo/client"
import { GET_CHAT_DATA } from "../graphql/queries"
import { Loader2 } from "lucide-react";
import { IChat, IMessage } from "../types";
import { useEffect } from "react";

type Props = {
  id: string;
  userId: string;
  setChatData: (data: IChat) => void
  setMessages: (data: IMessage[]) => void
}

export function LoadChatData({ id, userId, setChatData, setMessages }: Props) {
  const {
    data,
    loading,
    error
  } = useQuery(GET_CHAT_DATA, {
    variables: {
      chatId: id
    }
  })

  useEffect(() => {
    if (loading || (!loading && (!!error || !data))) return;

    const {
      id,
      matchId,
      starter,
      receiver,
      messages
    } = data.getChat;

    const chatData = {
      id,
      matchId,
      user: starter.id === userId ? {...receiver} : {...starter},
    } as unknown as IChat;
    
    setMessages(messages.map(m => ({
      id: m.id,
      seen: m.seen,
      content: m.content,
      senderId: m.sender.id,
      senderProfilePicture: m.sender.profilePicture,
      senderName: m.sender.name
    })))
   
    setChatData(chatData)
  }, [data, loading, error]);

  return (
    <div className="flex flex-col gap-2 m-auto items-center">
      <p className="text-2xl">Carregando mensagens...</p>
      <Loader2 size={64} className="animate-loading-spinning" />
    </div>
  )
}