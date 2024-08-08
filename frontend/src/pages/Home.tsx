import { Sidebar } from '../components/Sidebar';
import { NewUsersList } from '../components/NewUsersList'

import { useAuth } from '../context/auth'

export function Home() {
  const { user, appData } = useAuth();
  
  console.log("appData", appData)

  return (
    <>
      <Sidebar
        user={user}
        matches={appData.matches}
        chats={appData.chats}
      />
      <NewUsersList users={appData.users} />
    </>
  )
}

