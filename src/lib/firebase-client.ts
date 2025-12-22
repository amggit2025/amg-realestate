// Firebase Client Configuration (Browser-side)
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCgjytGZMV9pW9R7ANUqJCpAM9zVCrKB7M",
  authDomain: "amg-real-estate.firebaseapp.com",
  projectId: "amg-real-estate",
  storageBucket: "amg-real-estate.firebasestorage.app",
  messagingSenderId: "878348437858",
  appId: "1:878348437858:web:1961c0036105690b6fc43b",
  measurementId: "G-2XC9WM1MD5"
};

// Initialize Firebase
let app: FirebaseApp | undefined;
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
}

// Get Firebase Messaging instance
let messaging: Messaging | null = null;

export const getFirebaseMessaging = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && app) {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const messaging = getFirebaseMessaging();
      if (!messaging) return null;

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      
      return token;
    }
    
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting notification permission:', error);
    }
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;
