import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, collection, query, getDocs, orderBy, addDoc } from "firebase/firestore";
import { app } from "@/config/Firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/pages/components/Layout';

const Timeline = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newEvent, setNewEvent] = useState({
    year: '',
    day: '',
    month: '',
    description: ''
  });
 

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const eventsQuery = query(collection(db, 'timeline'), orderBy('year', 'asc'));
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const sortedEvents = eventsData.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month && b.month) {
          if (a.month !== b.month) return a.month - b.month;
        }
        if (a.day && b.day) return a.day - b.day;
        return 0;
      });

      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('فشل في جلب أحداث الجدول الزمني');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const year = parseInt(newEvent.year);
    if (isNaN(year)) {
      toast.error('Please enter a valid year');
      return;
    }
    try {
      const db = getFirestore(app);
      const eventData = {
        year,
        description: newEvent.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (newEvent.day) eventData.day = parseInt(newEvent.day);
      if (newEvent.month) eventData.month = parseInt(newEvent.month);

      await addDoc(collection(db, 'timeline'), eventData);

      toast.success('تمت إضافة الحدث بنجاح');
      setShowAddModal(false);
      setNewEvent({ year: '', day: '', month: '', description: '' });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('فشل في إضافة الحدث: ' + (error.message || ''));
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false);
      setShowAddModal(true);
      setPassword('');
      setIsAdmin(true);
    } else {
      toast.error('كلمة المرور غير صحيحة');
    }
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const closeEventDetails = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  const formatDate = (event) => {
    let dateStr = event.year.toString();
    if (event.month) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      dateStr = `${monthNames[event.month - 1]} ${dateStr}`;
    }
    if (event.day) {
      dateStr = `${event.day} ${dateStr}`;
    }
    return dateStr;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#ffff00] mb-4 drop-shadow-lg">
              المسيرة الجهادية لحزب الله
            </h1>
            <p className="text-white text-xl">
              محطات بارزة في مسيرة المقاومة الاسلامية
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffff00]"></div>
            </div>
          ) : (
            <div className="relative py-1">
              {/* Timeline line with animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-full bg-[#ffff00]/30 md:block hidden">
                <div className="absolute top-0 left-0 h-full w-0 bg-[#ffff00] animate-timeline-line"></div>
              </div>
              {/* Enhanced vertical line for mobile */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-[#ffff00]/30 via-[#ffff00]/50 to-[#ffff00]/30 md:hidden block" style={{ height: selectedEvent ? 'calc(100% - 200px)' : '100%' }}>
                <div className="absolute top-0 left-0 w-full h-0 bg-gradient-to-b from-[#ffff00] via-[#ffff00] to-[#ffff00] animate-timeline-line-vertical" style={{ animationDuration: selectedEvent ? '1.5s' : '2s' }}></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#ffff00] blur-sm animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#ffff00] blur-sm animate-pulse-slow"></div>
              </div>

              {/* Timeline events grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-4">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative flex justify-center animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className="cursor-pointer group"
                      onClick={() => openEventDetails(event)}
                    >
                      <div className="relative">
                        
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#ffff00] shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3">
                          <span className="text-2xl font-bold text-green-800">
                            
                            {formatDate(event)}
                          </span>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description box */}
              {selectedEvent && (
                <div className="mt-16 px-4 animate-slide-up">
                  <div className="max-w-4xl mx-auto bg-[#008000] rounded-lg p-8 shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-4xl font-bold text-[#ffff00] animate-fade-in">
                        {formatDate(selectedEvent)}
                      </div>
                      <button
                        onClick={closeEventDetails}
                        className="text-[#ffff00] hover:text-white transition-colors animate-fade-in"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-white text-xl leading-relaxed animate-fade-in text-right">
                      {selectedEvent.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div> 
    </Layout>
  );
};

export default Timeline;

// Update the animation styles
const styles = `
@keyframes timeline-line {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes timeline-line-vertical {
  from { height: 0; }
  to { height: 100%; }
}

@keyframes pulse-slow {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
  100% { transform: scale(1); opacity: 0.3; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-timeline-line {
  animation: timeline-line 1.5s ease-out forwards;
}

.animate-timeline-line-vertical {
  animation: timeline-line-vertical 2s ease-out forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
`; 