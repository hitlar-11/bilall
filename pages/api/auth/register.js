import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/config/Firebase';
import bcrypt from 'bcryptjs';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation rules
const passwordRules = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

function validatePassword(password) {
  if (password.length < passwordRules.minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!passwordRules.hasUpperCase.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!passwordRules.hasLowerCase.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!passwordRules.hasNumber.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!passwordRules.hasSpecialChar.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate name length
    if (name.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const db = getFirestore(app);
    const usersRef = collection(db, 'users');

    // Check if user already exists
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      role: 'user',
      image: null // Default image
    };

    const docRef = await addDoc(usersRef, userData);

    res.status(201).json({ 
      message: 'User created successfully',
      userId: docRef.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user: ' + error.message });
  }
} 