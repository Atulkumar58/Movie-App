# Movie App - Application Flow Documentation

## 📋 Project Overview

Movie App is a full-stack web application that allows users to browse, search, and manage movies. It features user authentication, genre management, movie management, and an admin dashboard with real-time analytics.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│                   (Port: 5173 - Dev)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Redux Store (State Management)                       │  │
│  │  ├─ Auth State                                        │  │
│  │  ├─ Movies State                                      │  │
│  │  └─ API Queries                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│               Express.js Backend Server                      │
│                   (Port: 3000)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes: /api/v1                                      │  │
│  │  ├─ /users (authentication & user management)        │  │
│  │  ├─ /genre (genre CRUD operations)                   │  │
│  │  ├─ /movies (movie CRUD operations)                  │  │
│  │  └─ /upload (file upload handling)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                     │  │
│  │  ├─ Auth Middleware (JWT verification)               │  │
│  │  ├─ Async Handler (error handling)                   │  │
│  │  └─ CheckId (ID validation)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ Mongoose
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                           │
│  ├─ Users Collection                                        │
│  ├─ Genres Collection                                       │
│  └─ Movies Collection                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Hosted media URLs
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Cloudinary                               │
│  ├─ Movie poster/image storage                              │
│  └─ Hosted media delivery                                    │
└─────────────────────────────────────────────────────────────┘
```

Movie images are received by the Express upload workflow, transferred to
Cloudinary through the media utility, and referenced in MongoDB through their
hosted URLs. MongoDB stores application data, while Cloudinary handles hosted
media storage and delivery.

---

## UI Showcase

The application combines a polished movie-browsing experience with focused
admin tools for managing content, genres, and community reviews.

### User Experience

| Home and discovery | Genre-based browsing |
| --- | --- |
| [![Movie App home page](UI%20images/Home-page.png)](UI%20images/Home-page.png) | [![Genre-based movie selection](UI%20images/Genre-wise-selection.png)](UI%20images/Genre-wise-selection.png) |
| [Home page](UI%20images/Home-page.png) | [Genre-wise selection](UI%20images/Genre-wise-selection.png) |

| Filter and search | Movie reviews |
| --- | --- |
| [![Search movies using filters](UI%20images/Search-movies-based-on-filters.png)](UI%20images/Search-movies-based-on-filters.png) | [![Write a movie review](UI%20images/Review-writing.png)](UI%20images/Review-writing.png) |
| [Search movies based on filters](UI%20images/Search-movies-based-on-filters.png) | [Review writing](UI%20images/Review-writing.png) |

### Admin Workspace

| Dashboard | Create a movie |
| --- | --- |
| [![Admin dashboard](UI%20images/Admin-Dashboard.png)](UI%20images/Admin-Dashboard.png) | [![Create a movie](UI%20images/Admin-Create-movie.png)](UI%20images/Admin-Create-movie.png) |
| [Admin dashboard](UI%20images/Admin-Dashboard.png) | [Create movie](UI%20images/Admin-Create-movie.png) |

| Select a movie to update | Update movie details |
| --- | --- |
| [![Select a movie to update](UI%20images/Select-update-movie.png)](UI%20images/Select-update-movie.png) | [![Update movie details](UI%20images/Update-movie.png)](UI%20images/Update-movie.png) |
| [Select movie for update](UI%20images/Select-update-movie.png) | [Update movie](UI%20images/Update-movie.png) |

| Genre management | Review management |
| --- | --- |
| [![Manage movie genres](UI%20images/Manage-genre.png)](UI%20images/Manage-genre.png) | [![Manage movie reviews](UI%20images/Manage-review.png)](UI%20images/Manage-review.png) |
| [Manage genres](UI%20images/Manage-genre.png) | [Manage reviews](UI%20images/Manage-review.png) |

### Developer Details

[![Developer details](UI%20images/Developer-details.png)](UI%20images/Developer-details.png)

---

## 🔄 Application Flow

### 1. **User Authentication Flow**

```
User Opens App
    ↓
