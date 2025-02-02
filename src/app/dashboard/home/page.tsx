"use client";

import { useState } from "react";
import { Home, Search, Bell, User, MessageCircle, Users, Briefcase, Calendar, Newspaper, ChevronDown, Image, Link, Smile, Video, FileText, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HomePage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Lucky Andreas",
      time: "12 minutes ago",
      content:
        "What is the reason guys yesterday I uploaded same kind of content they approved but when today I tried to upload they say we no longer accept this type of content",
      image: "https://source.unsplash.com/random/800x600",
      likes: 1700,
      comments: 45,
      shares: 12,
    },
    {
      id: 2,
      user: "James Klebus",
      time: "12 minutes ago",
      content:
        "For those of you that have considered joining Vecteezy...here's my total sales for my first two months!",
      image: "https://source.unsplash.com/random/800x601",
      likes: 1200,
      comments: 30,
      shares: 8,
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center bg-gray-800 px-6 py-3 shadow-md w-full">
        <div className="flex gap-6">
          <Button className="text-gray-300 hover:text-white">Explore</Button>
          <Button className="text-gray-300 hover:text-white">Community Feed</Button>
          <Button className="text-gray-300 hover:text-white">Mutual Friends 12</Button>
        </div>
        <div className="flex items-center gap-6">
          <MessageCircle size={24} className="text-gray-300 hover:text-white cursor-pointer" />
          <Bell size={24} className="text-gray-300 hover:text-white cursor-pointer" />
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="https://source.unsplash.com/random/40x40" alt="User" className="rounded-full" />
            <p className="text-white">Havid N</p>
            <ChevronDown size={20} className="text-gray-300" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-800 p-4 space-y-6 h-screen">
          <div className="flex items-center gap-3">
            <img src="https://source.unsplash.com/random/40x40" alt="Logo" className="rounded-full" />
            <h1 className="text-xl font-bold">Kaloka</h1>
          </div>
          <Input placeholder="Explore Kaloka..." className="bg-gray-700 text-white placeholder-gray-400" />
          <nav>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300 hover:text-white">
                <Home size={20} /> Home
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white">
                <Users size={20} /> Community
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white">
                <Briefcase size={20} /> Marketplace
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white">
                <Calendar size={20} /> Kaloka Events
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white">
                <Newspaper size={20} /> News Feed
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-2xl mx-auto overflow-y-auto h-screen">
          <Card className="mb-6">
            <CardContent>
              <div className="flex items-center gap-3">
                <User size={32} className="bg-gray-700 rounded-full p-1" />
                <Input
                  placeholder="What's on your mind?"
                  className="flex-1 bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {posts.map((post) => (
            <Card key={post.id} className="mb-6">
              <CardContent>
                <div className="mb-2">
                  <p className="text-sm text-gray-400">{post.time}</p>
                  <p className="font-bold">{post.user}</p>
                </div>
                <p className="mb-3">{post.content}</p>
                <img src={post.image} alt="Post" className="rounded-lg w-full" />
                <div className="flex justify-between mt-3 text-gray-400">
                  <ThumbsUp size={16} /> {post.likes} Likes
                  <MessageSquare size={16} /> {post.comments} Comments
                  <Share2 size={16} /> {post.shares} Shares
                </div>
              </CardContent>
            </Card>
          ))}
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-gray-800 p-4 h-screen overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Today Trending</h2>
          <ul className="space-y-2">
            <li className="text-gray-300 hover:text-white">Figma maintenance - 125 posts</li>
            <li className="text-gray-300 hover:text-white">Blender Update - 117 posts</li>
            <li className="text-gray-300 hover:text-white">Slackoverflow server - 57 posts</li>
            <li className="text-gray-300 hover:text-white">Javascript new - 32 posts</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default HomePage;