export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    // Check if basic environment variables are available
    env: {
      hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      hasGOOGLE_ID: !!process.env.GOOGLE_ID,
      hasGOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set',
    }
  };

  res.status(200).json(healthCheck);
} 