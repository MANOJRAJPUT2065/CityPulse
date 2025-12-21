# 🌆 CityPulse – Real-time Civic Issue Reporting Platform

**Status**: ✅ **PRODUCTION READY** | Last Updated: December 21, 2025

CityPulse is a modern civic engagement platform that empowers citizens to report real-time urban issues and helps authorities take faster action. Think of it like **Twitter – but for civic engagement.**

---

## 📖 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB** Atlas account ([Create free](https://www.mongodb.com/cloud/atlas))

### Run Locally (Windows)

```bash
# Double-click START.bat
# Or run manually:
cd backend && npm install && npm run dev     # Terminal 1
cd frontend && npm install --legacy-peer-deps && npm run dev  # Terminal 2
```

### Run Locally (Mac/Linux)

```bash
chmod +x start.sh
./start.sh
```

### Run Manually

```bash
# Backend (http://localhost:5000)
cd backend
npm install
npm run dev

# Frontend (http://localhost:3000) - New Terminal
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## ✨ Features

### 👤 User Features

- ✅ **Email/Password Authentication** – Secure signup & login
- ✅ **Google OAuth** – One-click login with Google
- ✅ **Post Issues** – Create civic issues with images & location
- ✅ **Filter by Domain** – Water, Garbage, Road, Street, Animals, Recycling, Others
- ✅ **Search Posts** – Find issues by location or keywords
- ✅ **Bookmark Posts** – Save important issues
- ✅ **Get Notifications** – Stay updated on issue status
- ✅ **Comment & Discuss** – Community engagement

### 👮 Admin Features

- ✅ **Admin Dashboard** – View all reported issues
- ✅ **Update Status** – Mark issues as Pending/Complete
- ✅ **Export Data** – Download posts as CSV
- ✅ **Filter & Search** – Advanced post filtering
- ✅ **Analytics** – Track issue reports by domain

### 🎨 UI/UX

- ✅ **Dark/Light Mode** – Theme switcher
- ✅ **Responsive Design** – Mobile-first approach
- ✅ **Smooth Animations** – Framer Motion effects
- ✅ **Toast Notifications** – User feedback with Sonner
- ✅ **Accessibility** – WCAG compliant

---

## 🔧 Tech Stack

### 🎨 Frontend

```
React 18        - UI library
Vite            - Build tool
Tailwind CSS    - Styling
ShadCN UI       - Component library
React Router v6 - Navigation
Framer Motion   - Animations
Sonner          - Toast notifications
Hook Form       - Form management
```

### 🌐 Backend

```
Node.js         - Runtime
Express.js      - Web framework
MongoDB         - Database
Mongoose        - ODM
JWT             - Authentication
Bcrypt          - Password hashing
Multer          - File uploads
CORS            - Cross-origin requests
```

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/CityPulse.git
cd CityPulse
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### 4. Setup Environment Variables

See [Environment Variables](#-environment-variables) section below.

### 5. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📂 Project Structure

```
CityPulse/
├── 📁 backend/
│   ├── controllers/
│   │   └── authController.js       # Auth logic (signup, login, OAuth)
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── requireAdmin.js         # Admin role check
│   │   └── upload.js               # Multer image upload config
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Post.js / postModel.js  # Issue/Post schema
│   │   ├── Bookmark.js             # Bookmark schema
│   │   └── Notification.js         # Notification schema
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── postRoutes.js           # /api/post
│   │   ├── adminRoutes.js          # /api/admin
│   │   ├── bookmarkRoutes.js       # /api/bookmarks
│   │   └── notificationRoutes.js   # /api/notifications
│   ├── uploads/                    # User-uploaded images
│   ├── server.js                   # Express app setup
│   ├── package.json
│   └── .env
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ThemeSwitcher.jsx   # Dark/Light mode toggle
│   │   │   └── ui/                 # ShadCN UI components
│   │   ├── hooks/
│   │   │   └── use-toast.ts        # Toast hook
│   │   ├── lib/
│   │   │   ├── api.js              # API helper functions
│   │   │   ├── authFetch.js        # Auth wrapper for fetch
│   │   │   └── utils.js            # Utility functions
│   │   ├── pages/
│   │   │   ├── Index.jsx           # Home page
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx          # Signup page
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── AdminDashboard.jsx  # Admin panel
│   │   │   ├── Bookmarks.jsx       # Saved posts
│   │   │   ├── Notifications.jsx   # User notifications
│   │   │   ├── domains/            # Domain-specific pages
│   │   │   │   ├── Water.jsx
│   │   │   │   ├── Garbage.jsx
│   │   │   │   ├── Road.jsx
│   │   │   │   └── ...
│   │   ├── App.jsx                 # Main app with routes
│   │   ├── ProtectedRoute.jsx      # Role-based route protection
│   │   ├── RequireAuth.jsx         # Auth requirement wrapper
│   │   └── main.jsx
│   ├── public/
│   │   └── assets/                 # Images & static files
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
├── 📄 package.json                 # Root package.json (scripts)
├── 📄 SETUP_GUIDE.md               # Detailed setup guide
├── 📄 START.bat                    # Windows quick start
├── 📄 start.sh                     # Linux/Mac quick start
└── 📄 README.md                    # This file
```

---

## 🔌 API Documentation

### Base URL

- **Local**: `http://localhost:5000/api`
- **Production**: `https://citypulse-2.onrender.com/api`

