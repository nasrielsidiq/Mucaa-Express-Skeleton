# Database Initialization & Seeding Guide

## 📁 Structure

```
config/
├── initializers/
│   ├── 00_TEMPLATE.js          # Template for creating new tables
│   ├── 01_users_table.js       # Users table initialization
│   └── index.js                # Initializers orchestrator
├── seeders/
│   ├── 00_TEMPLATE.js          # Template for creating new seeders
│   ├── 01_users_seeder.js      # Users seeding data
│   └── index.js                # Seeders orchestrator
├── cli/
│   ├── init.js                 # CLI to run initializers
│   ├── seed.js                 # CLI to run seeders
│   └── reset.js                # CLI to drop all tables
├── db.js                       # Database connection
└── db.init.js                  # Main init entry point
```

## 🚀 Usage

### Run Everything (Init + Seed)
```bash
npm run dev  # Runs automatically on server start
```

### Or separately:

#### Initialize Tables Only
```bash
npm run init:db
```

#### Seed Data Only
```bash
npm run seed:db
```

#### Drop All Tables
```bash
npm run reset:db
```

## ➕ Adding New Tables

1. Create a new file in `config/initializers/` (e.g., `02_products_table.js`):
```javascript
import pool from "../db.js";

export const initProductsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(150)        NOT NULL,
        price      DECIMAL(10,2)       NOT NULL,
        created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Products table initialized");
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};
```

2. Add to `config/initializers/index.js`:
```javascript
import { initUsersTable } from "./01_users_table.js";
import { initProductsTable } from "./02_products_table.js";

const initializers = [initUsersTable, initProductsTable];
```

## ➕ Adding New Seeders

1. Create a new file in `config/seeders/` (e.g., `02_products_seeder.js`):
```javascript
import pool from "../db.js";

export const seedProducts = async () => {
  try {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM products");
    
    if (count > 0) {
      console.log("⏭️  Products already seeded, skipping...");
      return;
    }

    const products = [
      { name: "Product 1", price: 100 },
      { name: "Product 2", price: 200 },
    ];

    for (const product of products) {
      await pool.query(
        "INSERT INTO products (name, price) VALUES (?, ?)",
        [product.name, product.price]
      );
    }

    console.log("✅ Products seeded successfully");
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};
```

2. Add to `config/seeders/index.js`:
```javascript
import { seedUsers } from "./01_users_seeder.js";
import { seedProducts } from "./02_products_seeder.js";

const seeders = [seedUsers, seedProducts];
```

## 💡 Notes

- Initializers run in order (use sequential numbering: 01, 02, 03...)
- Seeders skip if data exists (idempotent)
- Use the `00_TEMPLATE.js` files as reference for new modules
- All initializers run before seeders
