# 🚀 Quick Start Guide - Swagger Setup

## Installation

### 1. Install Dependencies

```bash
npm install swagger-jsdoc swagger-ui-express
```

Or install existing project dependencies:

```bash
npm install
```

### 2. Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
```

### 3. Access Swagger Documentation

Open your browser and visit:

```
http://localhost:3000/api-docs
```

---

## 📚 What is Swagger?

Swagger (OpenAPI) is an interactive API documentation tool that allows you to:

- **View** all available endpoints
- **Try** API calls directly in the browser
- **See** request/response formats
- **Test** authentication
- **Generate** client libraries

---

## 🎯 How to Use Swagger UI

### 1. Browse Endpoints

The left sidebar shows all API endpoints grouped by resource:
- Authentication
- Users
- Directors
- Teachers
- Groups
- Students
- Tasks
- Gived Tasks
- Grades
- Grade Categories
- Activities

### 2. Test an Endpoint

1. Click on an endpoint to expand it
2. Click the **Try it out** button
3. Fill in required parameters
4. Click **Execute**
5. View the response

### 3. Authenticate for Protected Endpoints

1. Look for the **Authorize** button at the top
2. Enter your JWT token: `Bearer <your_token>`
3. Click **Authorize**
4. Now you can test protected endpoints

---

## 📋 Example Workflow

### Step 1: Register User

1. Go to **Authentication** → **POST /auth/register**
2. Click **Try it out**
3. Enter request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "students"
}
```
4. Click **Execute**
5. Copy the returned `token`

### Step 2: Authenticate

1. Click **Authorize** button (top right)
2. Paste: `Bearer <your_token>`
3. Click **Authorize** → **Close**

### Step 3: Create a Student

1. Go to **Students** → **POST /students**
2. Click **Try it out**
3. Enter request body:
```json
{
  "nip": "0001/X-IPA-1/2024",
  "user_id": 1,
  "group_id": 1,
  "grade": "10",
  "religion": "Islam"
}
```
4. Click **Execute**

---

## 🔑 API Key Locations

### Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JWT Token Format
- **Scheme**: Bearer
- **Token**: JWT token from login/register response
- **Expiry**: 7 days

---

## 📊 Response Formats

### Success Response (200, 201)
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "students",
    "created_at": "2024-03-12T10:30:00Z"
  }
}
```

### Error Response (400, 401, 404, etc)
```json
{
  "error": "User not found"
}
```

---

## 🎨 Swagger Features

### Schema Definitions
View data models and their properties under **Schemas** tab

### Request Models
Pre-filled request templates for each endpoint

### Response Models
See what to expect from each endpoint

### Status Codes
View all possible response codes and meanings

---

## 🔐 Security

### Authentication Required
Most endpoints require a valid JWT token.

#### How to Get Token:
1. Call `/auth/register` or `/auth/login`
2. Copy the `token` from response
3. Click **Authorize** in Swagger
4. Paste: `Bearer <your_token>`

### Role-Based Access
Some endpoints require specific roles:
- `admin` - System administrator
- `teacher` - Teacher operations
- User's own resources - No role required

---

## 📱 API Testing Tools

Besides Swagger, you can also use:

### Postman
```
Import OpenAPI specification:
http://localhost:3000/openapi.json
```

### curl
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <your_token>"
```

### Thunder Client (VS Code)
Install extension and import Swagger spec

---

## ✅ Common Tasks

### Get My User Profile
```
GET /api/v1/users/:id
(with auth token)
```

### Create a New Task
```
POST /api/v1/tasks
Role: teacher required
```

### View Student Grades
```
GET /api/v1/grades/student/:studentId
(with auth token)
```

### Log an Activity
```
POST /api/v1/activities
Body: { user_id, activity }
```

---

## 🐛 Troubleshooting

### Swagger page not loading
- Make sure server is running: `npm run dev`
- Check port 3000 is not in use
- Clear browser cache and reload

### "Unauthorized" errors
- Swagger uses the current browser security context
- Make sure you clicked **Authorize** with a valid token
- Login first if not authenticated

### CORS errors
- Check `.env` CORS_ORIGIN setting
- For local testing, it should be: `http://localhost:3000`

### Token expired
- Register or login again to get a new token
- Tokens expire after 7 days by default

---

## 📖 More Information

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference

---

**Happy Testing! 🎉**
