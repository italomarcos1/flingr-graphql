import { useCallback, useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform } from "framer-motion";

import { Heart, Star, X } from 'lucide-react'
import { useMutation } from '@apollo/client';

import { IUser } from "../types";

import { useAuth } from '../context/auth';
import { SEND_LIKE, SEND_DISLIKE } from '../graphql/mutations';

type Props = {
  users: IUser[]
}

export function NewUsersList({ users }: Props) {
  const [currentUsers, setCurrentUsers] = useState<IUser[]>(users); 
  const [hasChosen, setHasChosen] = useState(false);

  const { user }= useAuth();

  const [sendLike, likeMutationData] = useMutation(SEND_LIKE)
  const [sendDislike, dislikeMutationData] = useMutation(SEND_DISLIKE)

  const x = useMotionValue(0);
  const xInput = [-50, 0, 50];
  const background = useTransform(x, xInput, [
    "linear-gradient(180deg, rgba(255,68,88,0.7) 0%, rgba(255,68,88,0.2) 100%)",
    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
    "linear-gradient(180deg, rgba(18,158,104,0.7) 0%, rgba(18,158,104,0.2) 100%)"
  ]);
 
  const translateX = useTransform(x, [-50, 0, 50], [-50, 0, 50]);
  const scale = useTransform(x, [-50, 0, 50], [1.1, 1, 1.1]);
  const rotate = useTransform(x, [-50, 0, 50], [-15, 0, 15]);
  
  const likeButtonScale = useTransform(x, [0, 50], [1, 1.2]);
  const dislikeButtonScale = useTransform(x, [-50, 0], [1.2, 1]);
  const likeButtonBackground = useTransform(x, [0, 50], [
    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
    "linear-gradient(180deg, rgba(18,158,104,0.9) 0%, rgba(18,158,104,0.4) 100%)"
  ]);
  const dislikeButtonBackground = useTransform(x, [-50, 0], [
    "linear-gradient(180deg, rgba(255,68,88,0.9) 0%, rgba(255,68,88,0.4) 100%)",
    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
  ]);

  const isLoading = useMemo(() =>
    !!likeMutationData && likeMutationData.loading ||
    !!dislikeMutationData && dislikeMutationData.loading
  , [likeMutationData, dislikeMutationData])

  const handleSubmit = useCallback(async (choice: "like" | "dislike", receiverId: string) => {
    if (!user || !user.id || hasChosen) return;
    setHasChosen(true)

    if (choice === "like") {
      await sendLike({
        variables: {
          senderId: user.id,
          receiverId
        }
      })
    } else { 
      await sendDislike({
        variables: {
          senderId: user.id,
          receiverId
        }
      })
    }

    setCurrentUsers(prev => prev.filter(c => c.id !== receiverId));

    setTimeout(() => setHasChosen(false), 1000)

  }, [hasChosen, sendLike, sendDislike])

  const displayUsers = useMemo(() =>
    currentUsers.slice(0, 3)
  , [currentUsers])

  return (
    <motion.div className="relative w-full flex items-center gap-4 !min-h-[40rem] justify-center">
      {displayUsers!.map((card, index) => 
        <motion.div
          key={card.id}
          className={`absolute flex flex-col justify-end p-4 pb-6 min-w-[28rem] w-[28rem] min-h-[40rem] h-[40rem] rounded-xl animate-slide-fade-in-up user-card-${index}`}
          style={card.id === displayUsers[0].id ? { x, rotate, scale, translateX } : { animationDuration: `${(index+0.5) * 0.375}s` }}
          drag={card.id === displayUsers[0].id ? "x" : undefined}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, i) => {
            if (i.offset.x > 100 && !hasChosen) {
              handleSubmit("like", card.id)
            } else if (i.offset.x < -100 && !hasChosen) {
              handleSubmit("dislike", card.id)
            }
          }}
        >
          <img src={card.profilePicture} alt="" className="absolute object-cover top-0 left-0 min-w-[28rem] min-h-[40rem] rounded-xl z-10" />
          <div className="absolute z-20 left-0 bottom-0 rounded-b-xl w-full min-h-[32rem] bg-gradient-to-b from-transparent to-base-black" />
          <motion.div
            className={`absolute z-20 left-0 bottom-0 rounded-xl w-full min-h-[40rem] `}
            style={card.id === displayUsers[0].id ? { background } : {}}
          />
          <div className="flex px-2 items-baseline gap-2 !opacity-100 z-30">
            <h1 className="font-bold text-4xl line-clamp-1">{card.name}</h1>
            <p className="text-2xl font-normal">{card.age}</p>
          </div>
          <p className="px-2 text-xl z-30 mt-1 font-light line-clamp-2">{card.bio}</p>
          <div className="flex items-center justify-center gap-5 mt-3 z-30">
            <motion.button
              onClick={() => handleSubmit("dislike", card.id)}
              className="card-action-button border-base-primary hover:bg-base-primary/20"
              style={card.id === displayUsers[0].id ? {
                background: dislikeButtonBackground,
                scale: dislikeButtonScale
              } : {}}
              disabled={isLoading}
            >
              <X size={32} className="text-base-primary" />
            </motion.button>
            <button
              onClick={() => {}}
              className="card-action-button border-base-superLike !w-12 !h-12 hover:bg-base-superLike/20"
              disabled={isLoading}
            >
              <Star size={24} className="text-base-superLike" fill="#1786FF" />
            </button>
            <motion.button
              onClick={() => handleSubmit("like", card.id)}
              className="card-action-button border-base-secondary hover:bg-base-secondary/20"
              style={card.id === displayUsers[0].id ? {
                background: likeButtonBackground,
                scale: likeButtonScale
              } : {}}
              disabled={isLoading}
            >
              <Heart size={30} className="text-base-secondary" fill="#129E68" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}