import React, { useState } from 'react';
import Stars from './AnimationLogic/Stars.jsx';

function ParentComponent() {
  const [isAppVisible, setIsAppVisible] = useState(false);

  return (
    <div>
      {isAppVisible && <Stars />}
    </div>
  );
}

export default ParentComponent;