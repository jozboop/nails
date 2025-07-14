import { Link } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Navigation = () => {
  const { session, signOut } = UserAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold text-gray-900 hover:text-pink-500 transition-colors lowercase tracking-tight">
              nailscape
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              About
            </Link>
            {session ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 