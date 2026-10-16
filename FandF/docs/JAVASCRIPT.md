# JavaScript Documentation (app.js)

This document explains the JavaScript code in app.js.

## Helper Functions

### $(selector)
A shortcut for `document.querySelector(selector)`. It finds the first element that matches the CSS selector.

Example:
```javascript
$("#login")  // Same as document.querySelector("#login")
```

### esc(text)
Escapes HTML characters to prevent XSS attacks. It converts special characters like `<` and `>` to their HTML entity codes.

Example:
```javascript
esc("<script>")  // Returns "&lt;script&gt;"
```

## API Functions

### API_BASE
The base URL for all API calls. Set to "api".

### api(endpoint, options)
A function that makes HTTP requests to the PHP backend.

**Parameters:**
- `endpoint`: The API endpoint (e.g., "login", "products")
- `options`: Request options like method and body

**How it works:**
1. Builds the full URL by combining API_BASE with the endpoint
2. Sets the Content-Type header to JSON
3. Converts the body object to a JSON string if needed
4. Makes the fetch request
5. Parses the response as JSON
6. Throws an error if the request failed

**Example:**
```javascript
// Login
api("login", {
  method: "POST",
  body: { username: "admin", password: "admin" }
})

// Get products
api("products")

// Delete product
api("products?id=p123", { method: "DELETE" })
```

## Application Data

### session
Stores the currently logged-in user's information:
- `name`: Username
- `admin`: True if user is an admin

### products
An array of all products loaded from the database.

### editingId
The ID of the product currently being edited. If null, we're adding a new product.

## Image Positioning

### FRAME_AR
The aspect ratio of the image frame (4:3). This must match the CSS.

### dims(z, ar)
Calculates the width and height of an image based on zoom and aspect ratio.

**Parameters:**
- `z`: Zoom level (1 = fills the frame)
- `ar`: Aspect ratio of the original image

**Returns:** An array [width, height] in frame units

### frameStyle(position)
Generates CSS to position an image within the frame.

**Parameters:**
- `position`: Object with z, x, y, ar values

**Returns:** CSS string for width, height, left, and top

### measure(src)
Gets the aspect ratio of an image by loading it.

**Parameters:**
- `src`: Image source URL

**Returns:** Promise that resolves to the aspect ratio

## Routing

### page()
Gets the current page from the URL hash (removes the # symbol).

**Example:**
- URL: `#/coffee` → Returns: `"coffee"`
- URL: `#/` → Returns: `""`

### filter()
Determines which category to filter products by.

**Returns:** "all", "coffee", or "flowers"

### route()
The main routing function that switches between pages.

**What it does:**
1. Gets the current page from the URL
2. Determines which view to show (login, forgot, or shop)
3. Shows/hides the correct sections
4. Clears any error messages
5. If showing shop:
   - Loads products from the API
   - Renders the product grid
   - Updates navigation highlighting
   - Scrolls to the correct position

## Shop Display

### ICON_EDIT, ICON_DEL
SVG icons for the edit and delete buttons.

### TITLES
Object mapping category codes to page titles:
```javascript
{
  all: "All products",
  coffee: "Coffee",
  flowers: "Flowers"
}
```

### renderShop(cat)
Renders the product grid for a given category.

**Parameters:**
- `cat`: Category to filter by ("all", "coffee", or "flowers")

**What it does:**
1. Shows/hides UI elements based on login status
2. Filters products by category
3. Updates page title and count
4. Generates HTML for product cards
5. Displays "No products yet" if empty

## Mobile Menu

### setMenu(open)
Opens or closes the mobile menu.

**Parameters:**
- `open`: True to open, false to close

## Image Editor

### ed
Object storing the current state of the image editor:
- `src`: Image data URL
- `ar`: Aspect ratio
- `z`: Zoom level
- `x`: Horizontal position
- `y`: Vertical position

### frame
Reference to the image frame DOM element.

### setSrc()
Sets the image source for both the editor and preview views.

### paint()
Updates the image display based on current position settings.

**What it does:**
1. Calculates dimensions
2. Keeps image within frame bounds
3. Applies CSS to position the image
4. Updates the zoom percentage display
5. Enables/disables control buttons

### zoom(step)
Zooms in or out by a given step.

**Parameters:**
- `step`: Amount to zoom (positive = in, negative = out)

**What it does:**
1. Calculates new zoom level (between 1 and 3)
2. Adjusts x and y to keep the same point centered
3. Updates the display

### Dragging
The image can be dragged with the mouse or touch:

- `onpointerdown`: Starts dragging
- `onpointermove`: Updates position while dragging
- `onpointerup`: Stops dragging
- `onpointercancel`: Cancels dragging
- `onkeydown`: Allows arrow key navigation

### Button Handlers
- `zoomIn`: Zooms in by 0.1
- `zoomOut`: Zooms out by 0.1
- `resetImg`: Resets position to center and zoom to 1
- `pickBtn`: Opens file picker
- `file.onchange`: Handles file upload

## Product Modal

### openModal(product)
Opens the modal to add or edit a product.

**Parameters:**
- `product`: Product object (null = adding new)

**What it does:**
1. Sets editingId
2. Resets the form
3. Sets the modal title
4. Fills in product data if editing
5. Sets up the image editor
6. Shows the modal

### addBtn.onclick
Opens the modal to add a new product.

### cancel.onclick
Closes the modal without saving.

### grid.onclick
Handles clicks on edit and delete buttons in the product grid.

**What it does:**
- If edit button clicked: Opens modal with that product
- If delete button clicked: Confirms and deletes the product

### productForm.onsubmit
Handles form submission when saving a product.

**What it does:**
1. Collects form data
2. Calls the API to save (POST for new, PUT for update)
3. Updates the local products array
4. Closes the modal
5. Re-renders the shop

## Authentication

### loginForm.onsubmit
Handles login form submission.

**What it does:**
1. Sends username and password to the API
2. If successful, stores user info in session
3. Redirects to home page
4. If failed, shows error message

### forgotForm.onsubmit
Handles password reset form submission.

**What it does:**
1. Sends username, new password, and confirmation to API
2. If successful, redirects to login page
3. If failed, shows error message

### avatar.onclick
Toggles the logout button visibility.

### logout.onclick
Handles logout.

**What it does:**
1. Calls the logout API
2. Clears the session
3. Re-routes the page

## Event Listeners

### hashchange
Listens for URL hash changes and calls route() to update the page.

## Initialization

The last line `route()` is called when the page loads to show the initial page.
