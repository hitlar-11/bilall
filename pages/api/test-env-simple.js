export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    // Check Google ID format
    GOOGLE_ID_FORMAT: process.env.GOOGLE_ID ? 
      (process.env.GOOGLE_ID.includes('.apps.googleusercontent.com') ? 'valid' : 'invalid format') : 
      'not set'
  };

  // Identify issues
  const issues = [];
  if (!envCheck.hasNEXTAUTH_SECRET) {
    issues.push('NEXTAUTH_SECRET is missing');
  }
  if (!envCheck.hasGOOGLE_ID) {
    issues.push('GOOGLE_ID is missing');
  }
  if (!envCheck.hasGOOGLE_SECRET) {
    issues.push('GOOGLE_SECRET is missing');
  }
  if (envCheck.GOOGLE_ID_FORMAT === 'invalid format') {
    issues.push('GOOGLE_ID format is invalid (should end with .apps.googleusercontent.com)');
  }
  if (!envCheck.NEXTAUTH_URL || envCheck.NEXTAUTH_URL === 'not set') {
    issues.push('NEXTAUTH_URL is missing');
  }

  res.status(200).json({
    message: 'Environment Variables Check',
    environment: envCheck,
    issues: issues,
    suggestions: issues.length > 0 ? [
      'Set all required environment variables in Vercel',
      'Make sure GOOGLE_ID ends with .apps.googleusercontent.com',
      'Redeploy after setting environment variables'
    ] : ['All environment variables appear to be set correctly'],
    timestamp: new Date().toISOString()
  });
} 