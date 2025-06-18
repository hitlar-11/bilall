import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { HiMenu, HiX, HiHome, HiUser, HiLogout, HiClock, HiShieldCheck } from 'react-icons/hi';
import Image from 'next/image';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from '@/config/Firebase';

// Fixed admin password
const ADMIN_PASSWORD = "0324010120120Abbass19#";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleAdminAccess = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (adminPassword.trim() !== ADMIN_PASSWORD) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      const db = getFirestore(app);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', session.user.email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('المستخدم غير موجود');
      }

      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data();

      if (user.role === 'admin') {
        setShowAdminModal(false);
        router.push('/admin');
        return;
      }

      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'admin',
        updatedAt: new Date().toISOString()
      });

      setShowAdminModal(false);
      window.location.href = '/admin';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#ffff00] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-[#008000] animate-pulse-slow">
                  <div className="absolute inset-0 bg-[#ffff00]/20 animate-ping-slow"></div>
                  <Image
                    src="/images/Hezbollah_logo.jpg"
                    alt="شهداء المقاومة"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
                <span className="text-xl font-bold text-[#008000] transition-colors duration-300 group-hover:text-[#ffff00]">شهداء المقاومة</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <Link href="/" className="flex items-center">
                <HiHome className="h-6 w-6 text-[#ffff00]" />
                <span className="ml-2 text-gray-800 font-semibold">الرئيسية</span>
              </Link>
              <Link href="/timeline" className="flex items-center">
                <HiClock className="h-6 w-6 text-[#ffff00]" />
                <span className="ml-2 text-gray-800 font-semibold">التاريخ</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {session ? (
                <>
                  <Link 
                    href="/create-post" 
                    className="text-gray-600 hover:text-[#ffff00] transition-colors duration-200"
                  >
                    إنشاء منشور
                  </Link>
                  {isAdmin ? (
                    <>
                      <Link 
                        href="/admin" 
                        className="flex items-center text-gray-600 hover:text-[#ffff00] transition-colors duration-200"
                      >
                        <HiShieldCheck className="h-5 w-5 mr-1" />
                        المشرف 
                      </Link>
                      <Link 
                        href="/admin/timeline" 
                        className="flex items-center text-gray-600 hover:text-[#ffff00] transition-colors duration-200"
                      >
                        <HiClock className="h-5 w-5 mr-1" />
                        إدارة التاريخ
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAdminModal(true)}
                      className="flex items-center text-gray-600 hover:text-[#ffff00] transition-colors duration-200"
                    >
                      <HiShieldCheck className="h-5 w-5 mr-1" />
                      المشرف 
                    </button>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      {session.user?.image ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffff00]">
                          <Image
                            src={session.user.image}
                            alt={session.user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                          <HiUser className="h-6 w-6 text-[#ffff00]" />
                        </div>
                      )}
                      <span className="text-gray-700">{session.user?.name}</span>
                      {isAdmin && (
                        <span className="px-2 py-1 text-xs bg-[#ffff00] text-[#008000] rounded-full">
                          مدير
                        </span>
                      )}
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-[#ffff00]"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          الملف الشخصي
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-[#ffff00]"
                        >
                          تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-[#ffff00] transition-colors duration-200"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-[#ffff00] transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {session ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 border-b">
                    {session.user?.image ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#ffff00]">
                        <Image
                          src={session.user.image}
                          alt={session.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                        <HiUser className="h-6 w-6 text-[#ffff00]" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-sm text-gray-500">{session.user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block px-2 py-1 text-xs bg-[#ffff00] text-[#008000] rounded-full mt-1">
                          مدير
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    href="/create-post" 
                    className="block px-3 py-2 text-gray-600 hover:text-[#ffff00] hover:bg-yellow-50 transition-colors duration-200"
                  >
                    إنشاء منشور
                  </Link>
                  {isAdmin ? (
                    <>
                      <Link 
                        href="/admin" 
                        className="flex items-center px-3 py-2 text-gray-600 hover:text-[#ffff00] hover:bg-yellow-50 transition-colors duration-200"
                      >
                        <HiShieldCheck className="h-5 w-5 mr-2" />
                        الإدارة
                      </Link>
                      <Link 
                        href="/admin/timeline" 
                        className="flex items-center px-3 py-2 text-gray-600 hover:text-[#ffff00] hover:bg-yellow-50 transition-colors duration-200"
                      >
                        <HiClock className="h-5 w-5 mr-2" />
                        إدارة التاريخ
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAdminModal(true)}
                      className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-[#ffff00] hover:bg-yellow-50 transition-colors duration-200"
                    >
                      <HiShieldCheck className="h-5 w-5 mr-2" />
                      المشرف
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-[#ffff00] hover:bg-yellow-50 transition-colors duration-200"
                  >
                    <HiLogout className="h-5 w-5 mr-2" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link 
                  href="/api/auth/signin" 
                  className="block px-3 py-2 text-gray-600 hover:text-[#ffff00] hover:bg-yellow-50 transition-colors duration-200"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-right">دخول الإدارة</h2>
            <form onSubmit={handleAdminAccess}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
                      required
                    />
                    <HiShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {error && (
                  <p className="text-red-500 text-sm text-right">{error}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#008000] hover:bg-[#008000]/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loading ? 'جاري التحقق...' : 'دخول'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar; 