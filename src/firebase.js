// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
