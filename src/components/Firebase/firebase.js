import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
  }
  //INSCRIPTION
  signupUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  //CONNEXION
  loginUser = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  //DECONNEXION
  signoutUser = () => this.auth.signOut();

  //RECUPERATION DU MOT DE PASSE
  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  //CONNEXION A LA BDD FIRESTORE
  user = (uid) => this.db.doc(`users/${uid}`);
}

export default Firebase;
