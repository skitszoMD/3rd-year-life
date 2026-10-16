# Database Documentation

This document explains the database structure and how data is stored.

## Database Overview

**Database Name:** `flora_froth`

**Engine:** InnoDB (supports transactions and foreign keys)

**Character Set:** utf8mb4 (supports full Unicode including emojis)

## Tables

### users

Stores user account information and authentication data.

#### Columns

| Column | Type | Description |
|--------|------|-------------|
| id | INT (Primary Key, Auto Increment) | Unique numeric ID for each user |
| username | VARCHAR(50), Unique | Username for login (must be unique) |
| password | VARCHAR(255) | Hashed password (bcrypt) |
| is_admin | TINYINT(1) | 1 = admin user, 0 = regular user |
| created_at | TIMESTAMP | When the account was created |

#### Indexes
- Primary key on `id`
- Unique index on `username` (prevents duplicate usernames)

#### Default Data
The database includes one default admin user:
- Username: `admin`
- Password: `admin` (stored as bcrypt hash)
- is_admin: 1

#### Security Notes
- Passwords are never stored in plain text
- bcrypt hashing automatically adds a random salt
- The hash is 60 characters long, hence VARCHAR(255)

### products

Stores all flower and coffee products.

#### Columns

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) (Primary Key) | Unique ID (e.g., "p1234567890") |
| category | ENUM('flowers', 'coffee') | Product category |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10, 2) | Price (e.g., 25.00) |
| image | LONGTEXT | Base64 encoded image data |
| zoom | DECIMAL(5, 2) | Image zoom level (1.00 to 3.00) |
| x | DECIMAL(10, 6) | Image horizontal position (-0.5 to 0.5) |
| y | DECIMAL(10, 6) | Image vertical position (-0.5 to 0.5) |
| aspect_ratio | DECIMAL(10, 6) | Image aspect ratio (width/height) |
| created_at | TIMESTAMP | When product was added |
| updated_at | TIMESTAMP | Last time product was modified |

#### Indexes
- Primary key on `id`

#### Image Positioning Explained

Instead of actually cropping images, we store positioning data:

- **zoom**: How much to zoom in (1 = fills frame, 3 = 3x zoom)
- **x, y**: How far to shift from center (as fraction of frame)
- **aspect_ratio**: Original image's width/height ratio

**Example:**
- zoom: 1.5, x: 0.1, y: -0.2
- Means: Zoomed 1.5x, shifted 10% right, 20% up from center

This allows images to be repositioned without actually modifying the image file. The frontend uses these values to generate CSS that positions the image correctly.

#### Why Base64 for Images?

Images are stored as Base64 encoded strings in the LONGTEXT field.

**Pros:**
- Simple to implement
- No need for separate file storage
- All data in one database

**Cons:**
- Larger file size (Base64 is ~33% larger)
- Database bloat with many large images
- Slower queries with large data

**Alternative:** For production, consider storing images as files and only storing the file path in the database.

#### Price Field

DECIMAL(10, 2) means:
- 10 total digits
- 2 decimal places
- Can store values from -99999999.99 to 99999999.99

**Example values:**
- 5.00
- 25.50
- 999.99

## Relationships

The tables are currently independent (no foreign keys). This is because:
- Users don't own products (any admin can manage all products)
- Products don't reference users

If you wanted to track who created each product, you could add:
```sql
ALTER TABLE products ADD COLUMN created_by INT;
ALTER TABLE products ADD FOREIGN KEY (created_by) REFERENCES users(id);
```

## Creating the Database

Run the `database.sql` file in phpMyAdmin or from command line:

```bash
mysql -u root < database.sql
```

This will:
1. Create the database if it doesn't exist
2. Create the users table
3. Create the products table
4. Insert the default admin user

## Backing Up the Database

### Using phpMyAdmin
1. Open phpMyAdmin
2. Select the `flora_froth` database
3. Click "Export" tab
4. Choose "Quick" export method
5. Click "Go"

### Using Command Line
```bash
mysqldump -u root flora_froth > backup.sql
```

### Restoring from Backup
```bash
mysql -u root flora_froth < backup.sql
```

## Common Queries

### Get all products for a category
```sql
SELECT * FROM products WHERE category = 'flowers' ORDER BY created_at DESC;
```

### Get user by username
```sql
SELECT * FROM users WHERE username = 'admin';
```

### Count products by category
```sql
SELECT category, COUNT(*) as count FROM products GROUP BY category;
```

### Search products by name
```sql
SELECT * FROM products WHERE name LIKE '%rose%';
```

## Performance Considerations

### Indexes
Currently, only primary keys are indexed. For better performance with large datasets, consider adding:

```sql
-- Index on category for faster filtering
CREATE INDEX idx_category ON products(category);

-- Index on created_at for sorting
CREATE INDEX idx_created_at ON products(created_at DESC);

-- Index on username for faster login
CREATE INDEX idx_username ON users(username);
```

### Image Storage
With many products, storing images in the database can slow down queries. Consider:
- Moving images to file system
- Storing only file paths in database
- Using a CDN for image delivery

### Data Types
- LONGTEXT can hold up to 4GB (for images)
- For most use cases, this is overkill
- Consider MEDIUMTEXT (16MB) if images are smaller
