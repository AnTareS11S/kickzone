import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'futbolistapro.firebaseapp.com',
  projectId: 'futbolistapro',
  storageBucket: 'futbolistapro.appspot.com',
  messagingSenderId: '534782489819',
  appId: '1:534782489819:web:74ba244a8d9d098a5ec8fe',
  measurementId: 'G-ZEB5F3MEZ7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
