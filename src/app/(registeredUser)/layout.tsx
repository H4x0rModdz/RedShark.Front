"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { ToastContainer } from "react-toastify";
import AuthWrapper from "@/components/AuthWrapper";
import { AudioProvider } from "@/contexts/AudioContext";
import MiniPlayer from "@/components/MiniPlayer";
import { AppLoader } from "@/components/AppLoader";

export default function RegisteredUserLayout({ children }: { children: React.ReactNode }) {

  return (
    <AuthWrapper>
      <AppLoader>
        <AudioProvider>
          <div className="flex min-h-screen bg-gray-900 text-white">
            <Navbar />
            <LeftSidebar />
            <div className="w-full">{children}</div>
            <RightSidebar />
            <ToastContainer autoClose={3000} position="top-right"/> 
            <MiniPlayer />
          </div>
        </AudioProvider>
      </AppLoader>
    </AuthWrapper>
  );
}