import React, { useRef } from 'react';

function Buttons() {
  const pageContainerRef = useRef(null);

  const handleButtonClick = () => {
    if (pageContainerRef.current) {
      pageContainerRef.current.style.setProperty('--start', '0%');
      pageContainerRef.current.style.setProperty('--end', '100%');
      console.log("Button Clicked")
    }
  };

  return (
    <>
      <div id="Settings">
        <button onClick={handleButtonClick}>+</button>
      </div>
      <div className="PageContainer" ref={pageContainerRef} style={{ '--start': '100%', '--end': '0%' }}>
        <div className="Buttons">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
        </div>
      </div>
    </>
  );
}

export default Buttons;