[NOT Authenticated]
    ↓
Redirected to Login/Register Page
    ↓
User enters credentials
    ↓
Frontend sends POST to /api/v1/users/login (or register)
    ↓
Backend validates credentials (bcryptjs for password hashing)
    ↓
Backend generates JWT Token via createToken utility
    ↓
Token stored in HTTP-only Cookie
    ↓
Redux authSlice updates with user data
    ↓
User redirected to Home Page
    ↓
PrivateRoute component protects pages requiring auth
```

**Key Files:**
- [Auth pages](frontend/src/pages/Auth/) - Login, Register, Navigation
- [PrivateRoute](frontend/src/pages/Auth/PrivateRoute.jsx) - Route protection
- [Auth API slice](frontend/src/redux/api/users.js) - Authentication endpoints
- [Auth slice](frontend/src/redux/features/auth/authSlice.js) - State management
- [Backend user routes](backend/routes/userRoutes.js) - User endpoints

---

### 2. **Movie Browsing Flow**

```
User Navigates to Movies Page
    ↓
Frontend dispatches getMovies API call
    ↓
Redux makes GET request to /api/v1/movies
    ↓
Backend movieController.getMovies()
    ↓
Fetches all movies from MongoDB
    ↓
Backend returns movies with: title, description, poster, year, rating, comments
    ↓
Redux moviesSlice updates with movie data
    ↓
React renders AllMovies component with movie cards
    ↓
User can:
  ├─ View all movies (AllMovies.jsx)
  ├─ Filter/Search movies
  ├─ Click movie card
  └─ View movie details (MovieDetails.jsx)
```

**Key Files:**
- [AllMovies page](frontend/src/pages/Movies/AllMovies.jsx)
- [MovieCard component](frontend/src/pages/Movies/MovieCard.jsx)
- [MovieDetails page](frontend/src/pages/Movies/MovieDetails.jsx)
- [Movies API slice](frontend/src/redux/api/movies.js)
- [Movies slice](frontend/src/redux/features/movies/moviesSlice.js)
- [Backend movies routes](backend/routes/moviesRoutes.js)

---

### 3. **Movie Details & Comments Flow**

```
User clicks on Movie Card
    ↓
Navigates to MovieDetails page with movieId
    ↓
Frontend fetches specific movie details
    ↓
Backend movieController.getMovieById(movieId)
    ↓
Returns movie with full details & comments
    ↓
Component renders:
  ├─ Movie poster & info
  ├─ Movie tabs (Details, Reviews, Recommendations)
  ├─ Existing comments
  └─ Comment input form (if authenticated)
    ↓
User can add/delete comments
    ↓
Frontend sends comment via /api/v1/movies/add-comment (POST)
    ↓
Backend updates movie document with new comment
    ↓
Comment appears in real-time (re-fetch movie)
```

**Key Files:**
- [MovieDetails page](frontend/src/pages/Movies/MovieDetails.jsx)
- [MovieTabs component](frontend/src/pages/Movies/MovieTabs.jsx)
- [Backend movie controller](backend/controllers/movieController.js)

---

### 4. **Admin Dashboard Flow**

```
Admin User Navigates to Dashboard
    ↓
AdminRoute component checks if user is admin
    ↓
Dashboard displays:
  ├─ Real-time statistics (PrimaryCard, SecondaryCard)
  ├─ Video/content cards (VideoCard)
  └─ Sidebar with admin options
    ↓
Admin can:
  ├─ Manage Movies
  │   ├─ Create Movie (CreateMovie.jsx)
  │   ├─ View All Movies (AdminMoviesList.jsx)
  │   └─ Update Movie (UpdateMovie.jsx)
  │
  ├─ Manage Genres (GenreList.jsx)
  │   └─ Create/Edit/Delete Genres
  │
  └─ View All Comments (AllComments.jsx)
        └─ Moderate/Delete comments
    ↓
