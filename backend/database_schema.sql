-- ============================================
-- Simple Accounting Format Database Schema
-- ============================================
-- Created: November 10, 2025
-- Description: Complete database schema for SME accounting system
-- ============================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS nssf_contributions CASCADE;
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;

-- ============================================
-- 1. SUPPLIERS TABLE
-- ============================================
CREATE TABLE suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    vat_tin VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_suppliers_name ON suppliers(name);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    current_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    average_cost DECIMAL(15, 2) DEFAULT 0.00,
    selling_price DECIMAL(15, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ============================================
-- 3. STAFF TABLE
-- ============================================
CREATE TABLE staff (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name_khmer VARCHAR(255),
    name_english VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    date_of_birth DATE,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    position VARCHAR(100),
    department VARCHAR(100),
    salary_riel DECIMAL(15, 2) DEFAULT 0.00,
    salary_usd DECIMAL(15, 2) DEFAULT 0.00,
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_staff_name_english ON staff(name_english);
CREATE INDEX idx_staff_is_active ON staff(is_active);

-- ============================================
-- 4. PURCHASES TABLE
-- ============================================
CREATE TABLE purchases (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    invoice VARCHAR(100) NOT NULL,
    supplier_id VARCHAR(50) REFERENCES suppliers(id) ON DELETE RESTRICT,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
    vat_tin VARCHAR(50),
    description TEXT NOT NULL,
    quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
    cost DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    
    -- Expense categories
    assets DECIMAL(15, 2) DEFAULT 0.00,
    goods_for_sale DECIMAL(15, 2) DEFAULT 0.00,
    services DECIMAL(15, 2) DEFAULT 0.00,
    staff_cost DECIMAL(15, 2) DEFAULT 0.00,
    utilities DECIMAL(15, 2) DEFAULT 0.00,
    rental DECIMAL(15, 2) DEFAULT 0.00,
    others DECIMAL(15, 2) DEFAULT 0.00,
    
    sales_tax DECIMAL(15, 2) DEFAULT 0.00,
    exchange_rate DECIMAL(10, 2) DEFAULT 4100.00,
    total_amount DECIMAL(15, 2) GENERATED ALWAYS AS (
        (quantity * cost) + sales_tax
    ) STORED,
    total_riel DECIMAL(15, 2) GENERATED ALWAYS AS (
        ((quantity * cost) + sales_tax) * exchange_rate
    ) STORED,
    
    staff_user VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Paid', 'Cancelled')),
    
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_purchases_date ON purchases(date);
CREATE INDEX idx_purchases_invoice ON purchases(invoice);
CREATE INDEX idx_purchases_supplier_id ON purchases(supplier_id);
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_type ON purchases(type);

-- ============================================
-- 5. SALES TABLE
-- ============================================
CREATE TABLE sales (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    invoice VARCHAR(100) NOT NULL,
    customer VARCHAR(255) NOT NULL,
    vat_tin VARCHAR(50),
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
    cost DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    
    -- Revenue categories
    goods DECIMAL(15, 2) DEFAULT 0.00,
    services DECIMAL(15, 2) DEFAULT 0.00,
    others DECIMAL(15, 2) DEFAULT 0.00,
    
    sales_tax DECIMAL(15, 2) DEFAULT 0.00,
    cgs DECIMAL(15, 2) DEFAULT 0.00, -- Cost of Goods Sold
    
    total_amount DECIMAL(15, 2) GENERATED ALWAYS AS (
        goods + services + others + sales_tax
    ) STORED,
    gross_profit DECIMAL(15, 2) GENERATED ALWAYS AS (
        (goods + services + others) - cgs
    ) STORED,
    
    seller VARCHAR(255) NOT NULL,
    exchange_rate DECIMAL(10, 2) DEFAULT 4100.00,
    total_riel DECIMAL(15, 2) GENERATED ALWAYS AS (
        (goods + services + others + sales_tax) * exchange_rate
    ) STORED,
    
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Partial')),
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_invoice ON sales(invoice);
CREATE INDEX idx_sales_customer ON sales(customer);
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_seller ON sales(seller);
CREATE INDEX idx_sales_payment_status ON sales(payment_status);

-- ============================================
-- 6. RENTALS TABLE
-- ============================================
CREATE TABLE rentals (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    object TEXT NOT NULL,
    invoice VARCHAR(100),
    amount_usd DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    exchange_rate DECIMAL(10, 2) DEFAULT 4100.00,
    amount_riel DECIMAL(15, 2) GENERATED ALWAYS AS (
        amount_usd * exchange_rate
    ) STORED,
    
    payment_status VARCHAR(20) DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Partial')),
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_rentals_date ON rentals(date);
CREATE INDEX idx_rentals_recipient ON rentals(recipient);
CREATE INDEX idx_rentals_payment_status ON rentals(payment_status);

-- ============================================
-- 7. NSSF CONTRIBUTIONS TABLE
-- ============================================
CREATE TABLE nssf_contributions (
    id VARCHAR(50) PRIMARY KEY,
    staff_id VARCHAR(50) REFERENCES staff(id) ON DELETE CASCADE,
    period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INTEGER NOT NULL,
    
    base_salary DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    employer_contribution DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    employee_contribution DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_contribution DECIMAL(15, 2) GENERATED ALWAYS AS (
        employer_contribution + employee_contribution
    ) STORED,
    
    payment_status VARCHAR(20) DEFAULT 'Unpaid' CHECK (payment_status IN ('Paid', 'Unpaid')),
    payment_date DATE,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(staff_id, period_month, period_year)
);

-- Create indexes
CREATE INDEX idx_nssf_staff_id ON nssf_contributions(staff_id);
CREATE INDEX idx_nssf_period ON nssf_contributions(period_year, period_month);
CREATE INDEX idx_nssf_payment_status ON nssf_contributions(payment_status);

-- ============================================
-- 8. INVENTORY MOVEMENTS TABLE
-- ============================================
CREATE TABLE inventory_movements (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT')),
    quantity DECIMAL(15, 3) NOT NULL,
    reference_type VARCHAR(50), -- 'PURCHASE', 'SALE', 'ADJUSTMENT'
    reference_id VARCHAR(50), -- ID of the purchase/sale that caused this movement
    previous_stock DECIMAL(15, 3) NOT NULL,
    new_stock DECIMAL(15, 3) NOT NULL,
    unit_cost DECIMAL(15, 2) DEFAULT 0.00,
    notes TEXT,
    performed_by VARCHAR(255),
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_inventory_product_id ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movement_type ON inventory_movements(movement_type);
CREATE INDEX idx_inventory_reference ON inventory_movements(reference_type, reference_id);
CREATE INDEX idx_inventory_date ON inventory_movements(movement_date);

-- ============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nssf_updated_at BEFORE UPDATE ON nssf_contributions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Insert Suppliers
INSERT INTO suppliers (id, name, vat_tin) VALUES
('SUP001', 'General Supplier', NULL),
('SUP002', 'General Customer', NULL),
('SUP003', 'House Owner', NULL),
('SUP004', 'Staff', NULL),
('SUP005', 'NSSF', NULL),
('SUP006', 'EDC', NULL),
('SUP007', 'PPWSA', NULL),
('SUP008', 'Others', NULL);

-- Insert Products (iPhone models)
INSERT INTO products (id, name, category, unit) VALUES
('IP7P', 'iPhone 7 Plus', 'Smartphone', 'pcs'),
('IP8P', 'iPhone 8 Plus', 'Smartphone', 'pcs'),
('IPX', 'iPhone X', 'Smartphone', 'pcs'),
('IPXS', 'iPhone XS', 'Smartphone', 'pcs'),
('IPXSM', 'iPhone XS Max', 'Smartphone', 'pcs'),
('IP11', 'iPhone 11', 'Smartphone', 'pcs'),
('IP11P', 'iPhone 11 Pro', 'Smartphone', 'pcs'),
('IP11PM', 'iPhone 11 Pro Max', 'Smartphone', 'pcs'),
('IP12MN', 'iPhone 12 Mini', 'Smartphone', 'pcs'),
('IP12', 'iPhone 12', 'Smartphone', 'pcs'),
('IP12P', 'iPhone 12 Pro', 'Smartphone', 'pcs'),
('IP12PM', 'iPhone 12 Pro Max', 'Smartphone', 'pcs'),
('IP13MN', 'iPhone 13 Mini', 'Smartphone', 'pcs'),
('IP13', 'iPhone 13', 'Smartphone', 'pcs'),
('IP13P', 'iPhone 13 Pro', 'Smartphone', 'pcs'),
('IP13PM', 'iPhone 13 Pro Max', 'Smartphone', 'pcs'),
('IP14', 'iPhone 14', 'Smartphone', 'pcs'),
('IP14PR', 'iPhone 14 Pro', 'Smartphone', 'pcs'),
('IP14PM', 'iPhone 14 Pro Max', 'Smartphone', 'pcs'),
('IP15', 'iPhone 15', 'Smartphone', 'pcs'),
('IP15PL', 'iPhone 15 Plus', 'Smartphone', 'pcs'),
('IP15PR', 'iPhone 15 Pro', 'Smartphone', 'pcs'),
('IP15PM', 'iPhone 15 Pro Max', 'Smartphone', 'pcs'),
('IP16', 'iPhone 16', 'Smartphone', 'pcs'),
('IP16PL', 'iPhone 16 Plus', 'Smartphone', 'pcs'),
('IP16PR', 'iPhone 16 Pro', 'Smartphone', 'pcs'),
('IP16PM', 'iPhone 16 Pro Max', 'Smartphone', 'pcs'),
('IP17', 'iPhone 17', 'Smartphone', 'pcs'),
('IP17PR', 'iPhone 17 Pro', 'Smartphone', 'pcs'),
('IP17PM', 'iPhone 17 Pro Max', 'Smartphone', 'pcs'),
('IP17R', 'iPhone 17 Air', 'Smartphone', 'pcs');

-- Insert Staff
INSERT INTO staff (id, employee_id, name_khmer, name_english, gender, date_of_birth, salary_riel, salary_usd, hire_date, position, is_active) VALUES
('S001', 'EMP001', 'សុខ សុខ', 'Sok Sok', 'Male', '1990-01-15', 2000000, 500, '2020-01-01', 'Sales Manager', TRUE),
('S002', 'EMP002', 'ច័ន្ទ សុជាតា', 'Chan Socheata', 'Female', '1992-05-20', 2400000, 600, '2020-03-15', 'Sales Executive', TRUE);

-- Insert Sample Purchases
INSERT INTO purchases (id, date, type, invoice, supplier_id, product_id, vat_tin, description, quantity, unit, cost, assets, goods_for_sale, services, staff_cost, utilities, rental, others, sales_tax, exchange_rate, staff_user, status) VALUES
('PUR001', '2023-10-15', 'Goods', 'INV-P-001', 'SUP001', 'IP15PM', '12345', 'iPhone 15 Pro Max 256GB', 10, 'pcs', 1200, 0, 12000, 0, 0, 0, 0, 0, 1200, 4100, 'Sok Sok', 'Approved'),
('PUR002', '2023-10-20', 'Utilities', 'INV-P-002', 'SUP006', NULL, '67890', 'Electricity Bill', 1, 'month', 200, 0, 0, 0, 0, 200, 0, 0, 20, 4100, 'Admin', 'Paid');

-- Insert Sample Sales
INSERT INTO sales (id, date, invoice, customer, vat_tin, product_id, description, quantity, unit, cost, goods, services, others, sales_tax, cgs, seller, exchange_rate, payment_status, paid_amount) VALUES
('SALE001', '2023-10-25', 'INV-S-001', 'Customer A', NULL, 'IP15PM', 'iPhone 15 Pro Max 256GB', 2, 'pcs', 1350, 2700, 0, 0, 270, 2400, 'Chan Socheata', 4100, 'Paid', 2970),
('SALE002', '2023-10-28', 'INV-S-002', 'Customer B', NULL, 'IP15PR', 'iPhone 15 Pro 128GB', 1, 'pcs', 1100, 1100, 0, 0, 110, 980, 'Chan Socheata', 4100, 'Paid', 1210);

-- Insert Sample Rentals
INSERT INTO rentals (id, date, recipient, object, invoice, amount_usd, exchange_rate, payment_status, paid_amount) VALUES
('RENT001', '2023-09-30', 'លោក ឡូ វួយភាគ', 'Rental for Sep-2023', 'N/A', 1000, 4010, 'Paid', 1000);

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View for Purchase Summary
CREATE OR REPLACE VIEW v_purchase_summary AS
SELECT 
    p.*,
    s.name as supplier_name,
    pr.name as product_name,
    EXTRACT(YEAR FROM p.date) as year,
    EXTRACT(MONTH FROM p.date) as month
FROM purchases p
LEFT JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN products pr ON p.product_id = pr.id;

-- View for Sales Summary
CREATE OR REPLACE VIEW v_sales_summary AS
SELECT 
    s.*,
    p.name as product_name,
    EXTRACT(YEAR FROM s.date) as year,
    EXTRACT(MONTH FROM s.date) as month
FROM sales s
LEFT JOIN products p ON s.product_id = p.id;

-- View for Monthly Revenue
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
    EXTRACT(YEAR FROM date) as year,
    EXTRACT(MONTH FROM date) as month,
    COUNT(*) as total_sales,
    SUM(goods) as total_goods,
    SUM(services) as total_services,
    SUM(others) as total_others,
    SUM(sales_tax) as total_tax,
    SUM(total_amount) as total_revenue,
    SUM(cgs) as total_cgs,
    SUM(gross_profit) as total_profit
FROM sales
GROUP BY year, month
ORDER BY year DESC, month DESC;

-- View for Monthly Expenses
CREATE OR REPLACE VIEW v_monthly_expenses AS
SELECT 
    EXTRACT(YEAR FROM date) as year,
    EXTRACT(MONTH FROM date) as month,
    COUNT(*) as total_purchases,
    SUM(assets) as total_assets,
    SUM(goods_for_sale) as total_goods,
    SUM(services) as total_services,
    SUM(staff_cost) as total_staff_cost,
    SUM(utilities) as total_utilities,
    SUM(rental) as total_rental,
    SUM(others) as total_others,
    SUM(sales_tax) as total_tax,
    SUM(total_amount) as total_expenses
FROM purchases
WHERE status != 'Cancelled'
GROUP BY year, month
ORDER BY year DESC, month DESC;

-- View for Inventory Status
CREATE OR REPLACE VIEW v_inventory_status AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.current_stock,
    p.min_stock_level,
    p.unit,
    p.average_cost,
    p.selling_price,
    (p.current_stock * p.average_cost) as inventory_value,
    CASE 
        WHEN p.current_stock <= p.min_stock_level THEN 'Low Stock'
        WHEN p.current_stock = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status
FROM products p
WHERE p.is_active = TRUE;

-- ============================================
-- COMPLETED
-- ============================================

-- Display completion message
SELECT 'Database schema created successfully!' as status;
