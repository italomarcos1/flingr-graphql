import { Heart, Star, X } from 'lucide-react'
import { IUser } from '../types';
import { useMutation } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/auth';
import { SEND_LIKE, SEND_DISLIKE } from '../graphql/mutations';

type Props = {
  card: IUser
}

export function Card({ card }: Props) {
  const { user }= useAuth();

  const [sendLike, likeMutationData] = useMutation(SEND_LIKE)
  const [sendDislike, dislikeMutationData] = useMutation(SEND_DISLIKE)

  const isLoading = useMemo(() =>
    !!likeMutationData && likeMutationData.loading ||
    !!dislikeMutationData && dislikeMutationData.loading
  , [likeMutationData, dislikeMutationData])

  const handleSendLike = useCallback(async (receiverId: string) => {
    if (!user || !user.id) return;
    
    await sendLike({
      variables: {
        senderId: user.id,
        receiverId
      }
    })
  }, [sendLike])

  const handleSendDislike = useCallback(async (receiverId: string) => {
    if (!user || !user.id) return;
    
    await sendDislike({
      variables: {
        senderId: user.id,
        receiverId
      }
    })
  }, [sendDislike])

  return (
    <div key={card.id} className="relative flex flex-col justify-end p-4 pb-6 min-w-[28rem] w-[28rem] min-h-[40rem] h-[40rem] rounded-xl">
      <img src={card.profilePicture} alt="" className="absolute object-cover top-0 left-0 min-w-[28rem] min-h-[40rem] rounded-xl z-10" />
      <div className="absolute z-20 left-0 bottom-0 rounded-b-xl w-full min-h-[32rem] bg-gradient-to-b from-transparent to-base-black" />
      <div className="flex px-2 items-baseline gap-2 !opacity-100 z-30">
        <h1 className="font-bold text-4xl line-clamp-1">{card.name}</h1>
        <p className="text-2xl font-normal">{card.age}</p>
      </div>
      <p className="px-2 text-xl z-30 mt-1 font-light line-clamp-2">{card.bio}</p>
      <div className="flex items-center justify-center gap-5 mt-3 z-30">
        <button
          onClick={() => handleSendDislike(card.id)}
          className="card-action-button border-base-primary hover:bg-base-primary/20"
          disabled={isLoading}
        >
          <X size={32} className="text-base-primary" />
        </button>
        <button
          onClick={() => {}}
          className="card-action-button border-base-superLike !w-12 !h-12 hover:bg-base-superLike/20"
          disabled={isLoading}
        >
          <Star size={24} className="text-base-superLike" fill="#1786FF" />
        </button>
        <button
          onClick={() => handleSendLike(card.id)}
          className="card-action-button border-base-secondary hover:bg-base-secondary/20"
          disabled={isLoading}
        >
          <Heart size={30} className="text-base-secondary" fill="#129E68" />
        </button>
      </div>
    </div>
  );
}