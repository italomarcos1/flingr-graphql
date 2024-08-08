import { useMutation } from '@apollo/client';
import { SendHorizontal, X } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NEW_CHAT, SEND_MESSAGE, UPDATE_MATCH } from '../graphql/mutations';
import { IChat, IMessage } from '../types';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/auth';
import { formatDateDifference } from '../utils';
import { LoadSubscription } from '../components/LoadSubscription';

export function Match() {
  const { user, appData, setAppData } = useAuth();
  const formRef = useRef<HTMLFormElement>(null)

  const navigate = useNavigate()

  const [newChat, newChatData] = useMutation(NEW_CHAT)
  const [sendMessage, sendMessageData] = useMutation(SEND_MESSAGE)
  const [updateMatch] = useMutation(UPDATE_MATCH)
  
  const { state } = useLocation();
  
  const matchData = useMemo(() =>
    !!state ? ({
      id: state.id,
      status: state.status,
      user: state.user,
      timeSpan: formatDateDifference(state.date) 
    }) : null
  , [state])

  const [timeSpan, timeSpanType] = useMemo(() =>
    !!matchData ? matchData.timeSpan.split(" ") : " "
    , [matchData])

  const [messages, setMessages] = useState<IMessage[]>([])
 
  const [chatId, setChatId] = useState("");
  const [matchUpdatedToActive, setMatchUpdatedToActive] = useState(false);

  const handleSendMessage = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!matchData) return;

    // @ts-ignore
    const formData = new FormData(e.target)
    const message = formData.get("message")

    let currentChatId = chatId;
    
    if (!currentChatId) {
      const chatData = await newChat({
        variables: {
          receiverId: matchData.user.id,
          starterId: user.id,
          matchId: matchData.id
        }
      })

      const newChatId = chatData.data.newChat.id;
      
      currentChatId = newChatId;
      setChatId(newChatId)

      //TODO: update to "active", not delete
      //TODO: allUsers should return only "new" or "active"
      // useEffect
      // if match.new
      // mutation UPDATE_MATCH ("active")

      await updateMatch({
        variables: {
          matchId: matchData.id,
          status: "inactive"
        }
      })

      const updatedChat: IChat = {
        id: newChatId,
        content: message,
        user: {
          name: matchData.user.name,
          profilePicture: matchData.user.profilePicture,
        },
        sentByYou: true
      } as unknown as IChat

      setAppData({
        ...appData,
        matches: appData.matches.filter(m => m.id !== matchData.id),
        chats: [updatedChat, ...appData.chats]
      })
    } else {
      const updatedChat: IChat = {
        id: currentChatId,
        content: message,
        user: {
          name: matchData.user.name,
          profilePicture: matchData.user.profilePicture,
        },
        sentByYou: true
      } as unknown as IChat

      setAppData({
        ...appData,
        chats: [updatedChat, ...appData.chats.filter(c => c.id !== currentChatId)]
      })
    }

    await sendMessage({
      variables: {
        chatId: currentChatId,
        content: message,
        receiverId: matchData.user.id,
        senderId: user.id
      },
    })
  }, [user, matchData, chatId, newChat, sendMessage, updateMatch])

  useEffect(() => {
    if (!!state && !matchData) {
      navigate("/home")
    }
  }, [state, matchData, navigate])

  useEffect(() => {
    if (!!matchData && matchData.status === "new" && !matchUpdatedToActive) {
      updateMatch({
        variables: {
          matchId: matchData.id,
          status: "active"
        }
      })

      setAppData({
        ...appData,
        matches: appData.matches.map(m => m.id === matchData.id ? ({ ...m, status: "active" }) : m)
      })

      setMatchUpdatedToActive(true)
    } 
  }, [matchData, appData])

  return (
    <>
      <Sidebar
        user={user}
        matches={appData.matches}
        chats={appData.chats}
      />
      <div className="w-full flex h-full">
        <div className="w-full flex flex-col items-center h-full">
          <header className="w-full flex items-center justify-between px-6 py-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <img
                src={!!matchData && matchData.user.profilePicture}
                alt="Your match profile picture" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <strong className="text-xl">{!!matchData && matchData.user.name}</strong>
            </div>
            <Link
              to="/home"
              className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 duration-200 disabled:cursor-not-allowed hover:scale-105 hover:bg-white/20"
            >
              <X size={24} className="text-white/20" strokeWidth={4} />
            </Link>
          </header>
          {!!messages.length ?
            <div
              className="flex flex-col overflow-y-scroll mt-auto gap-1 p-4 w-full scroll-smooth"
            >
              {messages.map((m, index) =>
                <div
                  key={m.id}
                  className={`flex items-center gap-2 ${m.senderId === user.id ? "self-end" : "self-start flex-row-reverse"} ${!!index && messages[index - 1].senderId !== m.senderId ? "mt-2" : ""}`}
                >
                  <p className="py-2 px-4 rounded-full bg-gradient-to-b from-base-superLike/90 to-base-superLike/70 backdrop-blur-sm">
                    {m.content}
                  </p>
                  <img
                    src={m.senderProfilePicture}
                    title={m.senderName}
                    alt={m.senderName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              )} 
            </div> :
            !!matchData && (
              <div className="flex flex-col items-center justify-center w-full !h-full">
                <p className="text-xl">Você deu match com <b>{matchData.user.name}</b></p>
                <p className="text-base font-light">{timeSpan !== "hoje" && "há "}<b className="font-normal">{timeSpan}</b> {timeSpanType}</p>
                <img
                  src={matchData.user.profilePicture}
                  alt={`Foto de ${matchData.user.name}`}
                  className="w-[12.5rem] h-[12.5rem] mt-7 rounded-full object-cover"
                />
              </div>
              )
            }
          <div className="w-full flex items-center justify-between px-6 py-4 border-t border-white/20">
            <form
              onSubmit={handleSendMessage}
              className="h-14 pl-4 pr-2 text-base flex items-center rounded-full w-full bg-white/5 gap-2"
              ref={formRef}
            >
              <input
                name="message"
                type="text"
                className="h-full pr-1 text-base flex items-center w-full bg-transparent placeholder:text-white/60"
                placeholder={`Mande uma mensagem para ${matchData?.user.name}`}
              />
              <button
                className="h-10 w-10 bg-base-primary rounded-full flex items-center justify-center duration-200 hover:bg-base-primary/80 hover:scale-105"
                type="submit"
                disabled={!!newChatData && newChatData.loading || !!sendMessageData && sendMessageData.loading}
              >
                <SendHorizontal size={20} color="#fbfdfd" />
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col min-w-96 w-96 min-h-full border-l border-l-white/20">
          <img src={matchData?.user.profilePicture} alt="" className="w-full h-96" />
          <div className="p-4">
            <div className="flex items-baseline gap-2 !opacity-100 z-30">
              <h1 className="font-bold text-3xl line-clamp-1">{matchData?.user.name}</h1>
              <p className="text-2xl font-normal">{matchData?.user.age}</p>
            </div>
            <p className="text-xl font-light">{matchData?.user.bio}</p>
          </div>
        </div>
      </div>
      {!!chatId &&
        <LoadSubscription
          chatId={chatId}
          setMessages={(message) => setMessages(prev => [...prev, message])}
        />
      }
    </>
  )
}