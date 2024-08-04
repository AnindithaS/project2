// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnb9gddVk7TRxySmRVhgxs8pbrR3Hytok",
  authDomain: "inventory-management-d71a1.firebaseapp.com",
  projectId: "inventory-management-d71a1",
  storageBucket: "inventory-management-d71a1.appspot.com",
  messagingSenderId: "985548504130",
  appId: "1:985548504130:web:9de500de3da5eeae6a41db",
  measurementId: "G-REB7010EEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{firestore}