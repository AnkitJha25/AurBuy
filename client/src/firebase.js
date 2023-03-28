import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD7-43Fs15sGd8wS7CWRjbLFhA4IPut1XU",
  authDomain: "aurbuy-765b7.firebaseapp.com",
  projectId: "aurbuy-765b7",
  storageBucket: "aurbuy-765b7.appspot.com",
  messagingSenderId: "264011892359",
  appId: "1:264011892359:web:f0cb18aa7799b1edb55a22"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();