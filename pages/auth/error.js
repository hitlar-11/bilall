import { useRouter } from "next/router";
import Link from "next/link";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 text-right">
            خطأ في تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-right">
            {error === "AccessDenied"
              ? "تم رفض الوصول. يرجى المحاولة مرة أخرى."
              : error === "Configuration"
              ? "خطأ في إعدادات التطبيق. يرجى التحقق من متغيرات البيئة."
              : "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى."}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Link
            href="/login"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#008000] hover:bg-[#008000]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008000]"
          >
            العودة إلى صفحة تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
} 