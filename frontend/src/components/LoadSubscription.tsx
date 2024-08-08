import { useSubscription } from "@apollo/client";
import { NEW_MESSAGE_FROM_CURRENT_CHAT } from "../graphql/subscriptions";
import { useEffect } from "react";
import { IMessage } from "../types";

type Props = {
  chatId: string
  setMessages: (data: IMessage) => void
}

export function LoadSubscription({ chatId, setMessages }: Props) {
  const {
    data: newMessageData,
    loading: newMessageLoading,
    error: newMessageError,
  } = useSubscription(NEW_MESSAGE_FROM_CURRENT_CHAT, {
    variables: {
      chatId
    }
  });

  useEffect(() => {
    if (!newMessageLoading && !newMessageError && !!newMessageData) {
      const newMessage: IMessage = {
        ...newMessageData.newMessageFromCurrentChat
      } as IMessage

      console.log("newMessage from LoadSubscription", newMessageData)
  
      if ("__typeName" in newMessage)
        delete newMessage.__typeName


      setMessages(newMessage)
    }
  }, [newMessageData, newMessageLoading, newMessageError])

  return (<></>)
}