### Authentication Routes (`/api/auth`)

#### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "userType": "user"          // or "admin"
}

Response: { token, user: { _id, name, email, userType } }
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: { token, user: { _id, name, email, userType } }
```

#### Google Sign-In

```http
POST /api/auth/google
Content-Type: application/json

{
  "googleToken": "<google-oauth-token>"
}

Response: { token, user }
```

### Post Routes (`/api/post`)

#### Get All Posts

```http
GET /api/post?domain=water&status=pending&q=main%20street&page=1&limit=10

Query Parameters:
  - domain: water|garbage|road|street|animals|recycling|others|all
  - status: pending|complete
  - q: search query
  - page: pagination page
  - limit: items per page (max 50)

Response: { posts: [], total, pages }
```

#### Create Post

```http
POST /api/post
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

{
  "content": "Huge pothole on Main Street",
  "location": "Main Street, Downtown District",
  "domain": "road",
  "image": <File>
}

Response: { _id, content, location, domain, image, createdAt, user }
```

#### Update Post

```http
PUT /api/post/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "content": "Updated description"
}
```

#### Delete Post

```http
DELETE /api/post/:id
Authorization: Bearer <jwt-token>

Response: { message: "Post deleted" }
```

### Admin Routes (`/api/admin`)

#### Get All Posts (Admin)

```http
GET /api/admin
Authorization: Bearer <jwt-token>  # Must be admin

Response: [{ _id, content, location, status, user, ... }]
```

#### Update Post Status

```http
PUT /api/admin/posts/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "complete"  // or "pending"
}
```

#### Export as CSV

```http
GET /api/admin/export.csv
Authorization: Bearer <jwt-token>

Response: CSV file download
```

### Bookmark Routes (`/api/bookmarks`)

#### Get User's Bookmarks

```http
GET /api/bookmarks
Authorization: Bearer <jwt-token>

Response: [{ postId, title, ... }]
```

#### Add Bookmark

```http
POST /api/bookmarks/:postId
Authorization: Bearer <jwt-token>

Response: { message: "Bookmarked" }
```

#### Remove Bookmark

```http
DELETE /api/bookmarks/:postId
Authorization: Bearer <jwt-token>
```

### Notification Routes (`/api/notifications`)

#### Get Notifications

```http
GET /api/notifications
Authorization: Bearer <jwt-token>

Response: [{ _id, message, postId, type, ... }]
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/citypulse?retryWrites=true&w=majority

# Server
PORT=5000

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_URL=https://citypulse-2.onrender.com/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Secret
SECRET=your_google_oauth_secret
```

---

## 🚀 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Visit [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<secure-key>
   PORT=5000
   ```
6. Deploy!

**Backend URL**: `https://your-service.onrender.com`

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import project → Select `frontend` folder
4. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=<your-client-id>
   ```
5. Deploy!

**Frontend URL**: `https://your-app.vercel.app`

---

## 🧪 Testing

### Using cURL/Postman

**Test Signup:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "userType": "user"
  }'
```

**Test Get Posts:**

```bash
curl http://localhost:5000/api/post
```

---

## 🐛 Troubleshooting

| Issue                         | Solution                                                      |
| ----------------------------- | ------------------------------------------------------------- |
| MongoDB connection error      | Check internet, verify Atlas IP whitelist (0.0.0.0/0 for dev) |
| Port 3000/5000 already in use | `npx kill-port 3000` or use different port                    |
| Dependency conflicts          | Use `npm install --legacy-peer-deps`                          |
| Frontend won't load           | Check `VITE_API_BASE_URL` in `.env`                           |
| Image uploads not working     | Verify `uploads/` folder exists in backend                    |

---

## 📝 Scripts

### Root Directory

```json
{
  "dev": "npm run backend:dev & npm run frontend:dev",
  "backend:dev": "cd backend && npm run dev",
  "frontend:dev": "cd frontend && npm run dev",
  "backend:install": "cd backend && npm install",
  "frontend:install": "cd frontend && npm install --legacy-peer-deps",
  "build": "npm run backend:build && npm run frontend:build"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Manoj Singh**

- GitHub: [@yourname](https://github.com/yourname)
- Email: manoj@example.com

---

## 🙏 Acknowledgments

- React & Vite communities
- ShadCN UI for beautiful components
- MongoDB Atlas for database hosting
- Render.com & Vercel for deployment

---

## 📞 Support

For issues and questions:

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Open an [GitHub Issue](https://github.com/yourname/CityPulse/issues)
3. Email: support@citypulse.com

---

**Last Updated**: December 21, 2025 ✅
**Status**: Production Ready 🚀
