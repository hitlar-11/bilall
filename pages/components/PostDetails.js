import React from 'react';
import { HiCalendar } from "react-icons/hi";

export default function PostDetails({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post?.imageUrl && (
        <div className="aspect-w-16 aspect-h-9 sm:aspect-h-12">
          <img
            src={post.imageUrl}
            alt={post.title || 'Post image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4 sm:p-5">
        <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 line-clamp-2">
          {post?.title || 'Untitled Post'}
        </h2>
        <p className="text-gray-600 mb-3 line-clamp-3 text-sm sm:text-base">
          {post?.desc || 'No description'}
        </p>
        
        <div className="flex items-center text-sm text-gray-500">
          <HiCalendar className="mr-1 flex-shrink-0" />
          <span className="truncate">{post?.date || 'No date'}</span>
        </div>
      </div>
    </div>
  );
}