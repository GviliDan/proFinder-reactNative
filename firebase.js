import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, get, ref } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJY8VZ4-rlk_olFUaR9Yy5OoLW3KFtcEE",
    authDomain: "fir-auth-91242.firebaseapp.com",
    projectId: "fir-auth-91242",
    storageBucket: "fir-auth-91242.appspot.com",
    messagingSenderId: "1098717302913",
    appId: "1:1098717302913:web:6e812dda377bf68a6fbd80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const usersRef = ref(db, 'Users');


export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };
