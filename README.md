# Anthra — Coal Mine Carbon Neutrality Tracker

MERN stack web app to quantify carbon footprint (Scope 1/2/3) for Indian coal
mines and model pathways to carbon neutrality. Ministry of Coal themed.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** React (Vite), Tailwind CSS, Recharts, React Router

## Project structure
```
coal-carbon-tracker/
├── backend/
│   ├── config/db.js
│   ├── models/          # User, Mine, EmissionRecord
│   ├── controllers/     # auth, mine, emission, pathway, dashboard
│   ├── routes/
│   ├── middleware/authMiddleware.js
│   ├── utils/
│   │   ├── emissionCalculator.js   # Scope 1/2/3 formulas + pathway model
│   │   └── seedAdmin.js            # seeds an admin user + 3 sample mines
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/        # Login, Register, Dashboard, Mines, MineDetail, PathwayPlanner
    │   ├── components/   # Sidebar, StatCard, ProtectedRoute
    │   ├── context/AuthContext.jsx
    │   └── utils/api.js
    ├── tailwind.config.js
    └── .env.example
```

## Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # then edit MONGO_URI / JWT_SECRET as needed
npm run seed                 # creates a Ministry admin user + 3 sample mines
npm run dev                  # starts on http://localhost:5000
```

Seeded admin login:
- Email: `moc.admin@coaltracker.gov.in`
- Password: `ChangeMe123!`

(Change this password immediately in a real deployment — it's only for local dev.)

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env        # points to http://localhost:5000/api by default
npm run dev                  # starts on http://localhost:5173
```

Open `http://localhost:5173`, log in with the seeded admin (or register a new
`mine_admin` account), and you're in.

## How the emission math works
`backend/utils/emissionCalculator.js` has two functions:

- **`calculateEmissions()`** — takes raw activity data (diesel litres,
  explosives kg, coal tonnes produced, grid electricity kWh, transport
  tonne-km) and converts it to Scope 1 / 2 / 3 tonnes CO2e using documented
  emission factors (IPCC methane GWP, India CEA grid factor, etc.). These
  factors are simplified defaults — call this out clearly in your project
  report/viva, and consider making them configurable per-mine as a stretch
  goal.
- **`projectNeutralityPathway()`** — a simple year-by-year "what-if" model:
  ramping renewable energy share, afforestation-based offsets, and a
  constant annual efficiency gain, to estimate the year net emissions hit
  zero. This powers the Pathway Planner page's sliders.

## Suggested next features (if you want to extend it)
- Per-mine configurable emission factors (not hardcoded)
- CSV/Excel bulk upload for monthly emission data
- PDF export of a mine's carbon report (you already know the `pdf` skill pattern from other projects)
- Role-based state-level view (state coal ministry officials seeing only their state's mines)
- Real IPCC/CEA factor lookups instead of static constants
