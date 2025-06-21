import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;
  const [envStatus, setEnvStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check environment status when component mounts
    const checkEnv = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/test-env');
        if (response.ok) {
          const data = await response.json();
          setEnvStatus(data);
        }
      } catch (err) {
        console.error('Failed to check environment:', err);
      } finally {
        setLoading(false);
      }
    };

    checkEnv();
  }, []);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "AccessDenied":
        return "تم رفض الوصول. يرجى المحاولة مرة أخرى.";
      case "Configuration":
        return "خطأ في إعدادات التطبيق. يرجى التحقق من متغيرات البيئة.";
      case "Verification":
        return "خطأ في التحقق من الحساب. يرجى المحاولة مرة أخرى.";
      case "Default":
        return "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      default:
        return `خطأ غير معروف: ${errorCode}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 text-right">
            خطأ في تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-right">
            {getErrorMessage(error)}
          </p>
          
          {/* Show error code for debugging */}
          {error && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-left">
              <p className="text-sm font-mono text-gray-700">
                Error Code: <span className="font-bold">{error}</span>
              </p>
            </div>
          )}

          {/* Environment Status */}
          {loading ? (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-700">Checking environment...</p>
            </div>
          ) : envStatus ? (
            <div className="mt-4 p-3 bg-gray-50 rounded text-left">
              <h4 className="text-sm font-bold text-gray-700 mb-2">Environment Status:</h4>
              <div className="text-xs space-y-1">
                <p>NODE_ENV: <span className={envStatus.environment.NODE_ENV === 'production' ? 'text-green-600' : 'text-yellow-600'}>{envStatus.environment.NODE_ENV}</span></p>
                <p>NEXTAUTH_SECRET: <span className={envStatus.environment.hasNEXTAUTH_SECRET ? 'text-green-600' : 'text-red-600'}>{envStatus.environment.hasNEXTAUTH_SECRET ? '✓ Set' : '✗ Missing'}</span></p>
                <p>GOOGLE_ID: <span className={envStatus.environment.hasGOOGLE_ID ? 'text-green-600' : 'text-red-600'}>{envStatus.environment.hasGOOGLE_ID ? '✓ Set' : '✗ Missing'}</span></p>
                <p>GOOGLE_SECRET: <span className={envStatus.environment.hasGOOGLE_SECRET ? 'text-green-600' : 'text-red-600'}>{envStatus.environment.hasGOOGLE_SECRET ? '✓ Set' : '✗ Missing'}</span></p>
                <p>NEXTAUTH_URL: <span className="text-gray-600">{envStatus.environment.NEXTAUTH_URL}</span></p>
                <p>VERCEL_URL: <span className="text-gray-600">{envStatus.environment.VERCEL_URL}</span></p>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-red-50 rounded">
              <p className="text-sm text-red-700">Failed to check environment status</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#008000] hover:bg-[#008000]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008000]"
          >
            العودة إلى صفحة تسجيل الدخول
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008000]"
          >
            تحديث الصفحة
          </button>
        </div>
      </div>
    </div>
  );
} 