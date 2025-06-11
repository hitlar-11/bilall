import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc, query, addDoc } from 'firebase/firestore';
import { app } from '@/config/Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditPostForm from '../components/EditPostForm';
import Layout from '../components/Layout';
import { HiLogout, HiUser, HiShieldCheck, HiTrash, HiSearch, HiPlus, HiClock, HiPencil } from 'react-icons/hi';

function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    year: '',
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (!session) {
      router.push('/');
    }
    fetchPosts();
    fetchUsers();
    fetchTimelineEvents();
  }, [session, router]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchPosts = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const postsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(postsData);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimelineEvents = async () => {
    try {
      const db = getFirestore(app);
      const eventsQuery = query(collection(db, 'timeline'));
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      eventsData.sort((a, b) => a.year - b.year);
      setTimelineEvents(eventsData);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast.error('Failed to fetch timeline events');
    }
  };

  const handleApprove = async (postId) => {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, 'posts', postId), {
        approved: true
      });
      toast.success('Post approved successfully!');
      fetchPosts();
    } catch (error) {
      toast.error('Error approving post: ' + error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'posts', postId));
        toast.success('Post deleted successfully!');
        fetchPosts();
      } catch (error) {
        toast.error('Error deleting post: ' + error.message);
      }
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
  };

  const handleUpdatePost = async (updatedPost) => {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, 'posts', updatedPost.id), {
        title: updatedPost.title,
        desc: updatedPost.desc,
        date: updatedPost.date,
        imageUrl: updatedPost.imageUrl
      });
      toast.success('Post updated successfully!');
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      toast.error('Error updating post: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const toggleAdminRole = async (userId, currentRole) => {
    try {
      if (currentRole === 'admin') {
        const adminCount = users.filter(user => user.role === 'admin').length;
        if (adminCount <= 1) {
          toast.error('Cannot remove the last admin');
          return;
        }
      }

      const db = getFirestore(app);
      const userRef = doc(db, 'users', userId);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId, userRole) => {
    if (userRole === 'admin') {
      const adminCount = users.filter(user => user.role === 'admin').length;
      if (adminCount <= 1) {
        toast.error('Cannot delete the last admin');
        return;
      }
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'users', userId));
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleTimelineSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      if (selectedEvent) {
        // Update existing event
        await updateDoc(doc(db, 'timeline', selectedEvent.id), {
          ...timelineForm,
          updatedAt: new Date().toISOString()
        });
        toast.success('Timeline event updated successfully');
      } else {
        // Add new event
        await addDoc(collection(db, 'timeline'), {
          ...timelineForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        toast.success('Timeline event added successfully');
      }
      setShowTimelineModal(false);
      setSelectedEvent(null);
      setTimelineForm({ year: '', title: '', description: '', image: '' });
      fetchTimelineEvents();
    } catch (error) {
      console.error('Error saving timeline event:', error);
      toast.error('Failed to save timeline event');
    }
  };

  const handleEditTimeline = (event) => {
    setSelectedEvent(event);
    setTimelineForm({
      year: event.year,
      title: event.title,
      description: event.description,
      image: event.image || ''
    });
    setShowTimelineModal(true);
  };

  const deleteTimelineEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this timeline event?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'timeline', eventId));
        toast.success('Timeline event deleted successfully');
        fetchTimelineEvents();
      } catch (error) {
        console.error('Error deleting timeline event:', error);
        toast.error('Failed to delete timeline event');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            <HiLogout className="mr-2" />
            Logout as Admin
          </button>
        </div>
        
        {selectedPost ? (
          <EditPostForm
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onUpdate={handleUpdatePost}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {!post.approved && (
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleEditPost(post)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Management Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Timeline Management</h2>
            <button
              onClick={() => setShowTimelineModal(true)}
              className="bg-[#008000] text-white px-4 py-2 rounded-md flex items-center hover:bg-[#006400] transition-colors duration-200"
            >
              <HiPlus className="h-5 w-5 mr-2" />
              Add Timeline Event
            </button>
          </div>
          
          <div className="space-y-4">
            {timelineEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {event.year} - {event.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{event.description}</p>
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="mt-4 max-w-xs rounded-lg shadow-md"
                      />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTimeline(event)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <HiPencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteTimelineEvent(event.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008000] focus:border-transparent"
              />
              <HiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008000] mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
                              <HiUser className="h-6 w-6 text-[#ffff00]" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-[#ffff00] text-[#008000]' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleAdminRole(user.id, user.role)}
                          className={`flex items-center px-3 py-1 rounded-md ${
                            user.role === 'admin'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-[#008000] hover:bg-green-50'
                          }`}
                        >
                          <HiShieldCheck className="h-5 w-5 mr-1" />
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id, user.role)}
                          className="flex items-center px-3 py-1 rounded-md text-red-600 hover:bg-red-50"
                        >
                          <HiTrash className="h-5 w-5 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedEvent ? 'Edit Timeline Event' : 'Add New Timeline Event'}
            </h2>
            <form onSubmit={handleTimelineSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={timelineForm.year}
                    onChange={(e) => setTimelineForm({ ...timelineForm, year: parseInt(e.target.value) })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={timelineForm.title}
                    onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={timelineForm.description}
                    onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={timelineForm.image}
                    onChange={(e) => setTimelineForm({ ...timelineForm, image: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowTimelineModal(false);
                    setSelectedEvent(null);
                    setTimelineForm({ year: '', title: '', description: '', image: '' });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008000] hover:bg-[#006400] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {selectedEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AdminPage; 