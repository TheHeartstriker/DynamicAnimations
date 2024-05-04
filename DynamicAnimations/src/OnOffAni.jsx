import React, { useState } from 'react';
import Stars from './AnimationLogic/Stars.jsx';
import Rain from './AnimationLogic/Rain.jsx';
import Sand from './AnimationLogic/Sand.jsx';

function ParentComponent() {
  const BoolStar = false;
  const BoolRain = false;
  const BoolSand = true;

  return (
    <div>
      {BoolStar && <Stars />}
      {BoolRain && <Rain />}
      {BoolSand && <Sand />}
    </div>
  );
}

export default ParentComponent;