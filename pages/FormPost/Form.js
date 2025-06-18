'use client';
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

import gamesImg from '@/gamesImagesData/Data'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from '@/config/Firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { CldUploadWidget } from 'next-cloudinary';


function Form() {
  
  
  
    const db = getFirestore(app); 
    const [games,setGames] = useState()
    const [inputs, setInputs] = useState({
      title: '',
      desc: '',
      date: '',
      image: '',
      approved: false
    });
    const [imageUrl, setImageUrl] = useState('')
    const { data: session } = useSession()
    const MAX_DESCRIPTION_LENGTH = 600; // Maximum characters allowed
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(()=>{
      setGames(gamesImg)
      if (session?.user) {
        setInputs((values)=>({...values,userName:session.user.name }))
        setInputs((values)=>({...values,userImage:session.user.image }))
        setInputs((values)=>({...values,useremail:session.user.email }))
      }
    }, [session])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'desc' && value.length > MAX_DESCRIPTION_LENGTH) {
          return; // Don't update if exceeding max length
        }
        setInputs((prev) => ({
          ...prev,
          [name]: value,
        }));
    }

        

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (!imageUrl) {
            toast.error("الرجاء رفع صورة أولاً!")
            setLoading(false);
            return;
        }
        try {
            const postData = {
                ...inputs,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString(),
                approved: false,
                useremail: session?.user?.email,
                userName: session?.user?.name,
                userImage: session?.user?.image
            };
            
            console.log("Saving post data:", postData); // Debug log
            
            const postsRef = collection(db, 'posts');
            await addDoc(postsRef, postData);
            
            console.log("Post saved successfully"); // Debug log
            
            toast.success("تم إنشاء المنشور بنجاح!")
            // Reset form
            setInputs({
              title: '',
              desc: '',
              date: '',
              image: '',
              approved: false
            });
            setImageUrl('')
            // Redirect to profile page
            router.push('/profile')
        } catch (error) {
            console.error("Error creating post:", error); // Debug log
            toast.error("فشل في إنشاء المنشور. الرجاء المحاولة مرة أخرى.")
        } finally {
            setLoading(false);
        }
    };

    const handleImageError = () => {
      setImageError(true);
      toast.error("فشل في تحميل معاينة الصورة. الرجاء المحاولة مرة أخرى.");
    };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 border border-amber-300">
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 text-right">العنوان</label>
          <input 
            onChange={handleChange} 
            name='title' 
            type="text" 
            id="title" 
            value={inputs.title}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#008000] focus:border-[#008000] block w-full p-2.5 text-right" 
            placeholder='أدخل اسم الشهيد' 
            required 
          />
        </div>

        <div className="mb-5">
          <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 text-right">الوصف</label>
          <textarea 
            onChange={handleChange} 
            name='desc' 
            id="desc" 
            value={inputs.desc}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#008000] focus:border-[#008000] block w-full p-2.5 text-right" 
            placeholder="مقتبس من حياة الشهيد"
            required 
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows="4"
          />
          <div className="text-sm text-gray-500 mt-1 text-right">
            {(inputs.desc || '').length}/{MAX_DESCRIPTION_LENGTH} حرف
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 text-right">التاريخ</label>
          <input 
            onChange={handleChange} 
            name='date' 
            type="date" 
            id="date" 
            value={inputs.date}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#008000] focus:border-[#008000] block w-full p-2.5" 
            required 
          />
        </div>

        <div className="flex flex-col space-y-4">
          <CldUploadWidget
            uploadPreset="Martyrs_folder"
            onSuccess={(result) => {
              const url = result.info.secure_url;
              setImageUrl(url);
              setInputs((values) => ({ ...values, image: url }));
              setImageError(false);
              toast.success("تم رفع الصورة بنجاح!");
            }}
            onError={(error) => {
              toast.error("خطأ في رفع الصورة: " + error.message);
              setImageError(true);
            }}
          >
            {({ open }) => (
              <div>
                <button
                  type="button"
                  className="text-white mt-4 flex bg-[#008000] hover:bg-[#008000]/90 focus:ring-4 focus:outline-none focus:ring-[#008000] font-medium rounded-lg text-sm px-4 py-2 cursor-pointer transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    open();
                  }}
                >
                  رفع صورة
                </button>
                {imageUrl && !imageError && (
                  <div className="mt-4">
                    <img 
                      src={imageUrl} 
                      alt="الصورة المرفوعة" 
                      onError={handleImageError}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" 
                    />
                    <p className="text-sm text-gray-500 mt-2 text-right">معاينة الصورة</p>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>

          <button
            type="submit"
            disabled={loading}
            className="text-white bg-[#008000] hover:bg-[#008000]/90 focus:ring-4 focus:outline-none focus:ring-[#008000] font-medium rounded-lg text-sm px-6 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء المنشور'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
