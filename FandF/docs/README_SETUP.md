# Flora & Froth - MySQL Migration Setup

## Database Setup

1. **Start MySQL in XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Create the Database**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Click on the "SQL" tab
   - Copy and paste the contents of `database.sql`
   - Click "Go" to execute

   Or run from command line:
   ```bash
   mysql -u root < database.sql
   ```

3. **Verify Database**
   - In phpMyAdmin, you should see the `flora_froth` database
   - It should contain two tables: `users` and `products`
   - The `users` table should have one admin user with username `admin`

## Default Login

- **Username**: `admin`
- **Password**: `admin`

## File Structure

```
FandF/
├── api/
│   ├── .htaccess           (CORS headers)
│   ├── login.php           (Authentication)
│   ├── logout.php          (Session destruction)
│   ├── products.php        (Products CRUD)
│   └── reset_password.php  (Password reset)
├── config.php              (Database configuration)
├── database.sql            (Database schema)
├── index.html              (Frontend)
├── app.js                  (Frontend logic - updated for API)
└── style.css               (Styles)
```

## API Endpoints

### Authentication
- `POST /api/login` - Login (body: `{username, password}`)
- `POST /api/logout` - Logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=flowers` - Get products by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products` - Update product (admin only)
- `DELETE /api/products?id={id}` - Delete product (admin only)

### Password Reset
- `POST /api/reset_password` - Reset password (body: `{username, password, confirm}`)

## Configuration

If your MySQL password is not empty, edit `config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'flora_froth');
define('DB_USER', 'root');
define('DB_PASS', 'your_password'); // Change this
```

## Testing

1. Open your browser to: `http://localhost/FandF/`
2. Try logging in with `admin` / `admin`
3. Navigate to Home, Coffee, and Flowers sections
4. Add a new product (admin only)
5. Edit an existing product
6. Delete a product
7. Test password reset at `#/forgotpass`

## Troubleshooting

### Database connection error
- Make sure MySQL is running in XAMPP
- Check your MySQL password in `config.php`
- Verify the database name is `flora_froth`

### CORS errors
- Make sure `.htaccess` is in the `api/` folder
- Check that Apache mod_rewrite and mod_headers are enabled

### API returns 403 Forbidden
- Make sure you're logged in as admin
- Check that PHP sessions are working

### Images not saving
- MySQL LONGTEXT can hold up to 4GB of text data
- For very large images, consider storing files instead of base64
