// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl_Ex91I_w9_nHHUl96eEonmphq35YvDg",
  authDomain: "kinorat-aae9e.firebaseapp.com",
  projectId: "kinorat-aae9e",
  storageBucket: "kinorat-aae9e.appspot.com",
  messagingSenderId: "395993176930",
  appId: "1:395993176930:web:662e7c9643c763ab59ea3b",
  measurementId: "G-0Z6M3VLGBK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
