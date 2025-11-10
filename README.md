# Simple Accounting Format (SAF)

A comprehensive accounting management system built with React, TypeScript, and Vite.

## Features

- 📊 Dashboard with sales/purchase analytics
- 🛒 Purchase management with Excel import/export
- 💰 Sales tracking with Excel import/export
- 📦 Inventory management
- 🏷️ Product catalog with pricing
- 👥 Supplier management with payment tracking
- 👨‍💼 Staff management with salary calculations
- 🏠 Rental tracking
- 📈 Reports and analytics
- 💾 Data persistence with localStorage

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Excel**: SheetJS (xlsx)
- **Alerts**: SweetAlert2

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Picheth/simpleaccountingformat3110.git
cd simpleaccountingformat3110
```

2. Install dependencies
```bash
cd frontend
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

## Deployment

### Deploy to Vercel

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Features Overview

### Purchase Management
- Add, edit, delete purchases
- Import/export Excel files
- Track by supplier, date, type
- Multiple expense categories

### Sales Management
- Record sales transactions
- Product-based sales tracking
- Excel import/export
- Customer information

### Inventory
- Real-time stock tracking
- Purchase/sale history
- Low stock alerts

### Suppliers
- Manage supplier database
- Track total payments by period
- View purchase history
- Monthly/yearly filtering

### Staff Management
- Employee records
- Salary calculations
- Pension deductions (2%)
- Search functionality

## Data Storage

This application uses browser localStorage for data persistence. All data is stored locally in your browser.

## License

MIT

## Author

Picheth
