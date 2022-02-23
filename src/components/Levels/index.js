import React from "react";
import Stepper from "react-stepper-horizontal";

const Levels = () => {
  return (
    <div className="levelsContainer">
      <div>
        <Stepper
          steps={[
            { title: "Step One" },
            { title: "Step Two" },
            { title: "Step Three" },
            { title: "Step Four" },
          ]}
          activeStep={1}
        />
      </div>
    </div>
  );
};

export default Levels;
