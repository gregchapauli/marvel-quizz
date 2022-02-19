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
  };

  loadQuestions = (level) => {
    const fetchedArrayQuiz = QuizMarvel[0].quizz[level];
    console.log(fetchedArrayQuiz);
    if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.storedQuestions !== prevState.storedQuestions) {
      this.setState({
        question: this.state.storedQuestions[this.state.idQuestion].question,
        options: this.state.storedQuestions[this.state.idQuestion].options,
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
        <button disabled={this.state.btnDisable} className="btnSubmit">
          Suivant
        </button>
      </div>
    );
  }
}

export default Quiz;
