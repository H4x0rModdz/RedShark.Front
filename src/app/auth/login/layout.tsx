"use client";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/login-video.mp4"
          autoPlay
          loop
          muted
        ></video>
  
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
  
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {children}
        </div>
      </div>
    );
  };
  
export default Layout;