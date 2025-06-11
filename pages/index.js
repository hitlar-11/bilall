import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Hero from "./components/Hero";
import GameImages from "./components/GameImages";
import Search from "./components/Search";
import Posts from "./components/Posts";
import Navbar from "./components/Navbar";
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore";
import { app } from "@/config/Firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from './components/Layout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const db = getFirestore(app);
        const postsQuery = query(
          collection(db, 'posts'),
          where('approved', '==', true)
        );
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = posts.filter(post => 
      post.title?.toLowerCase().includes(searchTermLower) ||
      post.desc?.toLowerCase().includes(searchTermLower) ||
      post.date?.toLowerCase().includes(searchTermLower)
    );
    setFilteredPosts(filtered);
  };

  return (
    <Layout>
      <Hero onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No posts found.</p>
          </div>
        ) : (
          <Posts posts={filteredPosts} />
        )}
      </div>
    </Layout>
  );
}
