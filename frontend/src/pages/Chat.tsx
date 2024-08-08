import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Loader2, SendHorizontal, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SEND_MESSAGE, UNMATCH, UPDATE_MESSAGE_TO_SEEN } from '../graphql/mutations';
import { IChat, IMessage } from '../types';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/auth';
import { LoadChatData } from '../components/LoadChatData';
import { LoadSubscription } from '../components/LoadSubscription';

export function Chat() {
  const { user, appData, setAppData } = useAuth();
  const formRef = useRef<HTMLFormElement>(null)

  const [chatUpdatedToSeen, setChatUpdatedToSeen] = useState(false)

  const [sendMessage, sendMessageData] = useMutation(SEND_MESSAGE)
  const [unmatch, unmatchData] = useMutation(UNMATCH)
  const [updateMessageToSeen] = useMutation(UPDATE_MESSAGE_TO_SEEN)
  
  const params = useParams();
  const navigate = useNavigate();
  
  const [chatData, setChatData] = useState<IChat>(null as unknown as IChat)
  const [messages, setMessages] = useState<IMessage[]>([])

  const handleSendMessage = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!chatData) return;
    
    // @ts-ignore
    const formData = new FormData(e.target)
    const message = formData.get("message")

    const updatedChat: IChat = {
      id: chatData.id,
      content: message,
      user: {
        name: chatData.user.name,
        profilePicture: chatData.user.profilePicture,
      },
      sentByYou: true
    } as unknown as IChat

    setAppData({
      ...appData,
      chats: [updatedChat, ...appData.chats.filter(c => c.id !== chatData.id)]
    })

    await sendMessage({
      variables: {
        chatId: chatData.id,
        content: message,
        receiverId: chatData.user.id,
        senderId: user.id
      },
    })

    // setMessages(prev => [...prev, newMessage])
    // setMessage("");
    formRef.current?.reset()
  }, [user, chatData, sendMessage])
  
  const handleUnmatch = useCallback(async (id: string) => {
    await unmatch({
      variables: {
        chatId: id,
        matchId: chatData.matchId
      }
    })

    setAppData({
      ...appData,
      chats: appData.chats.filter(c => c.id !== chatData.id)
    })

    navigate("/home")
  }, [chatData, appData])

  useEffect(() => {
    if (!!chatData && !chatData.seen && !chatUpdatedToSeen) {
      updateMessageToSeen({
        variables: {
          chatId: chatData.id
        }
      })

      setAppData({
        ...appData,
        chats: appData.chats.map(c => c.id === chatData.id ? ({ ...c, seen: true }) : c)
      })

      setChatUpdatedToSeen(true)
    } 
  }, [chatData, appData])

  return (
    <>
      <Sidebar
        user={user}
        matches={appData.matches}
        chats={appData.chats}
      />
      <div className="w-full flex h-full">
        {!!chatData ? 
          <>
            <div className="w-full flex flex-col items-center h-full">
              <header className="w-full flex items-center justify-between px-6 py-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <img
                    src={!!chatData && chatData.user.profilePicture}
                    alt="Your match profile picture"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <strong className="text-xl">{!!chatData && chatData.user.name}</strong>
                </div>
                <Link
                  to="/home"
                  className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 duration-200 disabled:cursor-not-allowed hover:scale-105 hover:bg-white/20"
                >
                  <X size={24} className="text-white/20" strokeWidth={4} />
                </Link>
              </header>
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
              </div>
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
                    placeholder={`Mande uma mensagem para ${chatData?.user.name}`}
                  />
                  <button
                    className="h-10 w-10 bg-base-primary rounded-full flex items-center justify-center duration-200 hover:bg-base-primary/80 hover:scale-105"
                    type="submit"
                    disabled={!!sendMessageData && sendMessageData.loading}
                  >
                    <SendHorizontal size={20} color="#fbfdfd" />
                  </button>
                </form>
              </div>
            </div>
            <div className="flex flex-col items-center min-w-96 w-96 min-h-full border-l border-l-white/20">
              <img src={chatData?.user.profilePicture} alt="" className="w-full h-96" />
              <div className="flex flex-col p-4">
                <div className="flex items-baseline gap-2 !opacity-100 z-30">
                  <h1 className="font-bold text-3xl line-clamp-1">{chatData?.user.name}</h1>
                  <p className="text-2xl font-normal">{chatData?.user.age}</p>
                </div>
                <p className="text-xl font-light">{chatData?.user.bio}</p>
                <button
                  disabled={!!unmatchData && unmatchData.loading}
                  className="mt-10 flex self-center items-center justify-center border border-white/30 rounded-full h-12 px-10 w-full text-white/40 hover:text-white hover:font-bold duration-200 hover:bg-gradient-to-b from-base-primary to-base-primary/80"
                  onClick={() => handleUnmatch(chatData.id)}
                  >
                  {unmatchData.loading ? <Loader2 size={20} color="#FBFDFD" className="animate-loading-spinning" /> : "Desfazer o Match"}
                </button>
              </div>
            </div>
          </> :
        !!params && !!params.id &&
          <LoadChatData id={params.id} userId={user.id} setChatData={setChatData} setMessages={setMessages} />
        }
        {!!params && !!params.id &&
          <LoadSubscription
            chatId={params.id}
            setMessages={(m) => setMessages(prev => [...prev, m])}
          />
        }
      </div>
    </>
  )
}