# De Event Manager - API Documentation

## Overview

De Event Manager API an headless banckend that is meant to carry out all neccessary feature as a full blown backend.

- **Base URL**: `http://localhost:3000/api/v1`
- **Authentication**: An auth token is required in headers (`Authorization: Bearer AUTH_TOKEN`)
- **Format**: JSON
- **Note**: Only the authentication endpoints do not require authentication

---

## Authentication

Not all endpoints require a bearer token.

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

# Endpoints

## Authentication Endpoints

### 1. Register A New User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user.

#### Request Example
```bash
curl -X POST "http://localhost:3000/api/v1/auth/register"
```

#### Request Body
```json
{
  "firstName": "Rafael",
  "lastName": "Segual",
  "email": "rafeal1@gmail.com",
  "password": "12345678",
  "confirmPassword": "12345678"
}
```

#### Response Example
```json
{
  "response": {
    "message": "account registered successfully, a verification mail has been sent to your email, follow intructions to verify your account",
    "status": 201
  }
}
```

---

### 2. Account Activation

- **URL**: `/auth/activate-account/{token}`
- **Method**: `GET`
- **Description**: verify an account(email).

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/auth/activate-account/example_token_p9879b098"
```

#### Response Example
```json
{
  "response": {
    "message": "account activated, procced to login",
    "status": 200
  }
}
```

**Note**: This endpoint is not to be used in the frontnd, It's a dynamic endpoint (link sent to the user's email), that changes based on the request.
---

### 3. Resend Acount activation link

- **URL**: `/auth/resend-activation-link/{email}`
- **Method**: `GET`
- **Description**: Resend account activation link.

#### Request Example
```bash
curl -X POST "http://localhost:3000/api/v1/auth/resend-activation-link/example@gmail.com"
```

#### Response Example
```json
{
  "response": {
    "message": "Activation link as  has been sent to your email",
    "status": 200
  }
}
```
**Note**: This endpoint is not to be used in the frontnd, It's a dynamic endpoint (link sent to the user's email), that changes based on the request.
---


### 4. Login A User

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Login a user.

#### Request Example
```bash
curl -X POST "http://localhost:3000/api/v1/auth/login"
```

#### Request Body
```json
{
  "email": "rafeal1@gmail.com",
  "password": "12345678"
}
```

#### Response Example
```json
{
  "response": {
    "message": "user logged in successfully",
    "status": 200,
    "token": "authtokenexample_ijpoip8aiuh97e723c87b807cv"
  }
}
```

---

### 5. Request Password Reset Link

- **URL**: `/auth/forgotten-password/request-password-reset/{email}`
- **Method**: `GET`
- **Description**: Request password reset link.

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/auth/forgotten-password/request-password-reset/example@gmail.com"
```

#### Response Example
```json
{
  "response": {
    "message": "Password reset link as  has been sent to your email",
    "status": 200
  }
}
```

---


### 6. Password Reset (email confirmation link)

- **URL**: `/auth/forgotten-password/reset-password/{token}`
- **Method**: `POST`
- **Description**: Reset password.

#### Request Example
```bash
curl -X POST "http://localhost:3000/api/v1/auth/forgotten-password/reset-password/example_token_oiaobpay"
```

#### Response Example
```json
{
  "response": {
    "message": "your password reset was successful",
    "status": 200
  }
}
```
**Note**: This endpoint is not to be used in the frontnd, It's a dynamic endpoint (link sent to the user's email), that changes based on the request.


---

## User Endpoints

### All endpoints listed here needs authentication

### 1. Dashboard Information

- **URL**: `/user/dashboard`
- **Method**: `POST`
- **Description**: User dashboard information.

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/user/dashboard" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

#### Response Example
```json
{
  "response": {
    "message": "user logged in successfully",
    "status": 200,
    "token": "authtokenexample_ijpoip8aiuh97e723c87b807cv"
  }
}
```

---

### 2. Reset Password

- **URL**: `/user/password/reset-password`
- **Method**: `POST`
- **Description**: Reset Password.

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/user/password/reset-password" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

#### Response Example
```json
{
  "response": {
    "message": "password reset was successful",
    "status": 200
  }
}
```

---

### 3. Logout User

- **URL**: `/user/account/logout`
- **Method**: `POST`
- **Description**: logout user.

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/user/account/logout" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

#### Response Example
```json
{
  "response": {
    "message": "logoiut successful",
    "status": 200
  }
}
```

---

### 4. Delete Account

- **URL**: `/user/account/delete-account`
- **Method**: `POST`
- **Description**: Delete account.

#### Request Example
```bash
curl -X GET "http://localhost:3000/api/v1/user/account/delete-account" \
     -H "Authorization: Bearer YOUR_TOKEN"
```

#### Response Example
```json
{
  "response": {
    "message": "user was successfully deleted",
    "status": 200
  }
}
```

---


## Error Responses

| Code | Message             | Description                  |
|------|---------------------|------------------------------|
| 400  | Bad Request         | Invalid input or missing data|
| 401  | Unauthorized        | Invalid or missing Token   |
| 404  | Not Found           | Item not found               |
| 500  | Internal Server Error | Something went wrong on our end |

---

## Changelog

- **v1.0** - Initial release

---

## Contact

For support, contact [etimdnl41@gmail.com](mailto:etimdnl41@gmail.com)
