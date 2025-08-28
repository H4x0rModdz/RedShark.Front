import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const LeftSidebar = () => {
  const { data: session } = useSession();

  const navigation = [
    {
      name: 'Home',
      href: '/home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Explorar',
      href: '/explore',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: 'Mensagens',
      href: '/messages',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: 'Favoritos',
      href: '/bookmarks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
    {
      name: 'Perfil',
      href: `/profile/${session?.user?.userName || 'me'}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 pt-20">
      <div className="p-6">
        {/* User Profile Section */}
        {session?.user && (
          <div className="mb-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="flex items-center space-x-3">
              <img
                src={session.user.image || 'https://github.com/shadcn.png'}
                alt="Profile"
                className="w-12 h-12 rounded-full ring-2 ring-slate-600"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {session.user.name || 'Usuário'}
                </p>
                <p className="text-slate-400 text-sm truncate">
                  @{session.user.userName || 'usuario'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center space-x-4 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
              >
                <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Create Post Button */}
        <div className="mt-8">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105">
            Novo Post
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Termos</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Suporte</a>
          </div>
          <p className="text-xs text-slate-600 mt-2">© 2024 Red Shark</p>
        </div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
