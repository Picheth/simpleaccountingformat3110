# Database Setup Guide

This document explains how to set up the database for the Simple Accounting Format application.

## Overview

The application uses **PostgreSQL** as the database and **Prisma** as the ORM (Object-Relational Mapping) tool.

## Database Schema

The database includes the following tables:

### Core Tables
1. **suppliers** - Supplier/vendor information
2. **products** - Product catalog (iPhone models, etc.)
3. **staff** - Employee information
4. **purchases** - Purchase transactions with expense categorization
5. **sales** - Sales transactions with revenue categorization
6. **rentals** - Rental payment records
7. **nssf_contributions** - NSSF (National Social Security Fund) contributions
8. **inventory_movements** - Inventory tracking and movements

### Key Features
- ✅ Automatic timestamp tracking (created_at, updated_at)
- ✅ Foreign key relationships and constraints
- ✅ Calculated fields (total amounts, gross profit)
- ✅ Indexes for performance optimization
- ✅ Default values and data validation
- ✅ Views for reporting (monthly revenue, expenses, inventory status)

## Setup Options

### Option 1: Using Raw SQL (Recommended for production)

1. **Ensure PostgreSQL is installed and running**

2. **Create a new database:**
   ```bash
   createdb accounting_db
   ```

3. **Run the SQL schema:**
   ```bash
   psql -d accounting_db -f database_schema.sql
   ```

4. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/accounting_db"
   ```

### Option 2: Using Prisma (Recommended for development)

1. **Start Prisma Dev Server (if using local Prisma Postgres):**
   ```bash
   npx prisma dev
   ```

2. **Update your `.env` file** with the connection string provided by Prisma dev

3. **Run Prisma migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

### Option 3: Using existing PostgreSQL database

1. **Update `.env` with your database credentials:**
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database_name"
   ```

2. **Apply the schema using SQL:**
   ```bash
   psql -d your_database -f database_schema.sql
   ```

   **OR use Prisma:**
   ```bash
   npx prisma db push
   ```

## Initial Data

The `database_schema.sql` file includes initial seed data:
- 8 Suppliers (General Supplier, EDC, PPWSA, etc.)
- 31 Products (iPhone models from 7 Plus to 17 Air)
- 2 Staff members
- Sample purchases, sales, and rental records

## Database Views

Pre-built views for reporting:

- **v_purchase_summary** - Purchase details with supplier and product names
- **v_sales_summary** - Sales details with product information
- **v_monthly_revenue** - Monthly revenue breakdown
- **v_monthly_expenses** - Monthly expense breakdown
- **v_inventory_status** - Current inventory status with stock alerts

### Using Views:
```sql
-- Get monthly revenue
SELECT * FROM v_monthly_revenue WHERE year = 2024;

-- Check low stock items
SELECT * FROM v_inventory_status WHERE stock_status = 'Low Stock';
```

## Prisma Studio

To explore and manage your data visually:

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555`

## Common Commands

### Prisma Commands:
```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_of_change

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Check migration status
npx prisma migrate status
```

### PostgreSQL Commands:
```bash
# Connect to database
psql -d accounting_db

# List all tables
\dt

# Describe a table
\d purchases

# Run a query
SELECT * FROM products LIMIT 10;

# Quit psql
\q
```

## Schema Highlights

### Purchase Table
- Categorizes expenses: Assets, Goods for Sale, Services, Staff Cost, Utilities, Rental, Others
- Status tracking: Pending → Approved → Paid
- Automatic calculation of totals in both USD and Riel

### Sales Table
- Revenue categories: Goods, Services, Others
- Automatic gross profit calculation
- Payment tracking (Paid, Unpaid, Partial)

### Inventory Movements
- Tracks all inventory changes (IN, OUT, ADJUSTMENT)
- Links to source transactions (purchases/sales)
- Maintains history with previous and new stock levels

## Troubleshooting

### Can't connect to database
- Check if PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env` file
- Ensure database exists: `psql -l`

### Migration errors
- Check for syntax errors in schema.prisma
- Reset if needed: `npx prisma migrate reset`
- Manually apply SQL if Prisma fails

### Prisma dev server issues
- Kill existing processes: `pkill -f "prisma dev"`
- Check port availability: `lsof -i :51213-51216`
- Clear ports if needed: `lsof -ti:51214 | xargs kill -9`

## Next Steps

After setting up the database:

1. ✅ Generate Prisma Client
2. ✅ Update your API endpoints to use Prisma instead of in-memory data
3. ✅ Test CRUD operations
4. ✅ Set up proper authentication and authorization
5. ✅ Configure backups for production

## Production Considerations

- Enable SSL/TLS for database connections
- Set up regular automated backups
- Implement connection pooling
- Add database monitoring
- Use environment-specific configurations
- Implement proper migration strategies
