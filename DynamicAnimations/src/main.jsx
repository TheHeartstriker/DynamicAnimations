import React from 'react'
import ReactDOM from 'react-dom/client'
import ParentComponent from './OnOffAni.jsx'
import Button from './Interface.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div>
    <ParentComponent />
    <Button />
    </div>
  </React.StrictMode>,
)
