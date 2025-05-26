import mysql.connector
import sqlite3

# MySQL connection
mysql_conn = mysql.connector.connect(
    host='127.0.0.1',
    port=3306,
    user='root',
    password='',
    database='si10a'
)
mysql_cursor = mysql_conn.cursor(dictionary=True)

# SQLite connection
sqlite_conn = sqlite3.connect('example.db')
sqlite_cursor = sqlite_conn.cursor()

# Create tables in SQLite
sqlite_cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    created_at TEXT
)
""")
sqlite_cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT,
    price REAL,
    stock INTEGER,
    created_at TEXT
)
""")
sqlite_cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    status TEXT,
    total REAL,
    created_at TEXT
)
""")
sqlite_cursor.execute("""
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL
)
""")

# Migrate users
mysql_cursor.execute("SELECT id, name, email, created_at FROM users")
for row in mysql_cursor.fetchall():
    sqlite_cursor.execute(
        "INSERT OR IGNORE INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)",
        (row['id'], row['name'], row['email'], str(row['created_at']))
    )

# Migrate products
mysql_cursor.execute("SELECT id, name, description, price, stock, created_at FROM products")
for row in mysql_cursor.fetchall():
    sqlite_cursor.execute(
        "INSERT OR IGNORE INTO products (id, name, description, price, stock, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (row['id'], row['name'], row['description'], float(row['price']), row['stock'], str(row['created_at']))
    )

# Migrate orders
mysql_cursor.execute("SELECT id, user_id, status, total, created_at FROM orders")
for row in mysql_cursor.fetchall():
    sqlite_cursor.execute(
        "INSERT OR IGNORE INTO orders (id, user_id, status, total, created_at) VALUES (?, ?, ?, ?, ?)",
        (row['id'], row['user_id'], str(row['status']), float(row['total']), str(row['created_at']))
    )

# Migrate order_items
mysql_cursor.execute("SELECT id, order_id, product_id, quantity, price FROM order_items")
for row in mysql_cursor.fetchall():
    sqlite_cursor.execute(
        "INSERT OR IGNORE INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
        (row['id'], row['order_id'], row['product_id'], row['quantity'], float(row['price']))
    )

sqlite_conn.commit()

# Close connections
mysql_cursor.close()
mysql_conn.close()
sqlite_cursor.close()
sqlite_conn.close()

print("Migration completed successfully.")