import { Card } from "./Card";
import { IUser } from "../types";

type Props = {
  users: IUser[]
}

export function UsersList({ users }: Props) {
  return (
    <div className="w-full flex items-center gap-4 !min-h-[40rem] justify-center">
      {users!.map((user) => 
        <Card key={user.id} card={user} />
      )}
    </div>
  )
}