# Setup Backend MongoDB

This version removes the frontend dependency on `src/data/initialData.json`.
The React app now reads data from an Express + MongoDB backend.

## 1. Install frontend dependencies

From the project root:

```bash
npm install
```

## 2. Configure frontend API URL

Create a file named `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Install backend dependencies

```bash
cd backend
npm install
```

## 4. Configure backend MongoDB

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/modules_roles_db
JWT_SECRET=change_this_secret_key
CLIENT_URL=http://localhost:5173
```

## 5. Start MongoDB

Make sure MongoDB is running locally.

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## 6. Start backend

From `backend`:

```bash
npm run dev
```

The backend starts on:

```txt
http://localhost:5000
```

Main API endpoints:

```txt
POST   /api/auth/login
GET    /api/data
GET    /api/modules
POST   /api/modules
PUT    /api/modules/:id
DELETE /api/modules/:id
GET    /api/roles
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id
POST   /api/agent-modules
DELETE /api/agent-modules/:agentId/:moduleId
PATCH  /api/users/:agentId/roles/:roleId
DELETE /api/users/:agentId/roles/:roleId
```

## 7. Start frontend

From the project root:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Default login accounts

The backend auto-seeds the database the first time it starts if there are no users.

```txt
admin / admin123
manager1 / manager123
manager2 / manager123
manager3 / manager123
agent1 / agent123
agent2 / agent123456
agent3 / agent123
```

## Reset database manually

From `backend`:

```bash
npm run seed
```
