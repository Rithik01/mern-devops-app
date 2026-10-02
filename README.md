# MERN Task Manager — a DevOps learning project

A small Task Manager (MongoDB, Express, React, Node) built to be the **one project** you carry through a DevOps course: Docker → Docker Compose → CI (GitHub Actions) → CD → AWS. The app is deliberately simple so you can focus on the DevOps parts.

## 1. What the project does

You can create, view, edit, delete tasks and mark them completed/pending. There is no login (on purpose).

## 2. Technology stack

| Part | Tools |
| --- | --- |
| Frontend | React 18, Vite, Axios, ESLint, Prettier |
| Backend | Node.js 22, Express 5, Mongoose, dotenv, cors, nodemon, ESLint, Prettier |
| Database | MongoDB 7 |
| Infrastructure | Docker, Docker Compose, GitHub Actions |

## 3. Project structure

```
mern-devops-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # MongoDB connection (reads MONGO_URI)
│   │   ├── controllers/            # request logic (CRUD)
│   │   ├── models/Task.js          # Mongoose schema
│   │   ├── routes/taskRoutes.js    # URL -> controller mapping
│   │   ├── middleware/errorHandler.js
│   │   ├── app.js                  # Express app (no listening here)
│   │   └── server.js               # connects to DB, starts listening
│   ├── tests/health.test.js        # tests (Node's built-in runner, no DB needed)
│   ├── Dockerfile, .dockerignore, .env.example
│   └── package.json, eslint.config.js, .prettierrc
├── frontend/
│   ├── src/ (App.jsx, components/, api/client.js)
│   ├── Dockerfile, nginx.conf, .dockerignore, .env.example
│   └── package.json, vite.config.js, eslint.config.js, .prettierrc
├── docker-compose.yml              # runs frontend + backend + mongo together
├── .env.example                    # all variables, documented
├── .github/workflows/ci.yml        # CI pipeline
└── README.md
```

## 4. Run WITHOUT Docker

You need Node.js 20+ and a MongoDB running on `localhost:27017` (install it, or run just the database in Docker: `docker run -d -p 27017:27017 --name mongo mongo:7`).

```bash
# Terminal 1 - backend
cd backend
cp .env.example .env        # uses mongodb://localhost:27017/...
npm install
npm run dev                 # http://localhost:5000/api/health

# Terminal 2 - frontend
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

Other scripts (both folders): `npm run lint`, `npm run format`, `npm run format:check`. Backend also has `npm start` and `npm test`; frontend has `npm run build` and `npm run preview`.

## 5. Run WITH Docker Compose

Only Docker is needed.

```bash
cp .env.example .env        # optional: defaults work without it
docker compose up --build   # build images and start everything
```

Open http://localhost:5173. Useful commands:

```bash
docker compose up -d --build   # run in the background
docker compose logs -f backend # follow one service's logs
docker compose ps              # list containers and health
docker compose down            # stop and remove containers (data is KEPT)
docker compose down -v         # ...and also DELETE the database volume
```

## 6. Environment variables

| Variable | Used by | Meaning | Example |
| --- | --- | --- | --- |
| `PORT` | backend | Port the API listens on | `5000` |
| `NODE_ENV` | backend | `development` / `production` | `development` |
| `MONGO_URI` | backend | MongoDB connection string | `mongodb://mongo:27017/mern_devops` |
| `CORS_ORIGIN` | backend (optional) | Website allowed to call the API (default: any) | `http://localhost:5173` |
| `VITE_API_URL` | frontend | Backend URL **as seen from the browser** | `http://localhost:5000/api` |

Real `.env` files are git-ignored; only `.env.example` files are committed. **Never commit secrets.**

> Gotcha worth remembering: `VITE_*` variables are baked into the JavaScript when the frontend is *built*, not read when it runs. Changing `VITE_API_URL` means rebuilding the frontend image.

## 7. API endpoints

| Method | URL | Description |
| --- | --- | --- |
| GET | `/api/health` | `{ "status": "ok" }` (for health checks) |
| GET | `/api/tasks` | List tasks (newest first) |
| POST | `/api/tasks` | Create task `{ title, description? }` |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update `{ title?, description?, completed? }` |
| DELETE | `/api/tasks/:id` | Delete a task |

Errors are JSON: `{ "message": "..." }` with status 400 (bad input), 404 (not found) or 500.

```bash
curl -X POST localhost:5000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Learn Docker"}'
```

## 8. MongoDB connection

