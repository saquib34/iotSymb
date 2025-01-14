import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD8JNrdgHlS0RM9r-917L4rze2gaoCKiAo",
    authDomain: "srmiot.firebaseapp.com",
    projectId: "srmiot",
    storageBucket: "srmiot.firebasestorage.app",
    messagingSenderId: "382002007068",
    appId: "1:382002007068:web:04b094d79970667a22e3d9",
    measurementId: "G-7TWQTH6KV8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);