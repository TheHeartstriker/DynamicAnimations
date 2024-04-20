import React, { useState } from 'react';
import Stars from './Stars.jsx';

function ParentComponent() {
  const [isAppVisible, setIsAppVisible] = useState(true);

  return (
    <div>
      {isAppVisible && <Stars />}
    </div>
  );
}

export default ParentComponent;