"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import AuthWrapper from "@/components/AuthWrapper";
import { AudioProvider } from "@/contexts/AudioContext";
import MiniPlayer from "@/components/MiniPlayer";

export default function RegisteredUserLayout({ children }: { children: React.ReactNode }) {

  return (
    <AuthWrapper>
      <AudioProvider>
        <div className="flex min-h-screen bg-gray-900 text-white">
          <Navbar />
          <div className="w-full">{children}</div>
          <ToastContainer autoClose={3000} position="top-right"/> 
          <MiniPlayer />
        </div>
      </AudioProvider>
    </AuthWrapper>
  );
}