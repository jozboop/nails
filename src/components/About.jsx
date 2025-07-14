import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">about nailscape</h1>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          nailscape connects home-based nail artists with clients who value creativity and style. 
          Explore portfolios, get inspired, and find your next favorite artist! 
        </p>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          -josie 
        </p>
      </div>

    

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">for artists</h3>
          <ul className="text-gray-500 space-y-1 list-disc list-inside text-sm">
            <li>Showcase your portfolio</li>
            <li>Connect with new clients</li>
            <li>Build your personal brand</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">for clients</h3>
          <ul className="text-gray-500 space-y-1 list-disc list-inside text-sm">
            <li>Find design inspiration</li>
            <li>Explore styles and pricing</li>
            <li>Discover artists near you</li>
          </ul>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Community</h2>
        <p className="text-gray-500 leading-relaxed mb-4 text-sm">
          nailscape is a space for connection and creativity. Our community includes artists and 
          enthusiasts who celebrate individuality and self-expression through nail design.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/signup" 
            className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium text-center text-sm hover:bg-pink-600 transition-colors"
          >
            Join as Artist
          </Link>
          <Link 
            to="/" 
            className="border border-pink-500 text-pink-500 px-4 py-2 rounded-lg font-medium text-center text-sm hover:bg-pink-50 transition-colors"
          >
            Browse Artists
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;