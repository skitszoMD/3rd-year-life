# PHP API Documentation

This document explains the PHP API files that handle communication between the frontend and the database.

## Overview

The API uses RESTful principles:
- Different HTTP methods for different operations (GET, POST, PUT, DELETE)
- JSON for sending and receiving data
- PHP sessions for authentication

## Common Pattern

All API files follow this pattern:
1. Include config.php to connect to database
2. Set Content-Type header to JSON
3. Check HTTP method
4. Validate input
5. Perform database operation
6. Return JSON response

## config.php

**Purpose:** Connects to the MySQL database.

**What it does:**
1. Defines database connection constants (host, name, user, password)
2. Creates a PDO connection to MySQL
3. Sets error mode to throw exceptions
4. Sets default fetch mode to associative arrays
5. Handles connection errors by returning a 500 error

**Why PDO?** PDO (PHP Data Objects) is a secure way to connect to databases that supports prepared statements (prevents SQL injection).

## login.php

**Purpose:** Authenticates users and creates a session.

**HTTP Method:** POST only

**Input:** JSON body with `username` and `password`

**Process:**
1. Checks if request method is POST
2. Parses JSON input
3. Validates that username and password are provided
4. Queries the database for the user
5. Uses `password_verify()` to check the password (bcrypt hash)
6. If correct:
   - Starts a PHP session
   - Stores user info in session variables
   - Returns success with user data
7. If incorrect:
   - Returns 401 error

**Session Variables:**
- `$_SESSION['user_id']`: User's database ID
- `$_SESSION['username']`: Username
- `$_SESSION['is_admin']`: Boolean (1 = admin, 0 = regular user)

**Why bcrypt?** bcrypt is a secure password hashing algorithm that's built into PHP. It automatically handles salting and is slow (prevents brute force attacks).

## logout.php

**Purpose:** Destroys the user session to log them out.

**HTTP Method:** POST only

**Process:**
1. Starts the session to access it
2. Calls `session_destroy()` to delete all session data
3. Returns success

## products.php

**Purpose:** Handles all product operations (CRUD).

**HTTP Methods:** GET, POST, PUT, DELETE

**Authentication:** POST, PUT, DELETE require admin access

### GET - Retrieve Products

**Query Parameters:**
- `category` (optional): "flowers" or "coffee"

**Process:**
1. Checks if category is provided and valid
2. Queries database with or without category filter
3. Orders by creation date (newest first)
4. Formats the results for the frontend
5. Returns JSON array of products

**Response Format:**
```json
[
  {
    "id": "p1234567890",
    "cat": "flowers",
    "name": "Rose Bouquet",
    "desc": "Beautiful roses",
    "price": "25.00",
    "img": "data:image/jpeg;base64,...",
    "pos": {
      "z": 1.5,
      "x": 0.1,
      "y": -0.2,
      "ar": 1.333333
    }
  }
]
```

### POST - Create Product

**Input:** JSON body with product data

**Required Fields:**
- `cat`: Category ("flowers" or "coffee")
- `name`: Product name
- `price`: Price

**Optional Fields:**
- `desc`: Description
- `img`: Base64 encoded image
- `pos`: Position object (z, x, y, ar)

**Process:**
1. Checks if user is admin (from session)
2. Generates unique ID using timestamp
3. Inserts into database
4. Returns success with new ID

### PUT - Update Product

**Input:** JSON body with product data including `id`

**Process:**
1. Checks if user is admin
2. Updates the product in database
3. Returns success

### DELETE - Delete Product

**Query Parameters:**
- `id`: Product ID to delete

**Process:**
1. Checks if user is admin
2. Validates that ID is provided
3. Deletes from database
4. Returns success

## reset_password.php

**Purpose:** Allows users to reset their password.

**HTTP Method:** POST only

**Input:** JSON body with `username`, `password`, and `confirm`

**Process:**
1. Validates all fields are provided
2. Checks if passwords match
3. Queries database to check if user exists
4. If user exists:
   - Hashes the new password with `password_hash()`
   - Updates password in database
   - Returns success
5. If user doesn't exist:
   - Returns 404 error

**Why hash again?** The password is hashed before storing so the actual password is never saved in the database. This is a security best practice.

## .htaccess

**Purpose:** Configures Apache web server behavior.

**What it does:**

### CORS Headers
CORS (Cross-Origin Resource Sharing) allows the frontend to call the API even if they're on different domains.

- `Access-Control-Allow-Origin: *` - Allows any domain
- `Access-Control-Allow-Methods` - Lists allowed HTTP methods
- `Access-Control-Allow-Headers` - Lists allowed headers

### Preflight Requests
Browsers send an OPTIONS request before the actual request to check if it's allowed. This rule responds with 200 OK to allow the request to proceed.

**Why needed?** Without this, browsers would block the API calls for security reasons.

## Error Handling

All API files use HTTP status codes:
- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `403 Forbidden` - Not authorized (not admin)
- `404 Not Found` - Resource doesn't exist
- `405 Method Not Allowed` - Wrong HTTP method
- `500 Internal Server Error` - Server error (e.g., database connection failed)

## Security Features

1. **Prepared Statements:** All database queries use prepared statements to prevent SQL injection.

2. **Password Hashing:** Passwords are hashed with bcrypt before storing.

3. **Session-Based Auth:** Admin operations require a valid session with is_admin flag.

4. **Input Validation:** All inputs are validated before processing.

5. **Error Messages:** Generic error messages don't reveal sensitive information.
