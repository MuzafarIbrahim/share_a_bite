# Share a Bite Frontend

A React frontend application for a food sharing platform that helps reduce food waste by connecting community members.

## Features

- **User Authentication**: Login and registration with mock authentication
- **Food Sharing**: Create posts to share surplus food items
- **Browse & Claim**: Find and claim available food in your community
- **Dashboard**: Manage your posts, claims, and account
- **Admin Panel**: Administrative features for platform management
- **Responsive Design**: Mobile-friendly using Bootstrap 5

## Tech Stack

- **React 19** with JavaScript (ES6+)
- **Vite** for fast development and building
- **React Router** for navigation
- **Bootstrap 5** with react-bootstrap for styling
- **Axios** for API calls (currently mocked)
- **Context API** for state management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── Footer.jsx      # Footer component
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── Dashboard.jsx   # User dashboard
│   ├── CreatePost.jsx  # Create food posts
│   ├── BrowseFood.jsx  # Browse available food
│   ├── MyClaims.jsx    # User's claimed items
│   ├── MyPosts.jsx     # User's posted items
│   └── AdminDashboard.jsx # Admin panel
├── services/           # API service layers
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication services
│   └── foodService.js  # Food-related services
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication context
└── App.jsx             # Main app component with routing
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project folder
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Features Overview

### Authentication

- Mock login/logout functionality
- Protected routes for authenticated users
- Role-based access control (user/admin)

### Food Sharing

- Create detailed food posts with categories, quantities, and expiry dates
- Search and filter available food items
- Claim food items from other users
- Track posting and claiming history

### User Management

- Personal dashboard with activity overview
- Manage posted food items
- Track claimed items and their status

### Admin Features

- User management and statistics
- Platform monitoring and reporting
- Content moderation tools

## Current Implementation

This is a frontend-only implementation with mocked API calls. All data is currently:

- Stored in localStorage for authentication
- Mocked in service files for demonstration
- Ready to be connected to a real backend API

## Future Enhancements

- Connect to actual backend API
- Add real-time notifications
- Implement image upload for food posts
- Add geolocation features
- Integrate payment systems (if needed)
- Add rating and review system

## Contributing

1. Follow the existing code structure and naming conventions
2. Use Bootstrap components for consistent styling
3. Ensure all pages are responsive
4. Add proper error handling for API calls
5. Write clean, commented code
