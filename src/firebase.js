// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBog6UxWU3SZZMe6IEKFx8IhlO3f8Vp91s",
  authDomain: "sportshopreact.firebaseapp.com",
  projectId: "sportshopreact",
  storageBucket: "sportshopreact.firebasestorage.app",
  messagingSenderId: "767624429712",
  appId: "1:767624429712:web:be212c797f259e68811815",
  measurementId: "G-PFRT9NFFRM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);