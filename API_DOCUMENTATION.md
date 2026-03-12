# 📚 SESPIMA Backend API Documentation

## Overview

SESPIMA Backend adalah API untuk Sistem Manajemen Tugas Sekolah yang menyediakan fitur lengkap untuk mengelola data user, guru, siswa, tugas, dan nilai.

**API Version**: 1.0.0  
**Base URL**: `http://localhost:3000/api/v1`

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Setup Environment

Create `.env` file:

```env
CORS_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=express_ac
DB_PASSWORD=ExDevelop123
DB_NAME=sespima
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=3000
```

### Run Server

```bash
# Development
npm run dev

# Production
npm start
```

### Database Setup

```bash
# Initialize tables
npm run init:db

# Seed sample data
npm run seed:db

# Reset database
npm run reset:db
```

---

## 📖 API Documentation

### Access Swagger Documentation

Once the server is running, visit:

```
http://localhost:3000/api-docs
```

This provides interactive API documentation where you can test all endpoints.

---

## 🔐 Authentication

### JWT Token

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Get Token

1. **Register** (`POST /api/v1/auth/register`)
2. **Login** (`POST /api/v1/auth/login`)

Both will return a JWT token valid for 7 days.

---

## 📋 API Endpoints

### Authentication (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |

### Users (Auth required)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | admin |
| GET | `/users/:id` | Get user by ID | - |
| GET | `/users/email/:email` | Get user by email | - |
| POST | `/users` | Create user | admin |
| PUT | `/users/:id` | Update user | - |
| DELETE | `/users/:id` | Delete user | admin |

### Directors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/directors` | Get all directors |
| GET | `/directors/:id` | Get director by ID |
| GET | `/directors/user/:userId` | Get by user ID |
| POST | `/directors` | Create director |
| PUT | `/directors/:id` | Update director |
| DELETE | `/directors/:id` | Delete director |

### Teachers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teachers` | Get all teachers |
| GET | `/teachers/:id` | Get teacher by ID |
| GET | `/teachers/user/:userId` | Get by user ID |
| GET | `/teachers/nrp/:nrp` | Get by NRP |
| POST | `/teachers` | Create teacher |
| PUT | `/teachers/:id` | Update teacher |
| DELETE | `/teachers/:id` | Delete teacher |

### Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups` | Get all groups |
| GET | `/groups/:id` | Get group by ID |
| GET | `/groups/name/:name` | Get by name |
| GET | `/groups/grade/:grade` | Get by grade |
| POST | `/groups` | Create group |
| PUT | `/groups/:id` | Update group |
| DELETE | `/groups/:id` | Delete group |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| GET | `/students/user/:userId` | Get by user ID |
| GET | `/students/nip/:nip` | Get by NIP |
| GET | `/students/group/:groupId` | Get by group |
| POST | `/students` | Create student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get task by ID |
| GET | `/tasks/teacher/:teacherId` | Get by teacher |
| GET | `/tasks/status/:status` | Get by status |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Gived Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gived-tasks` | Get all gived tasks |
| GET | `/gived-tasks/:id` | Get by ID |
| GET | `/gived-tasks/task/:taskId` | Get by task |
| GET | `/gived-tasks/student/:studentId` | Get by student |
| GET | `/gived-tasks/status/:status` | Get by status |
| POST | `/gived-tasks` | Create gived task |
| PUT | `/gived-tasks/:id` | Update gived task |
| DELETE | `/gived-tasks/:id` | Delete gived task |

### Grades

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/grades` | Get all grades |
| GET | `/grades/:id` | Get grade by ID |
| GET | `/grades/student/:studentId` | Get by student |
| GET | `/grades/teacher/:teacherId` | Get by teacher |
| GET | `/grades/task/:taskId` | Get by task |
| POST | `/grades` | Create grade |
| PUT | `/grades/:id` | Update grade |
| DELETE | `/grades/:id` | Delete grade |

