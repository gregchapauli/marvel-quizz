import React, { Component, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuizMarvel } from "../quizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizOver from "../QuizOver";
import { FaChevronRight } from "react-icons/fa";

const initialState = {
  quizLevel: 0,
  maxQuestions: 10,
  storedQuestions: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisable: true,
  userAnswer: null,
  score: 0,
  showWelcomeMsg: false,
  quizEnd: false,
  percent: null,
};

const levelNames = ["debutant", "confirme", "expert"];

// CE COMPOSANT EST UNE CLASS DANS UN BUT PEDAGOGIQUE
class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    //UTILISATION DU REF DANS UN BUT PEDAGOGIQUE POUR STOCKER DE LA DATA
    this.storedDataRef = React.createRef();
  }

  loadQuestions = (level) => {
    const fetchedArrayQuiz = QuizMarvel[0].quizz[level];
    if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
      //STOCKAGE DU TABLEAU DANS LE REF
      this.storedDataRef.current = fetchedArrayQuiz;

      // NOUVEAU TABLEAU SANS LES REPONSES POUR EVITER QU'ELLES SOIENT ACCESSIBLES DANS LA CONSOLE
      const newArray = fetchedArrayQuiz.map(
        ({ answer, ...keepRest }) => keepRest
      );
      this.setState({ storedQuestions: newArray });
    }
  };

  componentDidMount() {
    this.loadQuestions(levelNames[this.state.quizLevel]);
  }

  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) {
      this.setState({ quizEnd: true });
    } else {
      this.setState((prevState) => ({ idQuestion: prevState.idQuestion + 1 }));
    }
    //GESTION DU SCORE
    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({ score: prevState.score + 1 }));
      //NOTIFICATIONS
      toast.success("Bravo +1", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        bodyClassName: "toastify-color-welcome",
      });
    } else {
      toast.error("Raté 0", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        bodyClassName: "toastify-color-welcome",
      });
    }
  };

  submitAnswer = (selectedAnswer) => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisable: false,
    });
  };

  //NOTIFICATION DE BIENVENUE
  showToastMsg = (pseudo) => {
    if (!this.state.showWelcomeMsg) {
      this.setState({ showWelcomeMsg: true });

      toast.warn(`Bienvenue ${pseudo}, et bonne chance!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        bodyClassName: "toastify-color-welcome",
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { maxQuestions, storedQuestions, idQuestion, score, quizEnd } =
      this.state;

    if (
      storedQuestions !== prevState.storedQuestions &&
      storedQuestions.length
    ) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
      });
    }
    // MISE A JOUR DES QUESTIONS QUAND LE STATE A CHANGE
    if (idQuestion !== prevState.idQuestion && storedQuestions.length) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        userAnswer: null,
        btnDisable: true,
      });
    }

    if (quizEnd !== prevState.quizEnd) {
      const greatPercent = this.getPercentage(maxQuestions, score);
      this.gameOver(greatPercent);
    }

    if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
      this.showToastMsg(this.props.userData.pseudo);
    }
  }

  getPercentage = (maxQuest, ourScore) => {
    let result = (ourScore / maxQuest) * 100;
    return result;
  };

  gameOver = (percent) => {
    if (percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent,
      });
    } else {
      this.setState({ percent });
    }
  };

  loadLevelQuestions = (param) => {
    this.setState({ ...initialState, quizLevel: param });
    this.loadQuestions(levelNames[param]);
  };

  render() {
    const {
      quizLevel,
      maxQuestions,
      question,
      options,
      idQuestion,
      btnDisable,
      userAnswer,
      score,
      quizEnd,
      percent,
    } = this.state;

    //RECUPERATION DES QUESTIONS ET REPONSES DANS L'OBJET quizMarvel
    const displayOptions = options.map((option, index) => {
      return (
        <p
          key={index}
          className={`answerOptions ${
            userAnswer === option ? "selected" : null
          }`}
          onClick={() => {
            this.submitAnswer(option);
          }}
        >
          <FaChevronRight />
          {option}
        </p>
      );
    });

    return quizEnd ? (
      <QuizOver
        //PROPS A RENVOYER VERS LE COMPOSANT QuizOver
        ref={this.storedDataRef}
        levelNames={levelNames}
        score={score}
        maxQuestions={maxQuestions}
        quizLevel={quizLevel}
        percent={percent}
        loadLevelQuestions={this.loadLevelQuestions}
      />
    ) : (
      <Fragment>
        <ToastContainer />

        <Levels levelNames={levelNames} quizLevel={quizLevel} />
        <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />

        <h2>{question}</h2>

        {displayOptions}

        <button
          disabled={btnDisable}
          className="btnSubmit"
          onClick={this.nextQuestion}
        >
          {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}
        </button>
      </Fragment>
    );
  }
}

export default Quiz;
