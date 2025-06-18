'use client';
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "@/config/Firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { HiX } from 'react-icons/hi';

// Dynamically import CldUploadWidget to prevent SSR issues
const CldUploadWidget = dynamic(
  () => import('next-cloudinary').then((mod) => mod.CldUploadWidget),
  { ssr: false }
);

function EditPostForm({ post, onClose, onUpdate }) {
  const [inputs, setInputs] = useState({
    title: '',
    desc: '',
    date: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const db = getFirestore(app);

  useEffect(() => {
    if (post) {
      setInputs({
        title: post.title || '',
        desc: post.desc || '',
        date: post.date || '',
      });
      setImageUrl(post.imageUrl || '');
    }
  }, [post]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...inputs,
        imageUrl: imageUrl || post.imageUrl,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "posts", post.id), updatedData);
      toast.success("Post updated successfully!");
      onUpdate(); // Refresh the posts list
      onClose(); // Close the modal
    } catch (error) {
      toast.error("Error updating post: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="desc"
              value={inputs.desc}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={inputs.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            {imageUrl && (
              <div className="mb-2">
                <img
                  src={imageUrl}
                  alt="Current"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded"
                />
              </div>
            )}
            <CldUploadWidget
              uploadPreset="Martyrs_folder"
              onSuccess={(result) => {
                setImageUrl(result.info.secure_url);
                toast.success("Image uploaded successfully!");
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  Change Image
                </button>
              )}
            </CldUploadWidget>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostForm; 