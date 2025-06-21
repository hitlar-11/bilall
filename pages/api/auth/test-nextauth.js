import { authOptions } from './[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test if NextAuth configuration is valid
    const configCheck = {
      hasProviders: authOptions.providers && authOptions.providers.length > 0,
      providerCount: authOptions.providers ? authOptions.providers.length : 0,
      hasGoogleProvider: authOptions.providers ? 
        authOptions.providers.some(p => p.id === 'google') : false,
      hasCredentialsProvider: authOptions.providers ? 
        authOptions.providers.some(p => p.id === 'credentials') : false,
      hasSecret: !!authOptions.secret,
      hasURL: !!authOptions.url,
      debug: authOptions.debug,
      sessionStrategy: authOptions.session?.strategy || 'not set'
    };

    // Test environment variables
    const envCheck = {
      hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      hasGOOGLE_ID: !!process.env.GOOGLE_ID,
      hasGOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set'
    };

    // Check for issues
    const issues = [];
    if (!configCheck.hasProviders) {
      issues.push('No authentication providers configured');
    }
    if (!configCheck.hasGoogleProvider) {
      issues.push('Google provider not found in configuration');
    }
    if (!configCheck.hasCredentialsProvider) {
      issues.push('Credentials provider not found in configuration');
    }
    if (!configCheck.hasSecret) {
      issues.push('NextAuth secret not configured');
    }
    if (!envCheck.hasNEXTAUTH_SECRET) {
      issues.push('NEXTAUTH_SECRET environment variable missing');
    }
    if (!envCheck.hasGOOGLE_ID) {
      issues.push('GOOGLE_ID environment variable missing');
    }
    if (!envCheck.hasGOOGLE_SECRET) {
      issues.push('GOOGLE_SECRET environment variable missing');
    }

    res.status(200).json({
      message: 'NextAuth Configuration Test',
      config: configCheck,
      environment: envCheck,
      issues: issues,
      suggestions: issues.length > 0 ? [
        'Check environment variables in Vercel',
        'Ensure all providers are properly configured',
        'Redeploy after fixing configuration issues'
      ] : ['NextAuth appears to be properly configured'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NextAuth test error:', error);
    res.status(500).json({
      message: 'Error testing NextAuth configuration',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 