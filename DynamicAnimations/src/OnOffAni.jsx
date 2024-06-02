import React, { useState } from 'react';
import Stars from './AnimationLogic/Stars.jsx';
import Rain from './AnimationLogic/Rain.jsx';
import Sand from './AnimationLogic/Sand.jsx';


function ParentComponent() {
  const [BoolStar, setBoolStar] = useState(false);
  const [BoolRain, setBoolRain] = useState(true);
  const [BoolSand, setBoolSand] = useState(false);
  return (
    <div>
      {BoolStar && <Stars />}
      {BoolRain && <Rain />}
      {BoolSand && <Sand />}
    </div>
  );
}

export default ParentComponent;
