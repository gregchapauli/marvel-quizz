import React, { Component, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuizMarvel } from "../quizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizOver from "../QuizOver";

// CE COMPOSANT EST UNE CLASS DANS UN BUT PEDAGOGIQUE
class Quiz extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      levelNames: ["debutant", "confirme", "expert"],
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
      percent: 0,
    };

    this.state = this.initialState;

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
      this.setState({
        storedQuestions: newArray,
      });
    } else {
      console.log("Pas assez de questions!");
    }
  };

  componentDidMount() {
    this.loadQuestions(this.state.levelNames[this.state.quizLevel]);
  }

  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) {
      this.setState({
        quizEnd: true,
      });
    } else {
      this.setState((prevState) => ({
        idQuestion: prevState.idQuestion + 1,
      }));
    }
    //GESTION DU SCORE
    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));
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
      this.setState({
        showWelcomeMsg: true,
      });

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
    if (
      this.state.storedQuestions !== prevState.storedQuestions &&
      this.state.storedQuestions.length
    ) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
      });
    }
    // MISE A JOUR DES QUESTIONS QUAND LE STATE A CHANGE
    if (
      this.state.idQuestion !== prevState.idQuestion &&
      this.state.storedQuestions.length
    ) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
        userAnswer: null,
        btnDisable: true,
      });
    }

    if (this.state.quizEnd !== prevState.quizEnd) {
      const greatPercent = this.getPercentage(
        this.state.maxQuestions,
        this.state.score
      );
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
    this.setState({ ...this.initialState, quizLevel: param });
    this.loadQuestions(this.state.levelNames[param]);
  };

  render() {
    //RECUPERATION DES QUESTIONS ET REPONSES DANS L'OBJET quizMarvel
    const displayOptions = this.state.options.map((option, index) => {
      return (
        <p
          key={index}
          className={`answerOptions ${
            this.state.userAnswer === option ? "selected" : null
          }`}
          onClick={() => {
            this.submitAnswer(option);
          }}
        >
          {option}
        </p>
      );
    });

    return this.state.quizEnd ? (
      <QuizOver
        //PROPS A RENVOYER VERS LE COMPOSANT QuizOver
        ref={this.storedDataRef}
        levelNames={this.state.levelNames}
        score={this.state.score}
        maxQuestions={this.state.maxQuestions}
        quizLevel={this.state.quizLevel}
        percent={this.state.percent}
        loadLevelQuestions={this.loadLevelQuestions}
      />
    ) : (
      <Fragment>
        <ToastContainer />

        <Levels
          levelNames={this.state.levelNames}
          quizLevel={this.state.quizLevel}
        />
        <ProgressBar
          idQuestion={this.state.idQuestion}
          maxQuestions={this.state.maxQuestions}
        />

        <h2>{this.state.question}</h2>

        {displayOptions}

        <button
          disabled={this.state.btnDisable}
          className="btnSubmit"
          onClick={this.nextQuestion}
        >
          {this.state.idQuestion < this.state.maxQuestions - 1
            ? "Suivant"
            : "Terminer"}
        </button>
      </Fragment>
    );
  }
}

export default Quiz;
