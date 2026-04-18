# Task Management System (MERN)

A full-stack task management app with authentication and role-based access.

## 🚀 Features
- JWT Authentication (Login/Register)
- Role-based access (Admin / Employee)
- Admin:
  - Create tasks
  - View all tasks
  - Assign tasks via dropdown
- Employee:
  - View assigned tasks
  - Mark tasks as completed

## 🛠 Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JSON Web Tokens (JWT)

## 📂 Project Structure
backend/
frontend/


## ⚙️ Run Locally

### Backend
cd backend
npm install
npm start

###Frontend
cd frontend
npm install
npm start

🔐 Environment Variables

Create a .env in backend:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret

---
