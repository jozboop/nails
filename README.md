# NailArt - Nail Artist Social Media App

A Pinterest-like social media platform for nail artists to showcase their work and for clients to discover nail inspiration.

## Features

### For Everyone (Clients/Viewers)
- **Home Feed**: Browse through nail artist profiles in a Pinterest-like grid layout
- **Artist Profiles**: View individual artist pages with their nail art gallery, bio, location, pricing, and Instagram links
- **Responsive Design**: Beautiful, modern UI that works on all devices

### For Signed-in Users (Artists)
- **Artist Dashboard**: Complete profile management system
- **Profile Editor**: Update name, bio, location, average price, Instagram URL, and profile image
- **Post Management**: Add new nail art posts with images and captions
- **Portfolio Gallery**: View and manage all your posted nail art

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Routing**: React Router DOM
- **State Management**: React Context API

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd nail-app
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `database-schema.sql` into the editor
3. Run the SQL script to create the necessary tables and policies

### 4. Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs you need

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Schema

### Artists Table
- `id`: Unique identifier
- `user_id`: Links to Supabase auth user
- `name`: Artist's display name
- `bio`: Artist's bio/description
- `location`: Artist's location
- `average_price`: Starting price for services
- `instagram_url`: Instagram profile URL
- `profile_image`: Profile image URL
- `created_at`, `updated_at`: Timestamps

### Posts Table
- `id`: Unique identifier
- `artist_id`: Links to artist profile
- `image_url`: Nail art image URL
- `caption`: Post caption/description
- `created_at`, `updated_at`: Timestamps

## Security Features

- **Row Level Security (RLS)**: Ensures users can only modify their own data
- **Authentication**: Secure user authentication via Supabase Auth
- **Authorization**: Proper access controls for all database operations

## Usage

### For Artists
1. Sign up for an account
2. Sign in to access your dashboard
3. Create your artist profile with your details
4. Start posting nail art images with captions
5. Your profile will appear in the home feed for potential clients

### For Clients
1. Browse the home page to discover nail artists
2. Click on artist profiles to view their work
3. Check their location, pricing, and Instagram for more details
4. Contact artists directly through their Instagram links

## Customization

### Styling
The app uses Tailwind CSS for styling. You can customize the design by:
- Modifying the color scheme in `tailwind.config.js`
- Updating component styles in the individual component files
- Adding custom CSS in `src/index.css`

### Features
To add new features:
- Create new components in `src/components/`
- Add new routes in `src/App.jsx`
- Update the database schema if needed
- Add corresponding RLS policies for security

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports React apps:
- Netlify
- Railway
- Heroku
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own nail art business or portfolio!

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check that the database schema has been applied properly
