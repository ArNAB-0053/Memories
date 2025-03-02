# Memories - Capture. Cherish. Share.

A modern web application for sharing and storing your precious memories through images. This platform allows users to upload images, manage their visibility (public/private), and create personal profiles accessible via unique usernames.

## Demo

- **Live Site**: [Visit Memories App](https://your-deployment-link-here)
- **Demo Video**: [Watch Demo](https://your-demo-video-link-here)

## Features

- **User Authentication**: Secure signup and login with email/password or Google authentication
- **Personal Profiles**: Unique username-based profiles at `domain.com/username`
- **Image Management**: Upload, view, edit, and delete your memories
- **Privacy Controls**: Toggle images between public and private visibility
- **Global Feed**: Discover public memories shared by the community
- **Responsive Design**: Optimized viewing experience across all devices
- **Mosaic Layout**: Beautiful masonry grid layout that adapts to screen size

## Tech Stack  

- **Frontend**: Next.js - React framework
- **Backend**: Firebase Firestore & Firebase Storage  
- **Authentication**: Clerk for email-password & Google authentication  
- **Styling**: Tailwind CSS for utility-first styling  
- **UI Components**: ShadCN for beautiful, accessible components  
- **Notifications**: Sonner for toast messages  
- **Icons**: Lucide React for consistent, customizable icons  

## Project Architecture

### Authentication & User Profiles
- Users must provide a unique username on signup
- Profiles are accessible at `domain.com/username`
- Public profiles display all publicly shared images

### Firebase Data Structure

#### User Images Collection (`userImages`)
Path: `userImages / images / {username} / {imageId}`

Example Document:
```json
{
  "title": "Sunset View",
  "description": "A beauiful sunset siew",
  "imageUrl": "https://storage.firebase.com/xyz.jpg",
  "username": "john_doe",
  "isPublic": true,
  "createdAt": Timestamp
}
```

#### Global Images Collection (`globalImages`)
Path: `globalImages / {globalImageId}`

Example Document:
```json
{
  "title": "Sunset View",
  "imageUrl": "https://storage.firebase.com/xyz.jpg",
  "username": "john_doe",
  "userImageId": "{imageId}"
}
```

### Security & Permissions
- Only image owners can delete or change visibility settings
- Public images are viewable by all users, but not modifiable
- UI controls visibility of action buttons based on ownership

## Getting Started

### Set Up

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArNAB-0053/memories.git
   cd memories
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   * Copy the `.env.example` file to `.env.local`
   * Replace the placeholder values with your Firebase and Clerk credentials

4. **Firebase Setup**
   * Set up **Firebase Console** and create a new project.
   * Enable **Firestore Database** and set it to test mode.
   * Enable **Storage** and set rules to allow authenticated users to read/write.
   * Copy Firebase credentials and add them to `.env.local`:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Clerk Setup**
   * Go to **Clerk Dashboard** and create an account.
   * In the **API Keys** section, copy the **Publishable Key** and **Secret Key**.
   * Enable **Email + Google Authentication** under **User & Authentication** settings.
   * Add the copied Clerk credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

6. **Run the Development Server**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.
