export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Temporarily allow access in production for debugging
  // if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  const googleConfig = {
    hasGOOGLE_ID: !!process.env.GOOGLE_ID,
    hasGOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
    GOOGLE_ID_LENGTH: process.env.GOOGLE_ID ? process.env.GOOGLE_ID.length : 0,
    GOOGLE_SECRET_LENGTH: process.env.GOOGLE_SECRET ? process.env.GOOGLE_SECRET.length : 0,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
    VERCEL_URL: process.env.VERCEL_URL || 'not set',
    // Check if Google ID looks like a valid format
    GOOGLE_ID_FORMAT: process.env.GOOGLE_ID ? 
      (process.env.GOOGLE_ID.includes('.apps.googleusercontent.com') ? 'valid' : 'invalid format') : 
      'not set'
  };

  // Common issues and solutions
  const commonIssues = {
    missingCredentials: !googleConfig.hasGOOGLE_ID || !googleConfig.hasGOOGLE_SECRET,
    invalidFormat: googleConfig.GOOGLE_ID_FORMAT === 'invalid format',
    missingURL: !process.env.NEXTAUTH_URL && !process.env.VERCEL_URL,
    suggestions: []
  };

  if (commonIssues.missingCredentials) {
    commonIssues.suggestions.push('Set GOOGLE_ID and GOOGLE_SECRET environment variables');
  }
  
  if (commonIssues.invalidFormat) {
    commonIssues.suggestions.push('Google Client ID should end with .apps.googleusercontent.com');
  }
  
  if (commonIssues.missingURL) {
    commonIssues.suggestions.push('Set NEXTAUTH_URL environment variable');
  }

  if (!commonIssues.missingCredentials && !commonIssues.invalidFormat && !commonIssues.missingURL) {
    commonIssues.suggestions.push('Configuration looks correct. Check Google Cloud Console OAuth settings');
  }

  res.status(200).json({
    message: 'Google OAuth Configuration Check',
    config: googleConfig,
    issues: commonIssues,
    timestamp: new Date().toISOString()
  });
} 