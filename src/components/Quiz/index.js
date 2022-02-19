import React, { Component } from "react";
import { QuizMarvel } from "../quizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";

// CE COMPOSANT EST UNE CLASS DANS UN BUT PEDAGOGIQUE
class Quiz extends Component {
  state = {
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
  };

  //UTILISATION DU REF DANS UN BUT PEDAGOGIQUE POUR STOCKER DE LA DATA
  storedDataRef = React.createRef();

  loadQuestions = (level) => {
    const fetchedArrayQuiz = QuizMarvel[0].quizz[level];
    console.log(fetchedArrayQuiz);
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
      //END
    } else {
      this.setState((prevState) => ({
        idQuestion: prevState.idQuestion + 1,
      }));
    }
    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({
        score: this.prevState.score + 1,
      }));
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.storedQuestions !== prevState.storedQuestions) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
      });
    }

    // MISE A JOUR DES QUESTIONS QUAND LE STATE A CHANGE
    if (this.state.idQuestion !== prevState.idQuestion) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
        userAnswer: null,
        btnDisable: true,
      });
    }
  }

  submitAnswer = (selectedAnswer) => {
    this.setState({
      userAnswer: selectedAnswer,
      btnDisable: false,
    });
  };

  render() {
    //const { pseudo } = this.props.userData;

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

    return (
      <div>
        {/*<h2>Pseudo: {pseudo}</h2>*/}

        <Levels />
        <ProgressBar />

        <h2>{this.state.question}</h2>
        {displayOptions}
        <button
          disabled={this.state.btnDisable}
          className="btnSubmit"
          onClick={this.nextQuestion}
        >
          Suivant
        </button>
      </div>
    );
  }
}

export default Quiz;
