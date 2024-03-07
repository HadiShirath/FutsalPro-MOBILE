// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: '######################',
  authDomain: '######################',
  projectId: '######################',
  storageBucket: '######################',
  messagingSenderId: '######################',
  appId: '######################',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
