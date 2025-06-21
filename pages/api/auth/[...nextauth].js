import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/config/Firebase';
import bcrypt from 'bcryptjs';

// Add error handling for missing environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set');
}

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  console.error('Google OAuth credentials are missing');
}

// Auto-detect NEXTAUTH_URL for Vercel deployment
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  console.log('Auto-detected NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
}

// Log environment status for debugging
console.log('Environment check:', {
  hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
  hasGOOGLE_ID: !!process.env.GOOGLE_ID,
  hasGOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
  VERCEL_URL: process.env.VERCEL_URL || 'not set'
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const db = getFirestore(app);
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', credentials.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            return null;
          }

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          // Check if user has a password (Google users might not have one)
          if (!userData.password) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, userData.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            image: userData.image,
            role: userData.role || 'user'
          };
        } catch (error) {
          console.error('Credentials authorization error:', error);
          return null;
        }
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('SignIn callback triggered:', {
          provider: account?.provider,
          userEmail: user?.email,
          hasUser: !!user
        });

        const db = getFirestore(app);
        const userRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'user',
            provider: account?.provider || 'google',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          console.log('New user created in Firestore:', user.email);
        } else {
          await updateDoc(userRef, {
            name: user.name,
            image: user.image,
            updatedAt: new Date().toISOString(),
          });
          console.log('Existing user updated in Firestore:', user.email);
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', session.user.email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          session.user.role = userDoc.data().role;
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
}

// Add error handling wrapper
const handler = NextAuth(authOptions);

export default async function auth(req, res) {
  try {
    // Log the request for debugging
    console.log('NextAuth request:', {
      method: req.method,
      url: req.url,
      query: req.query,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type']
      }
    });

    const result = await handler(req, res);
    
    // Log the response for debugging
    console.log('NextAuth response status:', res.statusCode);
    
    return result;
  } catch (error) {
    console.error('NextAuth error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Return a proper error response
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Authentication failed'
    });
  }
}