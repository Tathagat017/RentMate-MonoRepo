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

## 🖥️ High-Level Design

Frontend (React)
│
├─ Pages:
│ ├─ /login, /register Authentication
│ ├─ /dashboard Overview & balances
│ ├─ /join?code=INVITE_CODE Accept household invite
│ └─ /household/:id Household dashboard
│ ├─ Chores Tab
│ ├─ Expenses Tab
│ ├─ Members Tab
│ ├─ Calendar Tab
│ ├─ History Tab
│ └─ Settings Tab
│
└─ Components & Stores (MobX + TanStack Query)

Backend (Express)
│
├─ Auth (/api/users)
│ ├─ POST /register
│ └─ POST /login
│
├─ Households (/api/households)
│ ├─ POST /create
│ ├─ POST /invite (single & bulk)
│ ├─ POST /join (by code)
│ ├─ GET /mine (member’s households)
│ ├─ DELETE /:id (owner deletes)
│ └─ DELETE /:id/leave (member leaves)
│
├─ Chores (/api/chores)
│ ├─ POST /add
│ ├─ GET /:householdId
│ └─ PATCH /:choreId/complete
│
├─ Expenses (/api/expenses)
│ ├─ POST /
│ ├─ GET /:householdId
│ ├─ GET /:householdId/balances
│ └─ GET /:householdId/settle-up
│
├─ Calendar (/api/calendar)
│ └─ GET /:householdId
│
└─ History (/api/history)
├─ GET /:householdId/history
└─ GET /:householdId/history/export

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