Each action sends API request to backend
    ↓
Backend controller processes CRUD operations
    ↓
Updates MongoDB database
    ↓
Response sent back to frontend
    ↓
UI updates with new data
```

**Key Files:**
- [Admin Dashboard](frontend/src/pages/Admin/Dashboard/AdminDashboard.jsx)
- [AdminRoute protection](frontend/src/pages/Admin/AdminRoute.jsx)
- [Create/Update Movie](frontend/src/pages/Admin/CreateMovie.jsx)
- [Genre Management](frontend/src/pages/Admin/GenreList.jsx)
- [All Comments](frontend/src/pages/Admin/AllComments.jsx)

---

### 5. **File Upload Flow**

```
Admin uploads movie poster/image
    ↓
Frontend uses multer (file upload middleware)
    ↓
File sent to /api/v1/upload (POST with FormData)
    ↓
Backend uploadRoutes handles file
    ↓
    ├─ Multer receives and validates the uploaded image
    ↓
    Movie creation uploads the temporary file to Cloudinary
    ↓
    Backend stores the hosted Cloudinary URL in movie data
    ↓
    Temporary local file is removed after transfer
    ↓
    Image is displayed from Cloudinary in movie cards/details
```

**Key Files:**
- [Upload routes](backend/routes/uploadRoutes.js)
- [Static file serving](backend/index.js) - line with `/uploads`

---

### 6. **Redux Store Flow**

```
User Action (click, form submit, etc.)
    ↓
Component dispatches Redux action
    ↓
API Slice (RTK Query)
    ├─ Makes HTTP request to backend
    ├─ Handles loading/error states
    └─ Returns response
    ↓
Feature Slice receives action result
    ├─ Updates state (auth, movies, etc.)
    └─ Returns new state
    ↓
Component re-renders with new state
    ↓
