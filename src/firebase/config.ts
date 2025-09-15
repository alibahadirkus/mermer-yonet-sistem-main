import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase yapılandırmanızı buraya yapıştırın
const firebaseConfig = {
  apiKey: "AIzaSyCk18PZ6wUQ416zHpv4FT9diz8PJnwfjjQ",
  authDomain: "acmaden-e6e93.firebaseapp.com",
  projectId: "acmaden-e6e93",
  storageBucket: "acmaden-e6e93.appspot.com",
  messagingSenderId: "71736025385",
  appId: "1:71736025385:web:a019da9ef0adb8685cd738",
  measurementId: "G-YXLNH3P4QJ"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Storage servislerini al
export const db = getFirestore(app);
export const storage = getStorage(app);
