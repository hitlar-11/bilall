import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();
  const { callbackUrl } = router.query;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/images/Hezbollah_logo.jpg"
              alt="شهداء المقاومة"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 text-right">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-right">
            قم بتسجيل الدخول للوصول إلى حسابك
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => signIn("google", { callbackUrl: callbackUrl || "/" })}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#008000] hover:bg-[#008000]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008000]"
          >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            تسجيل الدخول باستخدام Google
          </button>
        </div>
      </div>
    </div>
  );
} 