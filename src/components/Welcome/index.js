import React, { useState, Fragment, useContext, useEffect } from "react";
import Logout from "../Logout";
import Quiz from "../Quiz";
import { FirebaseContext } from "../Firebase";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const firebase = useContext(FirebaseContext);

  const [userSession, setUserSession] = useState(null);

  const history = useNavigate();

  //SECURISATION D'ACCES A LA PAGE WELCOME AUX UTILISATEURS AUTHENTIFIES
  useEffect(() => {
    let listener = firebase.auth.onAuthStateChanged((user) => {
      user ? setUserSession(user) : history("/");
    });
    return () => {
      listener();
    };
  }, [firebase.auth, history]);

  return userSession === null ? (
    <Fragment>
      <div className="loader"></div>
      <p className="loaderText">Loading...</p>
    </Fragment>
  ) : (
    <div className="quiz-bg">
      <div className="container">
        <Logout />
        <Quiz />
      </div>
    </div>
  );
};

export default Welcome;
