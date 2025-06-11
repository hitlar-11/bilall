import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '@/config/Firebase';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }
    fetchUserPosts();
  }, [session, router]);

  const fetchUserPosts = async () => {
    try {
      const db = getFirestore(app);
      const postsQuery = query(
        collection(db, 'posts'),
        where('useremail', '==', session.user.email)
      );
      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserPosts(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, "posts", postId));
        toast.success("Post deleted successfully!");
        fetchUserPosts(); // Refresh the posts list
      } catch (error) {
        toast.error("Error deleting post: " + error.message);
      }
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ToastContainer />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="flex items-center space-x-4">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {session.user?.name?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                <p className="text-gray-600">{session.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Posts</h2>
            {userPosts.length === 0 ? (
              <p className="text-gray-500">You haven't created any posts yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {post.desc}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{post.date}</span>
                        <span className={`px-2 py-1 rounded ${
                          post.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors mt-2"
                      >
                        Delete Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile; 