# شهداء المقاومة - Martyrs of Resistance

A website dedicated to honoring and remembering the martyrs of the Islamic Resistance.

## Features

- Timeline of historical events
- Martyr profiles and stories
- Admin dashboard for content management
- Responsive design with RTL support
- Arabic language interface

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Firebase
- NextAuth.js

## Deployment Instructions

### Prerequisites

1. Node.js (v14 or later)
2. npm or yarn
3. A Vercel account
4. A Firebase account

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

### Local Development

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment to Vercel

1. Push your code to a GitHub repository:
```bash
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account.

3. Click "New Project" and import your repository.

4. Configure your environment variables in the Vercel dashboard.

5. Click "Deploy"

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)

2. Enable Authentication and Firestore

3. Add your Firebase configuration to the environment variables

4. Set up Firestore security rules

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
"# martyrs" 
"# martyrs" 
