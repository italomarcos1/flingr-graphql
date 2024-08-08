import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { IChat, IMatch } from "../types";
import { useAuth } from "./auth";
import { useSubscription } from "@apollo/client";
import { NEW_MATCH, NEW_MESSAGE } from "../graphql/subscriptions";
import { X } from "lucide-react";
import { apolloClient } from "../lib/apollo";
import { GET_LAST_MATCH } from "../graphql/queries";

type NotificationContextData = {
  hi: string;
}

type NotificationProviderProps = {
  children: ReactNode;
}

type NotificationData = {
  id: string;
  type: "match" | "message";
  matchName: string;
  matchProfilePicture: string;
  content: string;
  createdAt?: string;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData)

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [hasNotification, setHasNotification] = useState<NotificationData | null>(null)
  const { user, appData, setAppData } = useAuth();

  const {
    data: newMatchData,
    loading: newMatchLoading,
    error: newMatchError,
  } = useSubscription(NEW_MATCH, {
    variables: {
      userId: user.id
    }
  });

  const {
    data: newMessageData,
    loading: newMessageLoading,
    error: newMessageError,
  } = useSubscription(NEW_MESSAGE, {
    variables: {
      userId: user.id
    }
  });

  const dispatchMatch = useCallback(async () => {
    const { id, createdAt, ...match } = newMatchData.newMatch
    
    setHasNotification({
      id,
      type: "match",
      matchName: match.matchName,
      matchProfilePicture: match.matchProfilePicture,
      content: match.matchName + " também gostou de você.",
      // @ts-ignore
      createdAt: Date.now(new Date(createdAt))
    })

    const { data, error } = await apolloClient.query({
      query: GET_LAST_MATCH,
      variables: { matchId: id }
    })

    if (error) {
      console.log("error on last match retrieval")
      return;
    }
    const { lastMatch } = data;

    const newMatch: IMatch = {
      id: lastMatch.id,
      createdAt: lastMatch.createdAt,
      status: "new",
      user:
        lastMatch.liked.id === user.id ? {...lastMatch.matched} : {...lastMatch.liked}
    } as IMatch
    
    // @ts-ignore
    if (newMatch.user.__typename) // @ts-ignore
      delete newMatch.user.__typename

    setAppData({
      ...appData,
      matches: [newMatch, ...appData.matches]
    })
  }, [appData, newMatchData, user])

  const dispatchChat = useCallback(async () => {
    const {
      chatId: id,
      senderId,
      senderName,
      senderProfilePicture,
      content
    } = newMessageData.newMessage;

    // @ts-ignore
    if (window.location.pathname.split("/").at(-1) !== id) {
      setHasNotification({
        id,
        type: "message",
        matchName: senderName,
        matchProfilePicture: senderProfilePicture,
        content
      })
    }

    const updatedChat: IChat = {
      id,
      user: {
        name: senderName,
        profilePicture: senderProfilePicture
      },
      seen: false,
      content: content,
      sentByYou: false
    } as unknown as IChat

    if (appData.matches.find(m => m.user.id !== senderId)) {
      console.log("we")
      setAppData({
        ...appData,
        matches: appData.matches.filter(m => m.user.id !== senderId),
        chats: [updatedChat, ...appData.chats.filter(c => c.id !== id)]
      })

      history.replaceState(null, "", `/chat/${id}`)
      window.location.reload()

      return;
    }

    setAppData({
      ...appData,
      chats: [updatedChat, ...appData.chats.filter(c => c.id !== id)]
    })
  }, [appData, newMessageData, user])


  useEffect(() => {
    if (!newMatchLoading && !newMatchError && !!newMatchData) {
      const timeout = setTimeout(() => setHasNotification(null), 4000)
      dispatchMatch()
      
      return () => clearTimeout(timeout)
    }
  }, [newMatchData, newMatchLoading, newMatchError])
  
  useEffect(() => {
    if (!newMessageLoading && !newMessageError && !!newMessageData) {
      console.log("newMessageData", newMessageData.newMessage);
      const timeout = setTimeout(() => setHasNotification(null), 4000)
      dispatchChat()
      
      return () => clearTimeout(timeout)  
    }
  }, [newMessageData, newMessageLoading, newMessageError])


  // retornar o id do match e ao clicar, jogar pra tela do match

  return (
    <NotificationContext.Provider value={{ hi: ""}}>
      <>
        {children}
        {hasNotification &&
          <div className="fixed flex items-center gap-2 p-4 z-30 h-24 rounded-lg bg-base-secondary/40 border-b border-b-white/20 top-2 left-1/2 backdrop-blur-sm animate-toast-notification">
            <img src={hasNotification.matchProfilePicture} alt="" className="w-14 h-14 rounded-full object-cover" />
            <div className="flex flex-col gap-1">
              <strong className="text-xl">{hasNotification.type === "match" ? "Novo match!" : hasNotification.matchName}</strong>
              <p className="leading-none">{hasNotification.content}</p>
              <div className="animate-toast-closing rounded-b-lg bg-base-secondary h-1 absolute left-0 bottom-0"></div>
              <button
                className="absolute top-2 right-2"
                onClick={() => setHasNotification(null)}
              >
                <X size={16} color="#FBFDFD" />
              </button>
            </div>
          </div>
        }
      </>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error("useNotification must be used within AuthContext provider");
  }

  return context;
}