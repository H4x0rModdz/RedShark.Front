import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserAvatar } from '@/components/ui/user-avatar';

const LeftSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Início',
      href: '/home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      active: pathname === '/home'
    },
    {
      name: 'Explorar',
      href: '/explore',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      active: pathname === '/explore'
    },
    {
      name: 'Notificações',
      href: '/notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17h3m-3-4h3m-3-4h3m-3-4h2m1 4h4M9 17h2m-2-4h2m-2-4h2m-2-4h2M5 17h2m-2-4h2m-2-4h2m-2-4h2" />
        </svg>
      ),
      active: pathname === '/notifications'
    },
    {
      name: 'Mensagens',
      href: '/chat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      active: pathname?.startsWith('/chat')
    },
    {
      name: 'Salvos',
      href: '/bookmarks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      active: pathname === '/bookmarks'
    },
    {
      name: 'Perfil',
      href: `/profile/${session?.user?.userName || 'me'}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      active: pathname?.startsWith('/profile/')
    }
  ];

  // Mock data for suggestions - replace with real API
  const suggestedUsers = [
    {
      id: "1",
      name: "Ana Silva",
      username: "ana_silva",
      image: null,
      isFollowing: false
    },
    {
      id: "2", 
      name: "Carlos Mendes",
      username: "carlos_dev",
      image: null,
      isFollowing: false
    },
    {
      id: "3",
      name: "Maria Santos",
      username: "maria_design",
      image: null,
      isFollowing: true
    }
  ];

  const trendingTopics = [
    { topic: "Red Shark", posts: "2.5K" },
    { topic: "OpenSource", posts: "890" },
    { topic: "React", posts: "1.2K" },
    { topic: "TypeScript", posts: "756" },
    { topic: "Brasil", posts: "3.1K" }
  ];

  return (
    <nav className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 pt-20 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* User Profile Section */}
        {session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30"
          >
            <div className="flex items-center space-x-3">
              <UserAvatar
                src={session.user.image}
                alt={session.user.name}
                name={session.user.name}
                className="w-12 h-12 ring-2 ring-slate-600/50"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {session.user.name || 'Usuário'}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  @{session.user.userName || 'usuario'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className={`${item.active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
                {item.active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Create Post Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105">
            Criar Post
          </button>
        </motion.div>

        {/* Suggestions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-4"
        >
          <h3 className="text-white font-bold text-sm mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Sugestões para você
          </h3>
          <div className="space-y-3">
            {suggestedUsers.slice(0, 3).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <UserAvatar
                    src={user.image}
                    alt={user.name}
                    name={user.name}
                    className="w-8 h-8 ring-1 ring-slate-600/40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-xs truncate">{user.name}</p>
                    <p className="text-slate-400 text-xs truncate">@{user.username}</p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                    user.isFollowing
                      ? 'bg-slate-600 text-white hover:bg-red-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {user.isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-4"
        >
          <h3 className="text-white font-bold text-sm mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Tendências
          </h3>
          <div className="space-y-2">
            {trendingTopics.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-2 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer"
              >
                <p className="text-white font-medium text-xs">#{trend.topic}</p>
                <p className="text-slate-400 text-xs">{trend.posts} posts</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center space-y-2"
        >
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Termos</Link>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacidade</Link>
            <Link href="/help" className="hover:text-slate-300 transition-colors">Ajuda</Link>
          </div>
          <p className="text-xs text-slate-500">
            © 2025 Red Shark. Open Source ❤️
          </p>
        </motion.div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
