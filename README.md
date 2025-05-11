# 🏠 RentMate – Household Chores & Expense Settler

RentMate is a simulation platform for managing shared household expenses and chores. It simplifies roommate life by allowing users to track expenses, split bills, manage balances, and settle up efficiently.

---

## 🚀 Features

- 👥 Invite roommates via email with unique invite codes  
- 💸 Log shared expenses with customizable splits (equal or custom percentages)  
- 📊 Dashboard with balance summaries and pie chart visualizations  
- 🔄 Real-time balance calculation and minimal transaction suggestions for “Settle Up”  
- ✅ Authentication & protected routes (JWT)  
- 📬 Email notifications for invites  
- 🗓️ Combined chores & expenses calendar view  
- 📝 Chronological history & CSV export  

---

## 🧰 Tech Stack

### Frontend

- **React 18+** & **TypeScript**  
- **Mantine UI** for modern component library  
- **MobX** for state management  
- **TanStack Query** (React Query) for data fetching & caching  
- **Axios** for HTTP requests  
- **Recharts** for charts (pie chart)  
- **FullCalendar** for calendar view  
- **Font Awesome** for icons  

### Backend

- **Node.js** + **Express**  
- **MongoDB** + **Mongoose**  
- **Nodemailer** for email invites  
- **JSON Web Tokens (JWT)** for auth  
- **dotenv** for configuration  
- **express-async-handler** for error handling  
- **json2csv** for CSV export  

---

Steps to run : 
Clone the repo
git clone https://github.com/yourusername/rentmate.git
cd rentmate

Backend: 

cd server
npm install
npm run dev

Frontend : 
cd client
npm install
npm run dev

## 🔗 API Endpoints

### 👤 Auth (`/api/users`)
- **POST** `/register` – Register a new user
- **POST** `/login` – Login and receive JWT

### 🏠 Households (`/api/households`)
- **POST** `/create` – Create a new household
- **POST** `/invite` – Invite members (supports single and bulk)
- **POST** `/join` – Join a household using an invite code
- **GET** `/mine` – Get all households the user is a member of
- **DELETE** `/:id` – Delete a household (owner only)
- **DELETE** `/:id/leave` – Leave a household (member)

### ✅ Chores (`/api/chores`)
- **POST** `/add` – Add a new chore
- **GET** `/:householdId` – Get chores for a household
- **PATCH** `/:choreId/complete` – Mark a chore as complete

### 💸 Expenses (`/api/expenses`)
- **POST** `/` – Add a new expense
- **GET** `/:householdId` – Get all expenses for a household
- **GET** `/:householdId/balances` – Get current balances for members
- **GET** `/:householdId/settle-up` – Suggest optimal settlement transactions

### 📅 Calendar (`/api/calendar`)
- **GET** `/:householdId` – Fetch calendar events (chores + expenses)

### 📜 History (`/api/history`)
- **GET** `/:householdId/history` – Get full activity log for a household
- **GET** `/:householdId/history/export` – Export activity log as CSV


📊 Example Dashboard
Balances: list & pie chart

Expenses: list, add form, “Settle Up” suggestions

Chores: list, add form, mark complete, overdue tags

Calendar: combined chores & expenses

📬 Invite Flow
Owner clicks “Invite Member” → enters user IDs → backend emails invite code.

Invitee clicks link → lands on /join?code=XYZ → mailbox route (protected)

Invitee automatically joins household → success UI → “Go to Dashboard”

🔮 Future Enhancements
🔔 Push notifications & reminders

⚡ Real-time updates via Socket.IO

📱 Mobile-optimized responsive layout

📆 Recurring-chore automation (cron job)

📥 Download CSV exports from UI

🧑‍💻 Author
Tathagat 

