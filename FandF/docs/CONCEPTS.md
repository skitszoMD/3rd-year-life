# Key Concepts

This document explains the key concepts and technologies used in the Flora & Froth project.

## Single Page Application (SPA)

**What it is:** A web application that loads a single HTML page and dynamically updates content as the user interacts with it, instead of loading new pages from the server.

**How it works here:**
- The entire app is in one HTML file (index.html)
- Different "pages" (login, shop, etc.) are sections that are shown/hidden
- Navigation uses URL hashes (e.g., #/coffee, #/login)
- JavaScript intercepts hash changes and updates the view

**Benefits:**
- Faster navigation (no page reloads)
- Smoother user experience
- Less server load

## Client-Server Architecture

**What it is:** The application is split into two parts:
- **Client (Frontend):** HTML, CSS, JavaScript that runs in the browser
- **Server (Backend):** PHP and MySQL that runs on the server

**How it works here:**
- Frontend makes HTTP requests to the backend API
- Backend processes requests and returns JSON data
- Frontend displays the data to the user

**Flow:**
1. User clicks "Login"
2. JavaScript sends POST request to api/login.php
3. PHP checks database
4. PHP returns success/failure as JSON
5. JavaScript updates the UI

## RESTful API

**What it is:** An API (Application Programming Interface) that uses HTTP methods to perform operations on resources.

**HTTP Methods:**
- **GET**: Retrieve data (read)
- **POST**: Create new data
- **PUT**: Update existing data
- **DELETE**: Remove data

**Example in this project:**
- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `PUT /api/products` - Update a product
- `DELETE /api/products?id=123` - Delete a product

## JSON (JavaScript Object Notation)

**What it is:** A lightweight data format for storing and exchanging data.

**Why used:** Easy for both humans to read and machines to parse.

**Example:**
```json
{
  "name": "Rose Bouquet",
  "price": "25.00",
  "category": "flowers"
}
```

**In this project:**
- Frontend sends JSON to API
- API returns JSON to frontend
- JavaScript can easily convert JSON to objects

## Database (MySQL)

**What it is:** A system for storing and managing data in tables.

**Why used:** Persistent storage (data survives page refreshes and server restarts).

**Tables in this project:**
- `users`: Stores account information
- `products`: Stores product information

**Relational Database:** Data is organized in related tables (though this project doesn't use relationships yet).

## SQL (Structured Query Language)

**What it is:** The language used to communicate with databases.

**Common operations:**
- `SELECT` - Retrieve data
- `INSERT` - Add new data
- `UPDATE` - Modify existing data
- `DELETE` - Remove data

**Example:**
```sql
SELECT * FROM products WHERE category = 'flowers';
```

## PHP Sessions

**What it is:** A way to store user data across multiple page requests.

**How it works:**
1. User logs in
2. Server creates a session with a unique ID
3. Session ID is stored in a cookie on the user's browser
4. Each request includes the session ID
5. Server uses the ID to retrieve session data

**In this project:**
- Stores whether user is logged in
- Stores whether user is an admin
- Used to authorize admin-only operations

## Password Hashing (bcrypt)

**What it is:** A one-way encryption for passwords.

**Why important:** Never store passwords in plain text. If the database is hacked, user passwords would be exposed.

**How it works:**
- Password is converted to a hash (a string of characters)
- Hash cannot be reversed to get the original password
- To verify, hash the input password and compare with stored hash

**PHP functions:**
- `password_hash($password, PASSWORD_DEFAULT)` - Create hash
- `password_verify($input, $hash)` - Verify password

**Example:**
```php
// Hash "admin" -> $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
// This hash is stored in the database
```

## CORS (Cross-Origin Resource Sharing)

**What it is:** A security feature that restricts which domains can make requests to your API.

**Problem:** Browsers block requests from one domain to another by default.

**Solution:** The .htaccess file adds headers to allow requests:
```
Access-Control-Allow-Origin: *
```

**In this project:** Allows the frontend to call the API from the same domain. The * wildcard allows any domain (okay for development, but restrict in production).

## XSS (Cross-Site Scripting)

**What it is:** A security vulnerability where attackers inject malicious scripts into web pages.

**Example attack:** User enters `<script>alert('hacked')</script>` as their name, and it runs on other users' browsers.

**Prevention:** Escape HTML characters before displaying user input.

**In this project:** The `esc()` function converts special characters:
- `<` becomes `&lt;`
- `>` becomes `&gt;`
- etc.

This ensures the browser displays the text as-is, not as HTML.

## SQL Injection

**What it is:** A security vulnerability where attackers manipulate SQL queries.

**Example attack:** User enters `' OR '1'='1` as username, which bypasses password check.

**Prevention:** Use prepared statements with parameterized queries.

**In this project:** All PHP database queries use prepared statements:
```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
```

The `?` is a placeholder. The value is inserted safely, preventing injection.

## Base64 Encoding

**What it is:** A way to represent binary data (like images) as text.

**Why used:** Images can be stored in text fields in the database.

**How it works:**
- Binary data is converted to a string of 64 characters (A-Z, a-z, 0-9, +, /)
- Can be decoded back to binary when needed

**In this project:** Images are converted to Base64 strings and stored in the `image` column.

**Trade-off:** Base64 is ~33% larger than the original binary data.

## URL Hash Routing

**What it is:** Using the part of the URL after # to determine which page to show.

**Examples:**
- `#/` - Home page
- `#/coffee` - Coffee products
- `#/login` - Login page

**Why used:** Simple routing without server configuration. The hash portion doesn't trigger a page reload.

**In this project:** JavaScript listens for hash changes and updates the view:
```javascript
window.addEventListener("hashchange", route);
```

## Asynchronous JavaScript (async/await)

**What it is:** A way to handle operations that take time (like API calls) without freezing the page.

**How it works:**
- `async` marks a function as asynchronous
- `await` pauses the function until a promise resolves
- Other code can run while waiting

**Example:**
```javascript
async function loadProducts() {
  const products = await api("products");  // Wait for API response
  renderShop(products);  // Then render
}
```

**Without async/await:** You'd need to use callbacks or `.then()` chains.

## DOM Manipulation

**What it is:** Changing the HTML page using JavaScript.

**Common operations:**
- `document.querySelector()` - Find an element
- `element.textContent` - Change text
- `element.hidden` - Show/hide element
- `element.innerHTML` - Change HTML content

**In this project:** Used extensively to:
- Show/hide sections
- Update product grid
- Display error messages
- Update navigation highlighting

## Responsive Design

**What it is:** Designing websites that work well on different screen sizes.

**How it works:**
- CSS media queries apply different styles at different screen widths
- Flexible layouts that adapt to screen size
- Touch-friendly controls on mobile

**In this project:**
- Grid changes from 4 columns to 2 to 1 on smaller screens
- Navigation becomes a hamburger menu on mobile
- Font sizes adjust for readability

## Event Listeners

**What it is:** Functions that run when specific events occur.

**Common events:**
- `click` - User clicks something
- `submit` - Form is submitted
- `change` - Input value changes
- `hashchange` - URL hash changes

**In this project:**
- Button clicks trigger actions
- Form submissions send data to API
- Hash changes update the page
- File uploads trigger image processing
