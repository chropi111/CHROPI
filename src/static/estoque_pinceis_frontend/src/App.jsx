import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import MaterialUsage from './components/MaterialUsage'
import StockManagement from './components/StockManagement'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleLogin = (email) => {
    setIsAuthenticated(true)
    setUserEmail(email)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail('')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/usage" replace />} />
            <Route 
              path="/usage" 
              element={<MaterialUsage userEmail={userEmail} onLogout={handleLogout} />} 
            />
            <Route 
              path="/stock" 
              element={<StockManagement userEmail={userEmail} onLogout={handleLogout} />} 
            />
            <Route path="*" element={<Navigate to="/usage" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App

