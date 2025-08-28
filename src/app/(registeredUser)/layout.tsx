"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import AuthWrapper from "@/components/AuthWrapper";

export default function RegisteredUserLayout({ children }: { children: React.ReactNode }) {

  return (
    <AuthWrapper>
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="w-full">{children}</div>
        <ToastContainer autoClose={3000} position="top-right"/> 
      </div>
    </AuthWrapper>
  );
}