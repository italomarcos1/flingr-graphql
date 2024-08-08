
import { FormEvent, useCallback, useState } from "react"
import { useAuth } from "../context/auth";
import { ArrowRightIcon, CastIcon, Code2Icon, GroupIcon, SatelliteDishIcon, Users2Icon } from "lucide-react";

export function Login() {
  const [loggingIn, setLoggingIn] = useState(false);

  const { handleLogin, setUnauthenticatedPath } = useAuth()
  
  const handleFormSubmit = useCallback(async (e: FormEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as unknown as HTMLFormElement);

      const email = formData.get("email") as string
      const password = formData.get("password") as string

      await handleLogin({ email, password })

      // console.log("login status", status)
    } catch (e) {
      console.log("e", e);
    } finally {
      setLoggingIn(false);
    }
  }, [])

  return (
    <main className="relative flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-[#000] to-customBlack">
      <div className="flex border border-white/10 rounded-md border-b-2 animate-pop-in-up">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-2 items-center justify-center px-10 py-10 rounded-l-md bg-gradient-to-r from-white/5 via-appleBlack to-transparent"
        >
          <h1 className="title-gradient text-4xl leading-none mb-3">Flingr</h1>
          <input
            name="email"
            type="text"
            placeholder="Seu e-mail"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50"
            disabled={loggingIn}
          />
          <input
            name="password"
            type="password"
            placeholder="Sua senha"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50"
            disabled={loggingIn}
          />
          <button
            disabled={loggingIn}
            className="py-3 px-10 rounded-lg bg-gradient-to-b from-base-primary/80 to-base-primary/40 flex items-center justify-center duration-200 uppercase hover:bg-base-primary/80 disabled:bg-base-primary/60 disabled:cursor-not-allowed font-medium mt-3"
          >
            {loggingIn ? "Aguarde..." : "Entrar"}
          </button>
          <button
            className="flex items-center gap-2 text-[0.785rem] mt-2"
            onClick={() => setUnauthenticatedPath("register")}
          >
            Criar conta <ArrowRightIcon size={14} />
          </button>
        </form>
        {/* <div className="flex flex-col gap-6 items-center justify-center relative h-[20rem] w-72 object-cover rounded-r-md bg-[url('/abc.jpg')] bg-center bg-cover"> */}
        <div className="flex flex-col gap-6 items-center justify-center relative h-[20rem] w-72 object-cover rounded-r-md bg-center bg-cover">
          teste
        </div>
      </div>
      <p className="absolute bottom-10 font-light">
        Feito 100% por
        <a
          href="https://www.linkedin.com/in/italomarcos1/"
          rel="noreferrer noopener" 
          target="_blank"
          className="font-medium title-gradient"
        >
          &nbsp;Italo Marcos&nbsp;
        </a>
        (open to work)
      </p>
    </main>
  )
}