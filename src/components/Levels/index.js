import React, { useEffect, useState } from "react";
import Stepper from "react-stepper-horizontal";

const Levels = ({ levelNames, quizLevel }) => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const quizSteps = levelNames.map((level) => ({
      title: level.toUpperCase(),
    }));
    setLevels(quizSteps);
  }, [levelNames]);

  return (
    <div className="levelsContainer">
      <Stepper steps={levels} activeStep={quizLevel} />
    </div>
  );
};

export default React.memo(Levels);
