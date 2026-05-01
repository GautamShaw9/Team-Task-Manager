🚀 Team Task Manager

A full-stack team collaboration and task management web application where admins can create projects and assign tasks to members.

---

📌 Features

- 🔐 User Authentication (Admin & Member roles)
- 📁 Project Creation (Admin only)
- ✅ Task Assignment to team members
- 📊 Task Status Tracking (Pending / Done)
- 👤 Personalized Dashboard (Admin & Member views)
- 🔄 Real-time updates from backend API

---

🛠️ Tech Stack

Frontend

- React.js
- CSS (Custom UI)
- Fetch API

Backend

- Node.js
- Express.js
- MongoDB (Mongoose)

Deployment

- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

---

⚙️ Environment Variables

Frontend (.env)

REACT_APP_API_URL=https://your-backend-url.up.railway.app

Backend (.env)

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

---

📂 Project Structure

team-task-manager/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│
└── README.md

---

🚀 How to Run Locally

1️⃣ Clone Repo

git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager

---

2️⃣ Backend Setup

cd backend
npm install
npm run dev

---

3️⃣ Frontend Setup

cd frontend
npm install
npm start

---

🌐 Live Demo

- 🔗 Frontend: https://your-frontend.vercel.app
- 🔗 Backend: https://your-backend.up.railway.app

---

📸 Screenshots

- Login / Signup
- Admin Dashboard
- Member Dashboard
- Task Assignment UI

---

⚠️ Common Issues

- ❌ "Failed to fetch" → Check API URL in frontend
- ❌ CORS error → Ensure backend allows requests
- ❌ MongoDB connection error → Check Atlas network access (0.0.0.0/0)

---

📈 Future Improvements

- 🔔 Notifications system
- 📅 Task deadlines & reminders
- 📊 Analytics dashboard
- 👥 Team invite system

---

👨‍💻 Author

- Gautam Shaw

---

📄 License

This project is for learning and assessment purposes.
