import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/config/Firebase';

// Add error handling for missing environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set');
}

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  console.error('Google OAuth credentials are missing');
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  debug: false,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
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
        } else {
          await updateDoc(userRef, {
            name: user.name,
            image: user.image,
            updatedAt: new Date().toISOString(),
          });
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
}

// Add error handling wrapper
const handler = NextAuth(authOptions);

export default async function auth(req, res) {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('NextAuth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}