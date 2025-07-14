import { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

const ArtistDashboard = () => {
  const { session } = UserAuth()
  const [artist, setArtist] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newPost, setNewPost] = useState({ image_url: '', caption: '' })
  const [uploading, setUploading] = useState(false)

  // Form state for editing profile
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    location: '',
    average_price: '',
    instagram_url: '',
    profile_image: ''
  })

  useEffect(() => {
    if (session) {
      fetchArtistData()
    }
  }, [session])

  const fetchArtistData = async () => {
    try {
      // Fetch artist profile
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (artistError && artistError.code !== 'PGRST116') {
        console.error('Error fetching artist:', artistError)
        return
      }

      if (artistData) {
        setArtist(artistData)
        setProfileForm({
          name: artistData.name || '',
          bio: artistData.bio || '',
          location: artistData.location || '',
          average_price: artistData.average_price || '',
          instagram_url: artistData.instagram_url || '',
          profile_image: artistData.profile_image || ''
        })
      }

      // Fetch artist's posts
      if (artistData) {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('artist_id', artistData.id)
          .order('created_at', { ascending: false })

        if (postsError) {
          console.error('Error fetching posts:', postsError)
        } else {
          setPosts(postsData || [])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      if (artist) {
        // Update existing artist
        const { error } = await supabase
          .from('artists')
          .update({
            name: profileForm.name,
            bio: profileForm.bio,
            location: profileForm.location,
            average_price: profileForm.average_price ? parseFloat(profileForm.average_price) : null,
            instagram_url: profileForm.instagram_url,
            profile_image: profileForm.profile_image
          })
          .eq('id', artist.id)

        if (error) {
          console.error('Error updating profile:', error)
          return
        }
      } else {
        // Create new artist
        const { data, error } = await supabase
          .from('artists')
          .insert({
            user_id: session.user.id,
            name: profileForm.name,
            bio: profileForm.bio,
            location: profileForm.location,
            average_price: profileForm.average_price ? parseFloat(profileForm.average_price) : null,
            instagram_url: profileForm.instagram_url,
            profile_image: profileForm.profile_image
          })
          .select()
          .single()

        if (error) {
          console.error('Error creating profile:', error)
          return
        }

        setArtist(data)
      }

      setEditing(false)
      fetchArtistData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleNewPost = async (e) => {
    e.preventDefault()
    if (!artist || !newPost.image_url.trim()) return

    setUploading(true)

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          artist_id: artist.id,
          image_url: newPost.image_url,
          caption: newPost.caption
        })

      if (error) {
        console.error('Error creating post:', error)
        return
      }

      setNewPost({ image_url: '', caption: '' })
      fetchArtistData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        console.error('Error deleting post:', error)
        return
      }

      fetchArtistData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto"></div>
          <p className="mt-4 text-gray-500 text-xs">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Artist Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium text-sm"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Average Price ($)</label>
                <input
                  type="number"
                  value={profileForm.average_price}
                  onChange={(e) => setProfileForm({ ...profileForm, average_price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={profileForm.instagram_url}
                onChange={(e) => setProfileForm({ ...profileForm, instagram_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profile Image URL</label>
              <input
                type="url"
                value={profileForm.profile_image}
                onChange={(e) => setProfileForm({ ...profileForm, profile_image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 font-medium text-sm"
              >
                {uploading ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50">
                {artist?.profile_image ? (
                  <img
                    src={artist.profile_image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                    <div className="text-3xl text-gray-300">💅</div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {artist?.name || 'No name set'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {artist?.location || 'No location set'}
                </p>
                {artist?.average_price && (
                  <p className="text-gray-600 text-sm">
                    Starting at ${artist.average_price}
                  </p>
                )}
              </div>
            </div>
            
            {artist?.bio && (
              <p className="text-gray-700 text-sm leading-relaxed">
                {artist.bio}
              </p>
            )}
            
            {artist?.instagram_url && (
              <a
                href={artist.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-pink-500 hover:text-pink-600 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                View Instagram
              </a>
            )}
          </div>
        )}
      </div>

      {/* New Post Section */}
      {artist && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Post</h2>
          
          <form onSubmit={handleNewPost} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                type="url"
                value={newPost.image_url}
                onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Caption</label>
              <textarea
                value={newPost.caption}
                onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 text-sm"
                placeholder="Describe your nail art..."
              />
            </div>
            
            <button
              type="submit"
              disabled={uploading || !newPost.image_url.trim()}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 font-medium text-sm"
            >
              {uploading ? 'Posting...' : 'Post Nail Art'}
            </button>
          </form>
        </div>
      )}

      {/* Posts Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Posts ({posts.length})</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6 text-gray-300">💅</div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 text-sm">
              Start sharing your nail art to build your portfolio!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.caption || 'Nail art'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                      <div className="text-4xl text-gray-300">💅</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {post.caption && (
                    <p className="text-gray-700 text-xs mb-3 leading-relaxed">
                      {post.caption}
                    </p>
                  )}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistDashboard 