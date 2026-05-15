import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'          // fonts + tailwind + theme tokens
import './styles/auth.css'    // login + signup pages
import './styles/animations.css' // shimmer + generic animations
import './styles/editor.css'  // rich text editor + job description

createRoot(document.getElementById('root')).render(
  <App />
)