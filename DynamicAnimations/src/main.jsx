import React from 'react'
import ReactDOM from 'react-dom/client'
import ParentComponent from './OnOffAni.jsx'
import Button from './Interface.jsx'
import Rain from './AnimationLogic/Rain.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div>
    <Rain />
    <ParentComponent />
    <Button />
    </div>
  </React.StrictMode>,
)