`backend/src/config/db.js` calls `mongoose.connect(process.env.MONGO_URI)`. Nothing else knows where the database is. That is why the same code works everywhere — only the variable changes:

| Where | `MONGO_URI` |
| --- | --- |
| Backend on your machine, Mongo on your machine/Docker | `mongodb://localhost:27017/mern_devops` |
| Everything in Docker Compose | `mongodb://mongo:27017/mern_devops` (`mongo` = service name) |
| AWS + MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/mern_devops` (from a secret store) |

`localhost` inside a container means *that container itself*, so a backend container must **not** use `localhost` to reach Mongo.

## 9. Docker architecture

```
 Your browser
   │  http://localhost:5173                 http://localhost:5000/api
   ▼                                              ▲
┌──────────────── Docker Compose network ─────────┴────────────┐
│  frontend (nginx :8080)      backend (Express :5000) ──────┐ │
│  serves built React files    REST API                      ▼ │
│                                                 mongo (:27017)│
│                                                  └─ volume mongo_data
└───────────────────────────────────────────────────────────────┘
```

Important: the React app runs **in your browser**, so the browser calls the backend through the published port `localhost:5000`. Only the backend → Mongo call travels over the internal Docker network.

### Docker concepts used here

- **Image** – a read-only package with an app and everything it needs (OS files, Node, your code). Built once, run anywhere.
- **Container** – a running instance of an image. Disposable: delete and recreate freely.
- **Dockerfile** – the recipe for building an image. See `backend/Dockerfile` (comments explain each line, including layer caching: `package*.json` is copied before the source so `npm ci` is cached).
- **Docker Compose** – describes several containers in one `docker-compose.yml` and starts them together.
- **Volume** – storage managed by Docker that outlives containers. `mongo_data` keeps your tasks when containers are recreated. `docker compose down -v` deletes it.
- **Network** – Compose creates a private network where containers find each other by service name (`mongo`, `backend`).
- **Environment variables** – settings injected into containers (`environment:` in compose). They keep config and secrets out of the code and images.

Other decisions: both app containers run as non-root users; `.dockerignore` keeps `node_modules` and `.env` out of images; the frontend uses a 2-stage build (Node builds, nginx serves) because built React files need no Node at runtime.

## 10. CI/CD architecture

Today only **CI** exists:

```
git push / pull request to main
        ↓
   GitHub Actions
   ├─ job: backend   → checkout → setup Node → npm ci → eslint → prettier --check → tests
   └─ job: frontend  → checkout → setup Node → npm ci → eslint → prettier --check → build
        ↓
  ✅ green (or ❌ red and the PR shows it)
```

Planned later: `… → build Docker images → push to a registry (ECR) → deploy to AWS` (CD).

## 11. How GitHub Actions works

- A **workflow** is a YAML file in `.github/workflows/`. GitHub runs it when its `on:` event happens (here: push to `main` and PRs targeting `main`).
- A workflow has **jobs**; each job runs on a fresh virtual machine (`runs-on: ubuntu-latest`). Jobs without `needs:` run in parallel.
- A job is a list of **steps**: either `uses:` (a reusable action such as `actions/checkout`) or `run:` (a shell command).
- If any step fails, the job fails and the commit/PR gets a red ✗. See the results in the repo's **Actions** tab.
- `npm ci` installs exactly what `package-lock.json` says, so CI matches your machine. That's why lock files are committed.

Run the same checks locally before pushing: `npm run lint && npm run format:check` (and `npm test` / `npm run build`).

## 12. Future AWS deployment plan

Nothing AWS-specific exists yet; the app is simply prepared (config via env vars, `0.0.0.0` binding, `/api/health`, small non-root images). A likely path:

1. **Phase 5** – CI builds the images and pushes them to **Amazon ECR**.
2. **Phase 6–7** – deploy the backend container (ECS Fargate / App Runner / EC2) and the frontend (container, or S3 + CloudFront); use **MongoDB Atlas** (or DocumentDB) for the database.
3. **Phase 8** – secrets (`MONGO_URI`) in Secrets Manager / SSM, GitHub Actions authenticates to AWS with OIDC, HTTPS, `CORS_ORIGIN` locked to the real frontend URL, health checks on `/api/health`.

What changes then: `MONGO_URI` (Atlas), `VITE_API_URL` (public backend URL, rebuild frontend), `CORS_ORIGIN`, `NODE_ENV=production`, and the `mongo` service in compose is no longer used in the cloud.
