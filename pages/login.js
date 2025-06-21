import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import { FaGoogle } from 'react-icons/fa';
import Layout from './components/Layout';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);

  // Don't render if loading or already authenticated
  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (status === 'authenticated') {
    return null; // Will redirect via useEffect
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (isRegister) {
      if (!formData.name) {
        setError('Please enter your name');
        return false;
      }
      if (formData.name.length < 2) {
        setError('Name must be at least 2 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting credentials sign in...');
      
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timed out')), 30000)
      );

      if (isRegister) {
        // Handle registration
        console.log('Processing registration...');
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        console.log('Registration successful, signing in...');
        // Registration successful, now sign in
        const signInPromise = signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        const result = await Promise.race([signInPromise, timeoutPromise]);

        if (!result) {
          throw new Error('Sign in failed - no response received. Please check your credentials.');
        }

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.ok) {
          throw new Error('Invalid email or password');
        }
      } else {
        // Handle login
        console.log('Processing login...');
        const signInPromise = signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        const result = await Promise.race([signInPromise, timeoutPromise]);

        if (!result) {
          throw new Error('Sign in failed - no response received. Please check your credentials.');
        }

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.ok) {
          throw new Error('Invalid email or password');
        }
      }

      console.log('Sign in successful, redirecting...');
      router.push('/');
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Starting Google sign in...');
      
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Google sign in timed out')), 30000)
      );
      
      const signInPromise = signIn('google', { 
        redirect: false,
        callbackUrl: '/'
      });
      
      const result = await Promise.race([signInPromise, timeoutPromise]);
      
      console.log('Google sign in result:', result);
      
      if (!result) {
        throw new Error('Google sign in failed - no response received. Please check your Google OAuth configuration.');
      }
      
      if (result?.error) {
        console.error('Google sign in error:', result.error);
        
        // Provide specific error messages for common issues
        let errorMessage = result.error;
        if (result.error.includes('Configuration')) {
          errorMessage = 'Google OAuth is not properly configured. Please check your Google Client ID and Secret.';
        } else if (result.error.includes('AccessDenied')) {
          errorMessage = 'Access denied. Please try again or contact support.';
        } else if (result.error.includes('Verification')) {
          errorMessage = 'Verification failed. Please try again.';
        }
        
        throw new Error(errorMessage);
      }
      
      if (result?.ok) {
        console.log('Google sign in successful, redirecting...');
        router.push('/');
      } else {
        console.log('Google sign in result not ok:', result);
        throw new Error('Google sign in was not successful. Please try again.');
      }
    } catch (err) {
      console.error('Google login error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-[#008000] to-[#008000]/80 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    minLength={2}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008000]"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008000]"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008000]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#008000] text-white py-2 px-4 rounded-md hover:bg-[#008000]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#008000] text-white py-2 px-4 rounded-md hover:bg-[#008000]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              disabled={isLoading}
              className="text-[#008000] hover:text-[#008000]/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login; 