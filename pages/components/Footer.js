import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#008000] to-[#008000]/80 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#ffff00]">من هم حزب الله</h3>
            <p className="text-white/90">
            حزب الله حركة مقاومة إسلامية لبنانية، نشأت دفاعًا عن الأرض والكرامة، وتواصل مسيرتها في سبيل التحرير والعدالة
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#ffff00]">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/90 hover:text-[#ffff00] transition"> الصفحة الرئيسية</Link></li>
              <li><Link href="/timeline" className="text-white/90 hover:text-[#ffff00] transition">الخط الزمني لحزب الله</Link></li>
              <li><Link href="/profile" className="text-white/90 hover:text-[#ffff00] transition">الملف الشخصي</Link></li>
              <li><Link href="/create-post" className="text-white/90 hover:text-[#ffff00] transition">إنشاء منشور</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#ffff00]">تابعونا</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/bilal3_13?igsh=MTJtM2o0anVrZWgxMQ==" className="text-white/90 hover:text-[#ffff00] transition">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.tiktok.com/@allimuslims?_t=ZS-8wSqacWBZNC&_r=1" className="text-white/90 hover:text-[#ffff00] transition">
                <FaTiktok size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/90">
          <p>&copy; {new Date().getFullYear()} حزب الله</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
