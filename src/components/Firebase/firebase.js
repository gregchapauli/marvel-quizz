import firebase from "firebase/compat/app";

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
  }
}

export default Firebase;
