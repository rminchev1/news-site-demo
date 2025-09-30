# News Site Demo with Authentication

A full-stack news website built with React frontend and Node.js backend, featuring user authentication, article management, and paywall integration with Poool.

## Features

### Frontend (React)
- 📰 News article browsing and reading
- 🔐 User authentication (login/register)
- ❤️ Favorite articles functionality
- 👤 User profile and settings management
- 🎨 Responsive design
- 🔒 Paywall integration with Poool

### Backend (Node.js/Express)
- 🔑 JWT-based authentication
- 📊 MongoDB database with Mongoose
- 🛡️ Security middleware (helmet, cors, validation)
- 📝 User profile management
- ⭐ Favorites system
- 🔒 Protected routes and middleware

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios for API calls
- Poool React Access for paywall
- CSS3 with responsive design

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation
- helmet & cors for security

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd news-site-demo
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   This will install both frontend and backend dependencies.

3. **Set up environment variables:**
   
   **Frontend (.env):**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   
   **Backend (backend/.env):**
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/news-site-demo
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

### Development

**Run both frontend and backend concurrently:**
```bash
npm run dev
```

**Or run them separately:**

Frontend only (runs on http://localhost:3000):
```bash
npm start
```

Backend only (runs on http://localhost:5000):
```bash
npm run dev:backend
```

### Building for Production

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/preferences` - Update user preferences (protected)
- `GET /api/users/favorites` - Get favorite articles (protected)
- `POST /api/users/favorites/:articleId` - Add article to favorites (protected)
- `DELETE /api/users/favorites/:articleId` - Remove from favorites (protected)

## Frontend Routes

- `/` - Home page with article list
- `/article/:id` - Individual article page
- `/login` - User login page
- `/register` - User registration page
- `/profile` - User profile and settings
- `/favorites` - User's favorite articles

## Authentication Flow

1. **Registration/Login:** User creates account or signs in
2. **JWT Token:** Backend returns JWT token on successful auth
3. **Token Storage:** Frontend stores token in localStorage
4. **Authenticated Requests:** Token included in Authorization header
5. **Protected Routes:** Backend middleware validates token
6. **Auto-logout:** Invalid/expired tokens trigger automatic logout

## Features in Detail

### User Authentication
- Secure password hashing with bcrypt
- JWT-based stateless authentication
- Input validation and sanitization
- Rate limiting for auth endpoints
- Automatic token verification on app load

### Article Management
- Article browsing and reading
- Favorite/unfavorite functionality
- Integration with existing Poool paywall system
- Responsive article cards and detail views

### User Profile
- Edit personal information
- Manage notification preferences
- View and manage favorite articles
- Account settings and preferences

## Security Features

- Password strength requirements
- JWT token validation
- Input sanitization
- CORS configuration
- Helmet for security headers
- Rate limiting
- Protected routes
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the GitHub repository.