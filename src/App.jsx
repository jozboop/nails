import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserAuth } from './context/AuthContext'
import Home from './components/Home'
import ArtistProfile from './components/ArtistProfile'
import ArtistDashboard from './components/ArtistDashboard'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Navigation from './components/Navigation'

function App() {
  const { session } = UserAuth()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          {session && (
            <Route path="/dashboard" element={<ArtistDashboard />} />
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App
