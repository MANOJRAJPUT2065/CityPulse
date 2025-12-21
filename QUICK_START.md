# 🚀 CityPulse - Quick Reference Card

## ⚡ Start Project (Pick One Method)

### Method 1: Windows - Double Click

```
📁 START.bat  (Just double-click it!)
```

### Method 2: Windows - Terminal

```powershell
cd backend
npm run dev
# New Terminal:
cd frontend
npm run dev
```

### Method 3: Mac/Linux

```bash
chmod +x start.sh
./start.sh
```

---

## 🌐 URLs

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| MongoDB  | Configured in `.env`  |

---

## 📁 Important Files

| File             | Purpose               |
| ---------------- | --------------------- |
| `backend/.env`   | DB & API secrets      |
| `frontend/.env`  | Frontend config       |
| `START.bat`      | Windows quick start   |
| `start.sh`       | Mac/Linux quick start |
| `SETUP_GUIDE.md` | Detailed setup        |
| `README.md`      | Project overview      |

---

## 🔑 Environment Variables

### Backend (.env)

```env
MONGO_URI=<your-mongodb-uri>
PORT=5000
JWT_SECRET=<secure-key>
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📍 Key Routes

### Public

- `GET /` - Home page
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### User (Protected)

- `GET /api/post` - Get posts
- `POST /api/post` - Create post
- `GET /api/bookmarks` - My bookmarks
- `GET /api/notifications` - My notifications

### Admin (Protected)

- `GET /api/admin` - All posts
- `PUT /api/admin/posts/:id` - Update status
- `GET /api/admin/export.csv` - Export data

---

## 🛠️ Troubleshooting

| Problem            | Fix                              |
| ------------------ | -------------------------------- |
| Port in use        | `npx kill-port 3000`             |
| Dependencies fail  | `npm install --legacy-peer-deps` |
| MongoDB error      | Check Atlas whitelist            |
| Image upload fails | Verify `uploads/` folder exists  |

---

## 📦 Tech Stack

**Frontend**: React + Vite + Tailwind + ShadCN  
**Backend**: Node + Express + MongoDB  
**Auth**: JWT + Bcrypt  
**Hosting**: Vercel (frontend), Render (backend)

---

## 🚀 Deploy

1. **Backend** → [render.com](https://render.com)
2. **Frontend** → [vercel.com](https://vercel.com)
3. Set environment variables
4. Done! ✅

---

## 📚 Full Docs

- [README.md](./README.md) - Overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed guide
- [PROJECT_COMPLETION.md](./PROJECT_COMPLETION.md) - Completion report

---

## ✅ Status

**Everything is FIXED and READY!**

- All dependencies installed ✅
- All routes configured ✅
- All pages created ✅
- Database connected ✅
- Documentation complete ✅

**Just run START.bat or ./start.sh and go!** 🎉
