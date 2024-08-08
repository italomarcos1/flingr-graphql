import { useState } from "react"
import { Link } from 'react-router-dom'
import { Briefcase, CheckCheck, MessageCircleHeartIcon, Search, Shield } from 'lucide-react'
import { IChat, IMatch, IUser } from '../types'

type Props = {
  user: IUser;
  matches?: IMatch[]
  chats?: IChat[]
}

export function Sidebar({ user, matches = [], chats = [] }: Props) {
  const [selectedMode, setSelectedMode] = useState<"matches" | "chats">("matches")
  console.log("user", user)
  
  return (
    <div className="flex flex-col min-w-96 w-96 h-full border-r border-r-white/20">
      <div className="min-h-24 bg-gradient-to-b from-base-primary to-base-primary/70 flex items-center justify-between px-4">
        <Link to="/home" title={user.name} className="flex items-center gap-2 animate-slide-fade-in-up">
          <img src={user.profilePicture} alt={`${user.name} profile picture`} className="w-10 h-10 rounded-full object-cover" />
          <strong className="line-clamp-1">{user.name}</strong>
        </Link>
        <div className="flex items-center gap-3 animate-slide-fade-in-up">
          <button
            className="w-9 h-9 rounded-full bg-base-primary/70 backdrop-blur-sm flex items-center justify-center animate-slide-fade-in-up"
            style={{ animationDuration: `0.375s` }}
          >
            <Search size={20} color="#FBFDFD" />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-base-primary/70 backdrop-blur-sm flex items-center justify-center animate-slide-fade-in-up"
            style={{ animationDuration: `${1.5 * 0.375}s` }}
          >
            <Briefcase size={20} color="#FBFDFD" />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-base-primary/70 backdrop-blur-sm flex items-center justify-center animate-slide-fade-in-up"
            style={{ animationDuration: `${2 * 0.375}s` }}
          >
            <Shield size={20} color="#FBFDFD" />
          </button>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex gap-2">
          <button
            className={`py-1 px-4 rounded-full animate-stagger-slide-in duration-200 hover:bg-base-primary/50 hover:font-bold ${selectedMode === "matches" ? "bg-base-primary/50 font-bold" : "bg-base-primary/20"}`}
            onClick={() => setSelectedMode("matches")}
          >
            Matches
          </button>
          <button
            className={`py-1 px-4 rounded-full animate-stagger-slide-in duration-200 hover:bg-base-primary/50 hover:font-bold ${selectedMode === "chats" ? "bg-base-primary/50 font-bold" : "bg-base-primary/20"}`}
            onClick={() => setSelectedMode("chats")}
          >
            Mensagens
          </button>
        </div>
      </div>
      {selectedMode === "matches" ? (
        <div className="grid grid-cols-3 gap-2 p-4 border-t border-t-white/20 overflow-y-scroll">
          <Link
            to="/likes-sent"
            className="match-card animate-slide-fade-in-up"
            style={{ animationDuration: `0.375s` }}
          >
            <span className="absolute top-0 left-0 bg-gradient-to-b w-full h-full border-2 border-[#ffd034]/80 rounded-md from-[#ffd034]/60 to-[#ffd034]/20" />
            <strong className="mt-auto z-20 text-sm leading-tight">Likes<br/>recebidos</strong>
          </Link>
          <Link
            to="/likes-received"
            className="match-card animate-slide-fade-in-up"
            style={{ animationDuration: `${1.5 * 0.375}s` }}
          >
            <span className="absolute top-0 left-0 bg-gradient-to-b w-full h-full border-2 border-[#ffd034]/80 rounded-md from-[#ffd034]/60 to-[#ffd034]/20" />
            <strong className="mt-auto z-20 text-sm leading-tight">Likes enviados</strong>
          </Link>
          {matches.map(m =>
            <Link
              key={m.id}
              to={`/match/${m.id}`}
              title={m.user.name}
              state={{
                id: m.id,
                status: m.status,
                date: m.createdAt,
                user: m.user
              }}
              className={`${m.status === "new" ? "new-match" : "match-card"}`}
            >
              <img
                src={m.user.profilePicture}
                title={m.user.name}
                alt={`Picture of ${m.user.name}`}
              />
              <div />
              <h3>{m.user.name}</h3>
              {m.status === "new" && <span title="Novo Match" className="notification-badge"></span> }
            </Link>
          )}
          </div>
          ) :
        <div className="flex flex-col overflow-y-scroll w-full border-t border-t-white/20">
          {!!chats.length ?
            chats.map((c, i) =>
              <Link
                key={c.id}
                to={`/chat/${c.id}`}
                className={`relative flex items-center gap-2 w-full border-b border-b-white/20 p-4 animate-stagger-slide-in ${!c.seen ? "bg-white/10" : ""}`}
                style={{ animationDuration: `${(i+1) * 0.375}s` }}
              >
                <img
                  src={c.user.profilePicture}
                  alt={`Picture of ${c.user.name}`}
                  className={`w-16 h-16 rounded-full object-cover ${!c.seen ? "border border-base-primary border-t-0" : ""}`}
                />
                <div className="flex flex-col w-full">
                  <h3 className="text-xl">{c.user.name}</h3>
                  <div title={c.content} className="flex items-center gap-2 w-full justify-between">
                    <p className="text-white/70 text-[0.875rem] line-clamp-2 leading-tight max-w-[80%]">{c.content}</p>
                    {c.sentByYou && <CheckCheck size={20} className="text-white/40" />}
                  </div>
                </div>
                {!c.seen && <span className="absolute top-2 right-1 w-3 h-3 rounded-full bg-base-primary" />}
              </Link>
            ) :
            <div className="flex flex-col self-center mt-20 items-center gap-4">
              <MessageCircleHeartIcon size={80} className="text-white/50" strokeWidth={1} />
              <p className="text-white/75 text-center italic leading-5">Você não tem nenhuma<br/>conversa iniciada</p>
            </div>
            }    
        </div>
        }
    </div>
  )
}