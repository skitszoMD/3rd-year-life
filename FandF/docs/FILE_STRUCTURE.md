# File Structure

This document explains what each file in the project does.

## Root Files

### index.html
The main HTML file that creates the website structure. It contains:
- Login form
- Forgot password form
- Shop/catalog view with header, navigation, and product grid
- Footer with "About Us" section
- Modal dialog for adding/editing products

### app.js
The JavaScript file that makes the website interactive. It handles:
- Routing (switching between pages based on URL)
- API calls to the backend
- Image editing (zoom, drag, position)
- User authentication (login, logout)
- Product management (add, edit, delete)
- Mobile menu toggle

### style.css
The CSS file that styles the website. It defines:
- Color scheme (muted palette for a natural feel)
- Layout of all pages
- Responsive design for mobile devices
- Card styles for products
- Modal and form styles

### config.php
PHP configuration file that:
- Stores database connection details
- Creates a connection to MySQL
- Handles connection errors

### database.sql
SQL script that:
- Creates the database
- Creates the users table
- Creates the products table
- Inserts the default admin user

## API Folder (api/)

### .htaccess
Configuration file for Apache web server that:
- Enables CORS (allows the frontend to call the API)
- Handles preflight requests from browsers

### login.php
Handles user login:
- Receives username and password
- Checks if they match a user in the database
- Creates a session if login is successful
- Returns user information to the frontend

### logout.php
Handles user logout:
- Destroys the current session
- Logs the user out

### products.php
Handles all product operations:
- **GET**: Retrieves products (all or filtered by category)
- **POST**: Creates a new product (admin only)
- **PUT**: Updates an existing product (admin only)
- **DELETE**: Deletes a product (admin only)

### reset_password.php
Handles password reset:
- Receives username, new password, and confirmation
- Checks if the user exists
- Updates the password in the database