UI updates
```

**Key Files:**
- [API Slice (RTK Query setup)](frontend/src/redux/api/apiSlice.js)
- [Movies API](frontend/src/redux/api/movies.js)
- [Users API](frontend/src/redux/api/users.js)
- [Genre API](frontend/src/redux/api/genre.js)
- [Redux Store](frontend/src/redux/store.js)

---

## 📁 Project Structure

### Backend Structure
```
backend/
├── index.js                 # Server entry point, app initialization
├── config/
│   └── db.js               # MongoDB connection configuration
├── controllers/
│   ├── userController.js    # User registration, login, profile
│   ├── movieController.js   # Movie CRUD, comments, ratings
│   └── genreController.js   # Genre CRUD operations
├── models/
│   ├── User.js              # User schema
│   ├── Movie.js             # Movie schema with comments, ratings
│   └── Genre.js             # Genre schema
├── routes/
│   ├── userRoutes.js        # /api/v1/users endpoints
│   ├── moviesRoutes.js      # /api/v1/movies endpoints
│   ├── genreRoutes.js       # /api/v1/genre endpoints
│   └── uploadRoutes.js      # /api/v1/upload endpoints
├── middlewares/
│   ├── authMiddleware.js    # JWT verification
│   ├── asyncHandler.js      # Error handling wrapper
│   └── checkId.js           # MongoDB ObjectId validation
├── utils/
│   ├── createToken.js        # JWT token generation
│   └── cloudinary.js         # Cloudinary media upload utility
└── uploads/                 # Directory for uploaded files
```

### Frontend Structure
```
frontend/src/
├── App.jsx                  # Main app component
├── main.jsx                 # React DOM entry
├── index.css                # Global styles
├── redux/
│   ├── store.js             # Redux store configuration
│   ├── constants.js         # Redux constants
│   ├── api/
│   │   ├── apiSlice.js      # RTK Query base configuration
│   │   ├── movies.js        # Movie API endpoints
│   │   ├── users.js         # User API endpoints
│   │   └── genre.js         # Genre API endpoints
│   └── features/
│       ├── auth/
│       │   └── authSlice.js # Auth state management
│       └── movies/
│           └── moviesSlice.js # Movies state management
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx        # Login form
│   │   ├── Register.jsx     # Registration form
│   │   ├── Navigation.jsx   # Top navigation
│   │   └── PrivateRoute.jsx # Protected route wrapper
│   ├── Movies/
│   │   ├── AllMovies.jsx    # Movies listing
│   │   ├── MovieCard.jsx    # Individual movie card
│   │   ├── MovieDetails.jsx # Movie detail page
│   │   ├── MovieTabs.jsx    # Tab component
│   │   └── Header.jsx       # Page header
│   ├── Admin/
│   │   ├── AdminRoute.jsx   # Admin protected routes
│   │   ├── CreateMovie.jsx  # Create/Edit movie
│   │   ├── AdminMoviesList.jsx # Admin movie list
│   │   ├── GenreList.jsx    # Genre management
│   │   ├── AllComments.jsx  # Comment moderation
│   │   └── Dashboard/
│   │       ├── AdminDashboard.jsx # Main dashboard
│   │       ├── Sidebar/
│   │       │   └── Sidebar.jsx    # Admin sidebar
│   │       └── Main/
│   │           ├── Main.jsx       # Dashboard main area
│   │           ├── PrimaryCard.jsx # Stats card
│   │           ├── SecondaryCard.jsx # Secondary stats
│   │           ├── VideoCard.jsx  # Video stats card
│   │           └── RealTimeCard.jsx # Real-time data card
│   ├── User/
│   │   └── Profile.jsx      # User profile page
│   └── Home.jsx             # Home page
└── component/
    ├── Modal.jsx            # Modal component
    ├── Loader.jsx           # Loading spinner
    ├── GenreForm.jsx        # Genre form component
    └── SliderUtil.jsx       # Carousel component
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Media Storage**: Cloudinary
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK Query)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: React Icons, React Slick
- **Notifications**: React Toastify
- **PostCSS**: Autoprefixer

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create `.env` file in root (parent of backend):
   ```env
   MONGO_URI=mongodb://localhost:27017/movieapp
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   # or with nodemon for development:
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open browser at `http://localhost:5173`

---

## 📡 API Endpoints

### Users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile

### Movies
- `GET /api/v1/movies` - Get all movies
- `GET /api/v1/movies/:id` - Get movie by ID
- `POST /api/v1/movies` - Create movie (admin)
- `PUT /api/v1/movies/:id` - Update movie (admin)
- `DELETE /api/v1/movies/:id` - Delete movie (admin)
- `POST /api/v1/movies/add-comment` - Add comment

### Genres
- `GET /api/v1/genre` - Get all genres
- `POST /api/v1/genre` - Create genre (admin)
- `PUT /api/v1/genre/:id` - Update genre (admin)
- `DELETE /api/v1/genre/:id` - Delete genre (admin)

### Upload
- `POST /api/v1/upload` - Upload file (admin)

---

## 🔐 Authentication & Authorization

- **JWT**: Tokens stored in HTTP-only cookies
- **Password Security**: Passwords hashed with bcryptjs before storage
- **Route Protection**: PrivateRoute and AdminRoute components prevent unauthorized access
- **Token Verification**: authMiddleware verifies JWT on protected routes

---

## 🎯 User Journey Summary

1. **New User**: Register → Login → Browse Movies
2. **Authenticated User**: View movies → Add comments → View profile
3. **Admin User**: Access dashboard → Manage movies → Manage genres → Moderate comments

---

## 📝 Notes

- All HTTP requests include cookies for authentication
- Multer temporarily stores uploaded files before they are transferred to Cloudinary
- Redux RTK Query handles caching and request deduplication
- Tailwind CSS for responsive design
- Real-time features through component state management

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

