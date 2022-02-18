import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOw_cs0KHL3Mwq2e_o5zbtVwe01NNOIew",
  authDomain: "marvel-quizz-10c02.firebaseapp.com",
  projectId: "marvel-quizz-10c02",
  storageBucket: "marvel-quizz-10c02.appspot.com",
  messagingSenderId: "36627023156",
  appId: "1:36627023156:web:3d9112cce363246684d161",
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
