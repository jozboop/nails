import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Home = () => {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      // Fetch artists with their most recent posts
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          posts (
            id,
            image_url,
            caption,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching artists:', error)
      } else {
        // Process the data to get the most recent posts for each artist
        const processedArtists = data?.map(artist => {
          const sortedPosts = artist.posts?.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          ) || []
          
          return {
            ...artist,
            recentPosts: sortedPosts.slice(0, 3) // Get up to 3 most recent posts
          }
        }) || []
        
        setArtists(processedArtists)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderImageGrid = (artist) => {
    const posts = artist.recentPosts || []
    const postCount = posts.length

    if (postCount === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="text-center">
            <div className="text-4xl mb-3 text-gray-300">💅</div>
            <p className="text-sm text-gray-400">No posts yet</p>
          </div>
        </div>
      )
    }

    if (postCount === 1) {
      return (
        <div className="w-full h-full overflow-hidden">
          <img
            src={posts[0].image_url}
            alt={posts[0].caption || `${artist.name}'s nail art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )
    }

    if (postCount === 2) {
      return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5">
          <div className="overflow-hidden">
            <img
              src={posts[0].image_url}
              alt={posts[0].caption || `${artist.name}'s nail art`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={posts[1].image_url}
              alt={posts[1].caption || `${artist.name}'s nail art`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      )
    }

    // 3 posts - original layout with thinner gaps
    return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
        {/* Main post takes up 3/4 of the space (top row) */}
        <div className="col-span-2 row-span-1 overflow-hidden">
          <img
            src={posts[0].image_url}
            alt={posts[0].caption || `${artist.name}'s nail art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Second post takes bottom left 1/4 */}
        <div className="col-span-1 row-span-1 overflow-hidden">
          <img
            src={posts[1].image_url}
            alt={posts[1].caption || `${artist.name}'s nail art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Third post takes bottom right 1/4 */}
        <div className="col-span-1 row-span-1 overflow-hidden">
          <img
            src={posts[2].image_url}
            alt={posts[2].caption || `${artist.name}'s nail art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading nail artists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
      </div>

      {artists.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-6 text-gray-300">💅</div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            No artists yet
          </h3>
          <p className="text-gray-500">
            Be the first to showcase your nail art!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.id}`}
              className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                {renderImageGrid(artist)}
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {artist.profile_image ? (
                      <img
                        src={artist.profile_image}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                        <div className="text-lg text-gray-400">💅</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-500 transition-colors truncate">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {artist.location}
                    </p>
                  </div>
                </div>
                
                {artist.recentPosts && artist.recentPosts[0]?.caption && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {artist.recentPosts[0].caption}
                  </p>
                )}
                
                {artist.average_price && (
                  <p className="text-sm text-gray-500 font-medium">
                    Starting at ${artist.average_price}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home 