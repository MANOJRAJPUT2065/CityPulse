# 🌆 CityPulse – Real-time Civic Issue Reporting Platform

CityPulse is a modern civic engagement platform that empowers citizens to report real-time urban issues and helps authorities take faster action.

In most cities, everyday problems like garbage overflow, broken roads, faulty streetlights, or stray animals often go unresolved due to lack of communication. CityPulse bridges the gap between citizens, government bodies, and NGOs through a digital platform.

---

## 🎯 Why I Built This

There are countless local problems in cities that go unreported or ignored. I wanted to create a platform where anyone can quickly post an issue, and the right authority can track and resolve it.  
Think of it like **Twitter – but for civic engagement.**

---

## 🔧 Tech Stack

### 💻 Frontend

- React + Vite
- Tailwind CSS
- React Router
- Framer Motion (Animations)
- Clerk (Google/Facebook login – optional)

### 🌐 Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT / Clerk tokens for auth

---

## 🧩 Key Features

- 👥 **User/Admin SignUp** – Choose role at signup
- 🖼️ **Post Issues** – Attach image, location, domain & description
- 🟡 **Status Flag** – Mark as Pending/Complete (admin only)
- 💬 **Comment Section** – Community discussions per post
- 🧠 **Domain Filters** – Water, Garbage, Road, Street, etc.
- 📱 **Responsive UI** – Works on desktop + mobile
- ✨ **Framer Motion** – Smooth animations for better UX

---

## 📸 Screenshots

### 👤 Admin Dashboard

<p align="center">
  <img src="frontend/assets/admin-dashboard.png" width="700" />
</p>

> 📂 Put this image in: `frontend/public/assets/admin-dashboard.png`

You can add more screenshots like:

- `citizen-view.png`
- `issue-form.png`
- `map-view.png`

---

## 📐 System Architecture

```text
+---------------+        +------------------+        +----------------+
|               |        |                  |        |                |
|   Citizen UI  +------->+     Backend      +------->+   MongoDB DB   |
| (React Front) |        |  (Express Server)|        | (Posts, Users) |
+-------+-------+        +--------+---------+        +--------+-------+
        |                         |                           ^
        |                         |                           |
        v                         v                           |
+----------------+     +-------------------+        +--------+--------+
| Clerk (Google/ |<--->|  Auth Middleware  |<-------+  Admin Dashboard |
| Facebook Auth) |     +-------------------+        |  (Post Status)   |
+----------------+                                    +----------------+
```

---

## 🗂️ Folder Structure

```
📁 Frontend
frontend/
├── components/        # Reusable UI parts (Navbar, Sidebar)
├── pages/             # Home, Login, Signup, AdminDashboard, etc.
├── App.jsx            # Main routing file
├── index.js           # React entry point

📁 Backend
backend/
├── models/            # Mongoose models (User, Post, Comment)
├── routes/            # Express routes
├── controllers/       # Route handlers
├── middleware/        # JWT check, Role check
├── server.js          # Server entry file
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/citypulse.git
cd citypulse
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_super_secret
```

### 4. Run the App

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## 🚀 Future Plans

- 🤖 AI-based issue detection from uploaded images
- 🗺️ Realtime map view of issues
- 🔔 Push notifications to users
- 🏆 Leaderboard/gamification for top users
- 📱 Mobile App (React Native or Flutter)

---

## 👨‍💻 Author

**Manoj Singh**  
USN: `1SI22CS102`  
Email: `smanojsingh073@gmail.com`

---

## 📢 Final Thoughts

CityPulse transforms complaints into actions and makes every citizen a collaborator in building a better city. Let’s report issues, solve them together, and build smarter, cleaner communities! 💪🌍

```

```
