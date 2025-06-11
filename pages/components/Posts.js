import React, { useState } from 'react';
import { HiCalendar, HiX } from 'react-icons/hi';
import Link from 'next/link';

function Posts({ posts }) {
  const DESCRIPTION_LENGTH_LIMIT = 100; // Show "Show More" if description is longer than this
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageError, setImageError] = useState({});

  const openModal = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  const handleImageError = (postId) => {
    setImageError(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد منشورات متاحة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-[300px] overflow-hidden bg-gray-100">
                {!imageError[post.id] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={post.imageUrl || post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(post.id)}
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">الصورة غير متوفرة</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#008000] transition-colors duration-300 text-right">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 text-right">
                  {post.desc || post.description}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <HiCalendar className="mr-1 flex-shrink-0" />
                    <span className="truncate">{post.date || 'لا يوجد تاريخ'}</span>
                  </div>
                  {(post.desc || post.description)?.length > DESCRIPTION_LENGTH_LIMIT && (
                    <button 
                      onClick={() => openModal(post)}
                      className="w-full bg-[#008000] hover:bg-[#008000]/90 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
                    >
                      عرض المزيد
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
              >
                <HiX className="h-6 w-6" />
              </button>
              <div className="relative w-full h-[500px] bg-gray-100">
                {!imageError[selectedPost.id] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedPost.imageUrl || selectedPost.image}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(selectedPost.id)}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">الصورة غير متوفرة</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">
                {selectedPost.title}
              </h2>
              <div className="flex items-center text-gray-500 mb-4">
                <HiCalendar className="mr-2" />
                <span>{selectedPost.date || 'لا يوجد تاريخ'}</span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-right">
                  {selectedPost.desc || selectedPost.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;