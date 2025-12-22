// Firebase Admin Configuration (Server-side)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let app: App | undefined;

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    // Check if service account credentials are available
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Admin credentials not configured');
      }
      return null;
    }

    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    app = getApps()[0];
  }

  return app;
};

// Send push notification to specific device
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  link?: string
) => {
  try {
    const app = initializeFirebaseAdmin();
    if (!app) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Admin not initialized');
      }
      return null;
    }

    const messaging = getMessaging(app);
    
    const message = {
      notification: {
        title,
        body,
      },
      data: link ? { link } : undefined,
      token,
    };

    const response = await messaging.send(message);
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error sending push notification:', error);
    }
    return null;
  }
};

// Send push notification to multiple devices
export const sendMultiplePushNotifications = async (
  tokens: string[],
  title: string,
  body: string,
  link?: string
) => {
  try {
    const app = initializeFirebaseAdmin();
    if (!app) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Admin not initialized');
      }
      return null;
    }

    const messaging = getMessaging(app);
    
    const message = {
      notification: {
        title,
        body,
      },
      data: link ? { link } : undefined,
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);
    return response;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error sending multiple push notifications:', error);
    }
    return null;
  }
};

export default initializeFirebaseAdmin;
