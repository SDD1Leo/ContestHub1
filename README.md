🧠 ContestHub

ContestHub is a full-stack web application that curates upcoming competitive programming contests from platforms like Codeforces, LeetCode, CodeChef, and more. It allows users to bookmark contests, receive reminders via email or browser notifications, track ratings, and manage a friends list — all in one personalized dashboard.


🌐 Live Site

https://contesthub1.vercel.app


📦 Setup Instructions
1. Clone the Repository

       git clone https://github.com/SDD1Leo/contesthub1.git
        cd contesthub

2. Install Dependencies

For both frontend/ and backend/ folders:

    npm install

3. Environment Variables

✅ Backend .env (create inside backend/):

    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    MAIL_USER=your_email@example.com
    MAIL_PASS=your_email_password_or_app_password

✅ Frontend .env (create inside frontend/):

    VITE_APP_URI_API=https://your-backend-api-url.com

4. Run Development Servers

In separate terminals for frontend and backend:

# Inside /backend
    npm run dev

# Inside /frontend
    npm run dev


🚀 Features

    📅 Dashboard of  Contests (with platform filtering and search)
    🔖 Bookmark Contests
    🕑 Email & Browser Notifications
    📈 Rating Sync from Codeforces and LeetCode
    👥 Friends Section to view peers' handles and ratings
    🔐 Authentication (Register/Login)

⚙️ Tech Stack

Frontend:

    React.js
    Tailwind CSS
    Fetch API

Backend:

    Node.js + Express
    MongoDB + Mongoose
    Node-schedule (for reminders)
    Nodemailer (for emails)

Tools & Deployment:

    Render (Backend Deployment)
    Vercel (Frontend Deployment)
    cron-job.org (for scheduled tasks)


✅ To-Do / Improvements

    Add platform-wide contest analytics
    Deploy backend with auto-scaling (Kubernetes)
    Add CI/CD using GitHub Actions
    User notification preferences

👨‍💻 Author

Made with ❤️ by Swaroopdarshan Dash
📧 Email: swaroopdash05@gmail.com
