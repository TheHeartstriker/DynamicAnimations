import React, { useState } from 'react';
import Stars from './AnimationLogic/Stars.jsx';
import Rain from './AnimationLogic/Rain.jsx';
import Sand from './AnimationLogic/Sand.jsx';

function ParentComponent() {
  const BoolStar = false;
  const BoolRain = true;
  const BoolSand = false;

  return (
    <div>
      {BoolStar && <Stars />}
      {BoolRain && <Rain />}
    </div>
  );
}

export default ParentComponent;