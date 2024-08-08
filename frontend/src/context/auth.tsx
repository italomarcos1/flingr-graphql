import { ReactNode, createContext, useCallback, useContext, useState } from "react";

import { motion } from "framer-motion";

import { AppData, IUser } from "../types";
import axios from "axios";
import { apolloClient, httpUrl, splitLink } from "../lib/apollo";
import { setContext } from "@apollo/client/link/context";
import { LoadData } from "../components/LoadData";
import { Login } from "../components/Login";
import { Register } from "../components/Register";

type AuthContextData = {
  user: IUser;
  token: string;
  appData: AppData;
  handleLogin: (data: ILoginRequest) => Promise<boolean>
  handleRegister: (data: Partial<IUser>) => Promise<boolean>
  setAppData: (data: AppData) => void;
  setUnauthenticatedPath: (path: "login" | "register") => void;
}

type AuthProviderProps = {
  children: ReactNode;
}

type ILoginRequest = {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>(() => {
    const user = localStorage.getItem("@flingr:user")

    if (!user) {
      return null as unknown as IUser;
    }

    return JSON.parse(user)
  })

  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("@flingr:token");

    return token ?? "";
  })

  const [appData, setAppData] = useState<AppData>(null as unknown as AppData)
  const [unauthenticatedPath, setUnauthenticatedPath] = useState<"login" | "register">("login")

  const handleLogin = useCallback(async (request: ILoginRequest) => {
    try{
      const { data } = await axios.post(`${httpUrl}/auth`, request)

      const { user, token } = data;
      
      setUser(user)
      setToken(token);

      localStorage.setItem("@flingr:user", JSON.stringify(user))
      localStorage.setItem("@flingr:token", token)

      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
            'Apollo-Require-Preflight': 'true'
          }
        }
      });

      apolloClient.setLink(authLink.concat(splitLink))
      return true;
    } catch (e) {
      console.log("handleLogin error", e);
      return false;
    }
  }, [])

  const handleRegister = useCallback(async (data: Partial<IUser>) => {
    return true
  }, [])

  if (!user && window.location.pathname !== "/") {
    history.replaceState(null, "", "/")
    window.location.reload()
  }

  if (user && window.location.pathname === "/") {
    history.replaceState(null, "", "/home")
    window.location.reload()
  }
  
  console.log("a", appData)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        handleLogin,
        appData,
        setAppData,
        setUnauthenticatedPath,
        handleRegister
      }}
    >
      <motion.section
        className="flex h-screen w-full relative"
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        {!!user && user.id ? 
          <div className="w-full flex items-center h-full justify-center relative">
            {!!appData ?  
              children
              :
              <LoadData id={user.id} setAppData={setAppData} />
            }
          </div> :
          unauthenticatedPath === "login" ? <Login /> : <Register />
        }
      </motion.section>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthContext provider");
  }

  return context;
}