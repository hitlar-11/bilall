import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { getFirestore, collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { app } from "@/config/Firebase";
import Layout from '@/pages/components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiPlus, HiTrash, HiPencil } from 'react-icons/hi';

function AdminTimeline() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (!session || session.user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchEvents();
  }, [session, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const eventsQuery = query(collection(db, 'timeline'));
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort events by year
      eventsData.sort((a, b) => a.year - b.year);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      const eventData = {
        year: parseInt(newEvent.year),
        description: newEvent.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (newEvent.day) eventData.day = parseInt(newEvent.day);
      if (newEvent.month) eventData.month = parseInt(newEvent.month);

      await addDoc(collection(db, 'timeline'), eventData);

      toast.success('Timeline event added successfully');
      setShowAddModal(false);
      setNewEvent({ year: '', day: '', month: '', description: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add timeline event');
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      year: event.year,
      title: event.title,
      description: event.description,
      image: event.image || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'timeline', eventId));
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-[#ffff00] drop-shadow-lg">
              Timeline Management
            </h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#ffff00] text-[#008000] px-4 py-2 rounded-md flex items-center hover:bg-yellow-100 transition-colors duration-200"
            >
              <HiPlus className="h-5 w-5 mr-2" />
              Add Event
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008000] mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
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
                          onClick={() => handleEdit(event)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <HiPencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <HiTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {showEditModal ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedEvent(null);
                    setFormData({ year: '', title: '', description: '', image: '' });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#008000] hover:bg-[#006400] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {showEditModal ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}

export default AdminTimeline; 