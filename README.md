# BESS Systems - Energy Management Portal 🔋⚡

A beautiful, modern demo website for a residential energy management system with smart meter monitoring, wallet management, and admin dashboard.

## Features ✨

- **🔐 Authentication**: OTP and Email login with multiple user roles
- **📊 Smart Meter Dashboard**: Odometer-style meter display with real-time usage charts
- **💰 Wallet Management**: Transaction history, spending trends, balance tracking
- **💳 Payment Gateway**: Demo payment integration with multiple payment methods
- **📄 Invoices**: Monthly billing statements with detailed breakdowns
- **🔔 Notifications**: Alert system for balance, billing, and system events
- **👤 Profile Management**: User details, flat switching, tenant management
- **⚙️ Admin Dashboard**: Society management, billing configuration, notices, DG log

## Tech Stack 🛠️

- **React 18** - UI Framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons (ready to use)

## Getting Started 🚀

### Prerequisites
- Node.js 16+ and npm installed
- VS Code (optional, but recommended)

### Installation

1. **Open the project folder in VS Code:**
   ```bash
   cd bess-portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will automatically open in your browser at `http://localhost:3000`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Demo Credentials 🎮

All login credentials are demo credentials - use any values:

### OTP Login:
- Phone: Any 10 digits
- OTP: `1234`

### Email Login:
- Email: Any email address
- Password: Any password

### User Roles:
- **Resident** - Full portal access (default)
- **Admin** - Society management
- **Super Admin** - System-wide configuration

## Project Structure 📁

```
bess-portal/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx          # Authentication
│   │   ├── DashboardPage.jsx      # Home screen
│   │   ├── MeterPage.jsx          # Smart meter (signature feature)
│   │   ├── WalletPage.jsx         # Transactions & balance
│   │   ├── PaymentPage.jsx        # Payment gateway demo
│   │   ├── InvoicesPage.jsx       # Monthly bills
│   │   ├── NotificationsPage.jsx  # Alerts
│   │   ├── ProfilePage.jsx        # User settings
│   │   └── AdminDashboard.jsx     # Admin panel
│   ├── App.jsx                    # Main app & routing
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies
└── README.md                       # This file
```

## Key Features Explained 🎯

### 🌟 Smart Meter Dashboard
The signature feature with an odometer-style digital display showing:
- Grid (Mains) meter reading
- DG (Diesel Generator) meter reading
- Live load monitoring with visual progress bars
- Daily/Monthly usage charts with cost breakdown
- Consumption statistics

### 💳 Payment Demo
Includes:
- Preset amount selection (₹500 - ₹10,000)
- Custom amount input
- Multiple payment methods (UPI, Card, Net Banking, Wallets)
- Payment gateway UI simulation
- Success receipt with transaction details

### 📊 Dashboard Widgets
- Quick access tiles for all major features
- Notice board with society announcements
- Low balance alert notification
- Transaction quick view

### 👨‍💼 Admin Panel
- View all flats with balance and consumption
- Post society notices
- Configure billing rates and alert thresholds
- View DG usage log
- Flat management and billing overview

## Design Highlights 🎨

- **Color Scheme**: Energy blue (#0066FF) with complementary colors
- **Typography**: Modern sans-serif (Inter) with clear hierarchy
- **Responsive**: Works on mobile, tablet, and desktop
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper focus states and keyboard navigation

## Browser Support 🌐

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips for Development 💡

1. **Modify Colors**: Update `tailwind.config.js`
2. **Add New Pages**: Create new file in `src/pages/` and import in `App.jsx`
3. **Change Styling**: Edit `src/index.css` or use Tailwind classes
4. **Mock Data**: Update data arrays in individual page components
5. **Add Icons**: Use emoji or import from lucide-react

## Demo Data Notes 📝

- All data is hardcoded for demo purposes
- No backend API calls
- Payment processing is simulated
- User data persists in localStorage during the session
- Meter readings and transactions are static demo data

## Future Enhancements 🔮

- Connect to real backend API
- Implement actual payment gateway
- Add SMS/Email notifications
- Real-time meter data integration
- Mobile app version
- Analytics dashboard
- Multi-language support
- Dark mode

## Support & Questions ❓

For issues or questions:
1. Check the code comments
2. Refer to Tailwind CSS docs: https://tailwindcss.com
3. React docs: https://react.dev
4. Vite docs: https://vitejs.dev

## License 📜

This demo is for educational and evaluation purposes.

---

**Made with ⚡ for Smart Energy Management**

Built with React, Vite, and Tailwind CSS
hi
