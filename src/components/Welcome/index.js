import React, { useState, Fragment, useContext, useEffect } from "react";
import Logout from "../Logout";
import Quiz from "../Quiz";
import { FirebaseContext } from "../Firebase";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const firebase = useContext(FirebaseContext);

  const [userSession, setUserSession] = useState(null);
  const [userData, setUserData] = useState({});

  const history = useNavigate();

  //SECURISATION D'ACCES A LA PAGE WELCOME AUX UTILISATEURS AUTHENTIFIES
  useEffect(() => {
    let listener = firebase.auth.onAuthStateChanged((user) => {
      user ? setUserSession(user) : history("/");
    });

    //RECUPERATION DE L'ID POUR AFFICHER LE PSEUDO DE L'UTILISATEUR
    if (!!userSession) {
      firebase
        .user(userSession.uid)
        .get()
        .then((doc) => {
          if (doc && doc.exists) {
            const myData = doc.data();
            setUserData(myData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return () => {
      listener();
    };
  }, [firebase, history, userSession]);

  return userSession === null ? (
    <Fragment>
      <div className="loader"></div>
      <p className="loaderText">Loading...</p>
    </Fragment>
  ) : (
    <div className="quiz-bg">
      <div className="container">
        <Logout />
        <Quiz userData={userData} />
      </div>
    </div>
  );
};

export default Welcome;
