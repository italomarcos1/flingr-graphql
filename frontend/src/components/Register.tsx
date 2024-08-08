
import { FormEvent, useCallback, useRef, useState } from "react"
import { z } from "zod"
import { useAuth } from "../context/auth";
import { ArrowLeftIcon, CameraIcon, Loader2Icon } from "lucide-react";
import { imageMimeTypes } from "../utils";
import axios from "axios";
import { httpUrl } from "../lib/apollo";

export function Register() {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { handleLogin, handleRegister, setUnauthenticatedPath } = useAuth()

  const handleSetProfilePicture = useCallback(async (file: File) => {
    try {
      setLoading(true)
      console.log('file', file)

      if (!imageMimeTypes.includes(file.type)) {
        alert("O formato do arquivo não é suportado.")

        return;
      }

      const fileSizeInMB = file.size / (1000 * 1000) // B / 1000 → KB / 1000 → MB (hence 1000 * 1000)
      const fileSizeLimit = 1.024 * 1.024 * 5 // 5 MB

      if (fileSizeInMB > fileSizeLimit) {
        alert("O tamanho do arquivo não pode ultrapassar 5MB.");

        return;
      }

      const presignRequest = {
        fileType: file.type,
        fileName: file.name,
        method: "PUT"
      }

      const {
        data
      } = await axios.post(`${httpUrl}/presign`, presignRequest);

      const {
        url: presignedUrl,
        fileName
      } = data;
      
      if (!presignedUrl) {
        console.log('Falha ao obter URL pré-assinada.');
        return;
      }

      await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      }); 
     
      const profile_picture = `https://d36abtou431oro.cloudfront.net/dewit/${fileName}`
      
      const request = {
        profile_picture
      }
      
      await axios.put(`${httpUrl}/users/{user.id}`, request)

      setProfilePicture(profile_picture)

      alert("Upload feito com sucesso")
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert("Houve um erro no upload")
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleFormSubmit = useCallback(async (e: FormEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as unknown as HTMLFormElement);

      const updateUserBodySchema = z.object({
        name: z.string().max(50),
        email: z.string().email(),
        bio: z.string().email(),
        password: z.string(),
        confirmPassword: z.string()
      }).refine(({ password, confirmPassword }) => {
          if (password !== confirmPassword) {

            return false;
          }

          return true;
      }, {
        message: "As senhas não conferem",
        path: ["confirmPassword"],
      });
  
      const { name, email, bio, password } = updateUserBodySchema.parse(formData)

      const status = await handleRegister({
        name,
        email,
        bio,
        password,
        profilePicture: !!profilePicture ? profilePicture : undefined
      })

      console.log("register status", status)
      history.replaceState(null, "", "/home")
      window.location.reload()
    } catch (e) {
      console.log("e", e);
    } finally {
      setLoggingIn(false);
    }
  }, [name, email, bio, password, confirmPassword])

  return (
    <main className="relative flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-[#000] to-customBlack">
      <div className="flex border border-white/10 rounded-md border-b-2 animate-pop-in-up">
        <div className="flex flex-col gap-6 items-center justify-center relative h-[20rem] w-72 object-cover rounded-r-md bg-center bg-cover">
        <div className="w-full">
          <div className="relative w-28 h-28 rounded-full bg-customBlack flex items-center justify-center cursor-pointer">
            {profilePicture ?
              <img
                src={profilePicture}
                alt=""
                className="absolute w-full h-full rounded-full object-cover cursor-pointer"
              /> : 
              <CameraIcon className="h-8 w-8 text-white" />
            }
            <input
              accept="image/jpeg, image/jpg, image/png"
              type="file"
              disabled={loading}
              ref={fileInputRef}
              onChange={(e) => !!e.target.files && !!e.target.files.length && handleSetProfilePicture(e.target.files[0])}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            {loading &&
              <div className="absolute w-full h-full bg-customBlack/75 cursor-progress grid place-items-center rounded-full">
                <Loader2Icon className="animate-spin w-10 h-10" />
              </div>
            }
          </div>
        </div>
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-2 items-center justify-center px-10 py-10 rounded-l-md bg-gradient-to-r from-white/5 via-appleBlack to-transparent"
        >
          <h1 className="title-gradient text-4xl leading-none mb-3">Flingr</h1>
          <input
            name="name"
            type="text"
            placeholder="Seu nome"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loggingIn}
          />
          <input
            name="email"
            type="text"
            placeholder="Seu e-mail"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loggingIn}
          />
          <textarea
            name="bio"
            placeholder="Se descreva um pouco"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50 bio resize-none pt-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={loggingIn}
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loggingIn}
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirme a senha"
            className="bg-transparent outline-none w-full h-10 rounded-md border border-white/10 text-[0.9375rem] px-3 text-white placeholder:text-white/50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loggingIn}
          />
          <button
            disabled={loggingIn}
            className="py-3 px-10 rounded-lg bg-gradient-to-b from-base-primary/80 to-base-primary/40 flex items-center justify-center duration-200 uppercase hover:bg-base-primary/80 disabled:bg-base-primary/60 disabled:cursor-not-allowed font-medium mt-3"
          >
            {loggingIn ? "Aguarde..." : "Criar conta"}
          </button>
          <button
            className="flex items-center gap-2 text-[0.785rem] mt-2"
            onClick={() => setUnauthenticatedPath("login")}
          >
            <ArrowLeftIcon size={14} />
            Fazer login
          </button>
        </form>
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