import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "AIzaSyD3Hu492z1eHClF9htTqRuoeZRxRo7qpnI",
    authDomain: "constraintless.firebaseapp.com",
    projectId: "constraintless",
    storageBucket: "constraintless.appspot.com",
    messagingSenderId: "789881921128",
    appId: "1:789881921128:web:c5ed3df7bc0fc82ae4e5dd",
    measurementId: "G-TF6NYNPLYV"
};
// Initialize Firebase

let app = firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.firestore(app);
export const storage = firebase.storage();
