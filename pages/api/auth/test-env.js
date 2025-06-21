export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Only allow in development or with a secret key
  if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    hasGOOGLE_ID: !!process.env.GOOGLE_ID,
    hasGOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
    VERCEL_URL: process.env.VERCEL_URL || 'not set',
    // Don't expose actual secret values
    NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length : 0,
    GOOGLE_ID_LENGTH: process.env.GOOGLE_ID ? process.env.GOOGLE_ID.length : 0,
    GOOGLE_SECRET_LENGTH: process.env.GOOGLE_SECRET ? process.env.GOOGLE_SECRET.length : 0,
  };

  res.status(200).json({
    message: 'Environment check',
    environment: envCheck,
    timestamp: new Date().toISOString()
  });
} 