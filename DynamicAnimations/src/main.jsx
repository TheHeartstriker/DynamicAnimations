import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Button from './Interface.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div>
    <App />
    <Button />
    </div>
  </React.StrictMode>,
)
