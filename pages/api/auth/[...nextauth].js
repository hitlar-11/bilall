import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { app } from '@/config/Firebase';
import bcrypt from 'bcryptjs';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: { scope: 'email,public_profile' }
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url || null,
        }
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials:', { email: !!credentials?.email, password: !!credentials?.password });
          throw new Error('Please enter both email and password');
        }

        try {
          const db = getFirestore(app);
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', credentials.email.toLowerCase()));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log('No user found with email:', credentials.email);
            throw new Error('No user found with this email');
          }

          const userDoc = querySnapshot.docs[0];
          const user = userDoc.data();

          console.log('Found user:', { 
            email: user.email, 
            hasPassword: !!user.password,
            provider: user.provider,
            role: user.role 
          });

          // If user exists but has no password (social login)
          if (!user.password) {
            if (user.provider) {
              console.log('Social login account detected:', user.provider);
              throw new Error(`This account was created using ${user.provider}. Please use ${user.provider} to sign in.`);
            }
            console.log('Account has no password and no provider');
            throw new Error('Invalid account configuration. Please contact support.');
          }

          console.log('Attempting password comparison');
          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password comparison result:', isValid);

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: userDoc.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            image: user.image
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message);
        }
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const db = getFirestore(app);
        const userRef = db.collection('users').doc(user.email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          await userRef.set({
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'user';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const db = getFirestore(app);
        const userRef = db.collection('users').doc(session.user.email);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
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
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)