### Grade Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/grade-categories` | Get all categories |
| GET | `/grade-categories/:id` | Get by ID |
| GET | `/grade-categories/name/:name` | Get by name |
| GET | `/grade-categories/parents` | Get parents |
| GET | `/grade-categories/children/:categoryId` | Get children |
| POST | `/grade-categories` | Create category |
| PUT | `/grade-categories/:id` | Update category |
| DELETE | `/grade-categories/:id` | Delete category |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activities` | Get all activities |
| GET | `/activities/:id` | Get activity by ID |
| GET | `/activities/recent` | Get recent activities |
| GET | `/activities/user/:userId` | Get by user |
| POST | `/activities` | Create activity |
| POST | `/activities/date-range` | Get by date range |
| DELETE | `/activities/old` | Delete old activities |
| DELETE | `/activities/user/:userId` | Delete by user |

---

## 📝 Example Requests

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "students",
    "phone_number": "+628123456789",
    "address": "Jl. Main St 123",
    "birth_date": "2000-01-15"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Students (with auth)

```bash
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your_token>"
```

### Create Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "teacher_id": 1,
    "title": "Math Assignment",
    "description": "Chapter 5 exercises",
    "start_date": "2024-03-15",
    "due_date": "2024-03-20",
    "start_time": "08:00:00",
    "due_time": "17:00:00",
    "status": "pending"
  }'
```

---

## 🎯 User Roles

- **students**: Regular student user
- **teacher**: Teacher who can create tasks
- **director**: School director
- **admin**: System administrator

---

## ⚠️ Error Handling

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Missing or invalid fields |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Email already in use |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "error": "User not found"
}
```

---

## 📊 Database Schema

### Users
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `role` (ENUM: students, admin, teacher, director)
- `phone_number` (VARCHAR)
- `address` (TEXT)
- `birth_date` (DATE)
- `is_active` (TINYINT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Students
- `id` (INT, PRIMARY KEY)
- `nip` (VARCHAR, UNIQUE)
- `user_id` (INT, FK → users)
- `group_id` (INT, FK → groups)
- `grade` (VARCHAR)
- `religion` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Teachers
- `id` (INT, PRIMARY KEY)
- `user_id` (INT, FK → users)
- `nrp` (VARCHAR, UNIQUE)
- `rank` (VARCHAR)
- `position` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Groups
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR, UNIQUE)
- `grade` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tasks
- `id` (INT, PRIMARY KEY)
- `teacher_id` (INT, FK → teachers)
- `title` (VARCHAR)
- `description` (TEXT)
- `start_date` (DATE)
- `due_date` (DATE)
- `start_time` (TIME)
- `due_time` (TIME)
- `status` (ENUM: pending, completed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Gived Tasks
- `id` (INT, PRIMARY KEY)
- `task_id` (INT, FK → tasks)
- `student_id` (INT, FK → users)
- `filepath` (VARCHAR)
- `rates` (FLOAT)
- `status` (ENUM: pending, completed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Grades
- `id` (INT, PRIMARY KEY)
- `student_id` (INT, FK → students)
- `teacher_id` (INT, FK → teachers)
- `grade_category_id` (INT, FK → grade_categories)
- `task_id` (INT, FK → tasks)
- `grade` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Grade Categories
- `id` (INT, PRIMARY KEY)
- `name` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `category_id` (INT, FK → grade_categories - for hierarchical categories)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Log Activity
- `id` (INT, PRIMARY KEY)
- `user_id` (INT, FK → users)
- `activity` (VARCHAR)
- `created_at` (TIMESTAMP)

---

## 🔧 Development Notes

### Models Location
- `/models/*.model.js` - Database models

### Controllers Location
- `/controllers/*.controller.js` - Request handlers

### Routes Location
- `/routes/*.routes.js` - API route definitions

### Middleware
- `/middleware/auth.middleware.js` - Authentication & authorization

---

## 📞 Support

For issues or questions, contact: admin@sespima.com

---

**Last Updated**: March 12, 2026  
**Version**: 1.0.0
