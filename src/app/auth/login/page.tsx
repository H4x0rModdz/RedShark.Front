"use client";

import Layout from "./layout";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { useForm } from "react-hook-form";
import { ILoginRequest } from "@/types/IUser";
import { IoLogoGoogle, IoLogoMicrosoft } from "react-icons/io5";


const LoginPage = () => {
const [showPassword, setShowPassword] = useState(false);
const { data: session } = useSession();
const router = useRouter();
const [isLoading, setLoading] = useState(false);

useEffect(() => {
    if (session?.user)
        router.push("/home");
        toast.success("Você já está logado.");
}, [session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
  });

  const onSubmit = async (data: ILoginRequest) => {
    setLoading(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.error) {
      console.log(response.error);
      toast.error("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
      setLoading(false);
    } else {
      setLoading(false);
      toast.success("Usuário logado com sucesso.");
      router.push("/home");
    }
  };

    return (
      <Layout>
        <div className="relative bg-white bg-opacity-15 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-sm w-full border-2 border-transparent animate-border-gradient">
          <h2 className="text-white text-xl font-semibold text-center mb-4 select-none">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="E-mail"
                {...register("email")}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 placeholder-white text-white focus:outline-none"
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                required
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-30 placeholder-white text-white focus:outline-none pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="flex items-center justify-between mb-4 select-none">
              <label className="flex items-center text-[#8B4513]">
                <input type="checkbox" className="mr-2 appearance-none w-5 h-5 border border-[#8B4513] rounded-md checked:bg-[#8B4513] checked:border-transparent" /> Remember Me
              </label>
              <a href="/recovery" className="text-white text-sm">Forgot Password?</a>
            </div>
            <button type="submit" className="w-full py-2 bg-[#8B4513] text-white rounded-2xl">
            {isLoading ? <LoadingSpinner className="mx-auto" /> : "Sign In"}
          </button>
          </form>
          <div className="text-center mt-4 text-white select-none">Or Sign In With</div>
          <div className="flex justify-center mt-4 space-x-4">
          <IoLogoGoogle className="w-8 h-8" onClick={() => signIn("google")} />
          <IoLogoMicrosoft className="w-8 h-8" onClick={() => signIn("microsoft")} />
        </div>
        </div>
        <style jsx>{`
        @keyframes borderAnimation {
          0% {
            box-shadow: 0 0 5px #8B4513;
            border-color: #8B4513;
          }
          25% {
            box-shadow: 0 0 10px #FF4500;
            border-color: #FF4500;
          }
          50% {
            box-shadow: 0 0 15px #FFD700;
            border-color: #FFD700;
          }
          75% {
            box-shadow: 0 0 10px #8B4513;
            border-color: #8B4513;
          }
          100% {
            box-shadow: 0 0 5px #FF4500;
            border-color: #FF4500;
          }
        }

        .animate-border-gradient {
          animation: borderAnimation 5s infinite linear;
        }
      `}</style>
      </Layout>
    );
  };
  
  export default LoginPage;
  