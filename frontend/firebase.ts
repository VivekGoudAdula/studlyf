
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD0KJj-3Cb8cw-BQK38MpC4ceAK93qPeJ0",
    authDomain: "studlyf-3baff.firebaseapp.com",
    projectId: "studlyf-3baff",
    storageBucket: "studlyf-3baff.firebasestorage.app",
    messagingSenderId: "137955871642",
    appId: "1:137955871642:web:5c935e3b3fd9562c708823"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');
githubProvider.addScope('repo');

export default app;
