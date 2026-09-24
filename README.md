# Coal Carbon Tracker

A web application to help Indian coal mines quantify their carbon footprint and track pathways toward carbon neutrality, themed around the Ministry of Coal's sustainability goals.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Auth:** JWT
- **Containerization:** Docker, Docker Compose

## Features

- Carbon footprint calculation and tracking dashboard
- JWT-based authentication (register/login)
- Real-time data visualization for emissions and neutrality pathways
- Premium, responsive dashboard UI

## Project Structure

```
coal-carbon-tracker/
├── backend/          # Express API, MongoDB models, auth, routes
├── frontend/         # React (Vite) client
├── docker-compose.yml
├── .env.example
└── README.md
```

## Local Setup (Docker) — Recommended

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1. **Clone the repo**
   ```bash
   git clone https://github.com/VinayJangra987/coal-carbon-tracker.git
   cd coal-carbon-tracker
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env` in the root folder and fill in your values:
   ```bash
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

5. **Stop the containers**
   ```bash
   docker-compose down
   ```

## Local Setup (Without Docker)

### Backend
```bash
cd backend
npm install
# create .env using .env.example as a reference
npm start
```

### Frontend
```bash
cd frontend
npm install
# create .env using .env.example as a reference
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | JWT token expiry duration (e.g. `7d`) |

> Never commit your actual `.env` file — only `.env.example` should be pushed to the repo.

## Contributing (for teammates)

1. Clone the repo and follow the Docker setup above.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes and push: `git push origin feature-name`
4. Open a pull request into `main`.

## License

This project is for academic/portfolio purposes.