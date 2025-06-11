import React from 'react';
import { HiSearch } from 'react-icons/hi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function Hero({ onSearch }) {
  const { data: session } = useSession();

  return (
    <div className="relative bg-gradient-to-r from-[#008000] to-[#008000]/80 py-24 ">
      <div className="absolute inset-0 bg-opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#ffff00] mb-6 drop-shadow-lg">
            تكريم شهدائنا
          </h1>
          <p className="text-2xl text-white mb-8 drop-shadow-md max-w-3xl mx-auto">
            شارك واحفظ قصص أبطالنا الذين ضحوا بأرواحهم من أجل حريتنا
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="...ابحث عن الشهداء       "
              onChange={(e) => onSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ffff00] text-gray-800 placeholder-gray-500 text-right"
            />
            <HiSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#008000]" />
          </div>
          {session ? (
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/create-post">
                <button className="px-6 py-3 bg-[#ffff00] text-[#008000] rounded-full hover:bg-[#ffff00]/90 transition-colors duration-200 shadow-lg font-semibold">
                  إنشاء منشور
                </button>
              </Link>
              <Link href="/profile">
                <button className="px-6 py-3 bg-white text-[#008000] rounded-full hover:bg-white/90 transition-colors duration-200 shadow-lg font-semibold">
                  الملف الشخصي
                </button>
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/api/auth/signin">
                <button className="px-6 py-3 bg-[#ffff00] text-[#008000] rounded-full hover:bg-[#ffff00]/90 transition-colors duration-200 shadow-lg font-semibold">
                  تسجيل الدخول
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
}

export default Hero;
