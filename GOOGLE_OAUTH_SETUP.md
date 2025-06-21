# Google OAuth Setup Guide

## Issue: "Google sign in failed - no response received"

This error typically occurs when Google OAuth is not properly configured. Follow these steps to fix it:

## Step 1: Create Google OAuth Credentials

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create or Select a Project
- Create a new project or select an existing one
- Note down your Project ID

### 3. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" or "Google Identity"
- Click "Enable"

### 4. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Choose "Web application" as the application type

### 5. Configure OAuth Consent Screen
- Set up the OAuth consent screen if prompted
- Add your domain to authorized domains
- Add test users if in testing mode

### 6. Configure OAuth Client
- **Name**: Your app name (e.g., "Martyrs App")
- **Authorized JavaScript origins**:
  ```
  https://bilal-313.vercel.app
  http://localhost:3000 (for development)
  ```
- **Authorized redirect URIs**:
  ```
  https://bilal-313.vercel.app/api/auth/callback/google
  http://localhost:3000/api/auth/callback/google (for development)
  ```

### 7. Get Your Credentials
- After creating, you'll get:
  - **Client ID**: Looks like `123456789-abcdefghijklmnop.apps.googleusercontent.com`
  - **Client Secret**: A long string of characters

## Step 2: Set Environment Variables in Vercel

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project

### 2. Add Environment Variables
Go to "Settings" > "Environment Variables" and add:

```env
GOOGLE_ID=your-client-id-here
GOOGLE_SECRET=your-client-secret-here
NEXTAUTH_SECRET=02810e63a6c0be345801c530e2f32cbd48f03df6696aa2166563ca2d09489496
NEXTAUTH_URL=https://bilal-313.vercel.app
```

### 3. Redeploy
- After adding environment variables, redeploy your application

## Step 3: Test Configuration

### 1. Check Environment Variables
Visit: `https://bilal-313.vercel.app/api/auth/test-google`

This will show you:
- Whether credentials are set
- If the format is correct
- Common issues and solutions

### 2. Check General Health
Visit: `https://bilal-313.vercel.app/api/health`

### 3. Test Google Sign-In
- Go to your login page
- Try Google sign-in
- Check browser console for detailed error messages

## Common Issues and Solutions

### Issue 1: "Configuration" Error
**Cause**: Missing or incorrect Google credentials
**Solution**: 
- Double-check GOOGLE_ID and GOOGLE_SECRET in Vercel
- Ensure credentials are from the correct project
- Redeploy after adding environment variables

### Issue 2: "AccessDenied" Error
**Cause**: OAuth consent screen not configured properly
**Solution**:
- Add your domain to authorized domains in Google Cloud Console
- Add test users if in testing mode
- Publish the app if ready for production

### Issue 3: "Redirect URI Mismatch"
**Cause**: Redirect URI not properly configured
**Solution**:
- Ensure redirect URI exactly matches: `https://bilal-313.vercel.app/api/auth/callback/google`
- Check for extra spaces or typos

### Issue 4: "Invalid Client" Error
**Cause**: Client ID format is incorrect
**Solution**:
- Ensure Client ID ends with `.apps.googleusercontent.com`
- Copy the entire Client ID from Google Cloud Console

## Debugging Steps

### 1. Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Try Google sign-in
- Look for error messages

### 2. Check Network Tab
- Go to Network tab in Developer Tools
- Try Google sign-in
- Look for failed requests to Google OAuth endpoints

### 3. Check Vercel Logs
- Go to Vercel Dashboard > Your Project > Functions
- Check for error logs in the `/api/auth/[...nextauth]` function

### 4. Test Endpoints
Visit these URLs to check your setup:
- `https://bilal-313.vercel.app/api/health`
- `https://bilal-313.vercel.app/api/auth/test-env`
- `https://bilal-313.vercel.app/api/auth/test-google`

## Final Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Authorized origins set correctly
- [ ] Authorized redirect URIs set correctly
- [ ] Environment variables set in Vercel
- [ ] Application redeployed
- [ ] Test endpoints working
- [ ] Google sign-in working

## Support

If you're still having issues after following this guide:

1. Check the test endpoints for specific error messages
2. Verify all environment variables are set correctly
3. Ensure Google Cloud Console settings match exactly
4. Check Vercel deployment logs for server-side errors 