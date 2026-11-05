# 🏫 MERN Record Portal

Admin portal to manage Students, Teachers & Staff records with amounts.

## 🚀 Features
- ✅ Secure Admin Login (JWT)
- ✅ Add / Edit / Delete Records
- ✅ Filter by Role: Student, Teacher, Staff
- ✅ Search by Name
- ✅ Total Amount Stats Dashboard
- ✅ Fully responsive UI
- ✅ Deployed on Vercel (Frontend + Backend)
- ✅ MongoDB Atlas (Free Cloud Database)

## 📁 Project Structure
```
mern-record-portal/
├── api/                    # Express Backend (Serverless)
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Logic handlers
│   ├── middleware/auth.js  # JWT protection
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── index.js            # Main Express app
├── client/                 # React + Vite Frontend
│   └── src/
│       ├── pages/          # Login, Dashboard
│       ├── components/     # Modals, ProtectedRoute
│       ├── context/        # Auth Context
│       └── api.js          # Axios API calls
├── vercel.json             # Vercel config
├── .env                    # Environment variables (DO NOT COMMIT)
└── package.json
```

## ⚙️ Local Setup

### 1. Clone & Install

```bash
# Root packages (backend)
npm install

# Frontend packages
cd client
npm install
cd ..
```

### 2. .env Setup
Edit `.env` file in root:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/record_portal
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3. Run Locally
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 🌐 Deploy on Vercel

See full guide in `DEPLOY_GUIDE.md`


## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Deploy | Vercel (Serverless) |

