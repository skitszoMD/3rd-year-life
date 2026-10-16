# Quick Reference

A quick lookup guide for common tasks in the Flora & Froth project.

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Frontend HTML | `index.html` | Website structure |
| Frontend JS | `app.js` | All JavaScript logic |
| Styles | `style.css` | All styling |
| DB Config | `config.php` | Database connection |
| DB Schema | `database.sql` | Table creation |
| Login API | `api/login.php` | User authentication |
| Products API | `api/products.php` | Product CRUD |
| Logout API | `api/logout.php` | Session destruction |
| Password Reset | `api/reset_password.php` | Change password |
| CORS Config | `api/.htaccess` | API access control |

## API Endpoints

### Authentication
```
POST /api/login
Body: { username, password }
Response: { success, user: { name, admin } }

POST /api/logout
Response: { success }
```

### Products
```
GET /api/products
Response: [products array]

GET /api/products?category=flowers
Response: [filtered products]

POST /api/products (admin only)
Body: { cat, name, desc, price, img, pos }
Response: { success, id }

PUT /api/products (admin only)
Body: { id, cat, name, desc, price, img, pos }
Response: { success }

DELETE /api/products?id={id} (admin only)
Response: { success }
```

### Password Reset
```
POST /api/reset_password
Body: { username, password, confirm }
Response: { success }
```

## Database Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key, auto increment |
| username | VARCHAR(50) | Unique |
| password | VARCHAR(255) | Bcrypt hash |
| is_admin | TINYINT(1) | 0 or 1 |
| created_at | TIMESTAMP | Auto |

### products
| Column | Type | Notes |
|--------|------|-------|
| id | VARCHAR(50) | Primary key |
| category | ENUM | 'flowers' or 'coffee' |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Price |
| image | LONGTEXT | Base64 image |
| zoom | DECIMAL(5,2) | Image zoom |
| x, y | DECIMAL(10,6) | Image position |
| aspect_ratio | DECIMAL(10,6) | Image ratio |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto on update |

## Default Login

```
Username: admin
Password: admin
```

## URL Routes

| URL | Page |
|-----|------|
| #/ | Home (all products) |
| #/coffee | Coffee products |
| #/flowers | Flower products |
| #/about | About section |
| #/login | Login page |
| #/forgotpass | Password reset |

## JavaScript Functions

### Helper Functions
- `$(selector)` - Get DOM element
- `esc(text)` - Escape HTML (prevent XSS)
- `api(endpoint, options)` - Make API call

### Routing
- `page()` - Get current page from URL
- `filter()` - Get category filter
- `route()` - Main routing function

### Display
- `renderShop(cat)` - Render product grid
- `setMenu(open)` - Toggle mobile menu

### Image Editor
- `dims(z, ar)` - Calculate image dimensions
- `frameStyle(pos)` - Get CSS for image position
- `measure(src)` - Get image aspect ratio
- `paint()` - Update image display
- `zoom(step)` - Zoom in/out

### Products
- `openModal(product)` - Open add/edit modal

## Common Tasks

### Add a new product
1. Login as admin
2. Click "+ Add product" button
3. Fill in form
4. Upload and position image
5. Click "Save"

### Edit a product
1. Login as admin
2. Click edit icon on product card
3. Make changes
4. Click "Save"

### Delete a product
1. Login as admin
2. Click delete icon on product card
3. Confirm deletion

### Reset password
1. Go to #/forgotpass
2. Enter username
3. Enter new password twice
4. Click "Done"

### Change database password
Edit `config.php`:
```php
define('DB_PASS', 'your_new_password');
```

### Recreate database
1. Drop the `flora_froth` database in phpMyAdmin
2. Run the `database.sql` script

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid input) |
| 401 | Unauthorized (wrong password) |
| 403 | Forbidden (not admin) |
| 404 | Not found (user doesn't exist) |
| 405 | Method not allowed |
| 500 | Server error |

## Troubleshooting

### Can't login
- Check MySQL is running in XAMPP
- Verify database exists
- Check username/password in config.php

### Products not loading
- Check browser console for errors
- Verify API files are in api/ folder
- Check .htaccess is present

### Images not saving
- Check image size (LONGTEXT has limits)
- Verify database connection
- Check browser console for errors

### CORS errors
- Ensure .htaccess is in api/ folder
- Check Apache mod_headers is enabled
- Verify mod_rewrite is enabled
