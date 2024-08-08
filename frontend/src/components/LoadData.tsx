// @ts-nocheck
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
import { useEffect } from "react";
import { AppData, IMatch } from "../types";

type Props = {
  id: string
  setAppData: (data: AppData) => void
}

export function LoadData({ id, setAppData }: Props) {
  const { data: userData, loading: userLoading, error: userError } =
    useQuery(GET_USER, { variables: { userId: id } })

  useEffect(() => {
    console.log("aaa")
    if (userLoading || (!userLoading && (!!userError || !userData))) return;

    const {
      allChats,
      allMatchesLiked,
      allMatchesReceived,
      allAvailableUsers,
      ...user
    } = userData.getUser;

    const matches: IMatch[] = [
      ...allMatchesLiked.map(m => ({
        id: m.id,
        createdAt: m.createdAt,
        status: m.status,
        user: {...m.matched}
      })),
      ...allMatchesReceived.map(m => ({
        id: m.id,
        createdAt: m.createdAt,
        status: m.status,
        user: {...m.liked}
      }))
    ]

    const chats = allChats.map(c => ({
      id: c.id,
      matchId: c.matchId,
      seen: c.lastMessage.seen,
      content: c.lastMessage.content,
      user: c.lastMessage.receiver.id === id ? {...c.lastMessage.sender} : {...c.lastMessage.receiver},
      sentByYou: c.lastMessage.sender.id === id
    }))

    setAppData({ user, matches, chats, users: allAvailableUsers });
  }, [userData, userError, userLoading])

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-4 h-4 rounded-full bg-base-primary/20 border-white/80 animate-loading-splash2"></div>
      <div className="absolute w-4 h-4 rounded-full bg-base-primary/20 border-white/80 animate-loading-splash1"></div>
      <img src="/tinder.svg" alt="" className="z-10 w-16 h-16" />
    </div>
  )
}