# PRMS Frontend

A modern React frontend for the Patient Record Management System (PRMS).

## Features
- User authentication (signup, login, password reset)
- Role-based dashboards (Admin, Doctor, Patient, Staff)
- Patient and appointment management
- Medical history and reporting
- Responsive, accessible UI with custom 404 page

## Prerequisites
- **Node.js** (v18 or newer recommended)
- **npm** (v9 or newer) or **yarn**
- The PRMS backend running locally or accessible via network

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url> && cd prms-frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure environment (optional)
- By default, the frontend expects the backend at `http://localhost:5000`.
- To change the backend URL, edit `src/services/apiService.js` (`API_BASE_URL`).
- If you use environment variables, create a `.env` file and use [dotenv](https://www.npmjs.com/package/dotenv) or similar.

### 4. Run the development server
```bash
npm start
# or
yarn start
```
- The app will be available at [http://localhost:3000](http://localhost:3000) by default.

### 5. Build for production
```bash
npm run build
# or
yarn build
```
- Output will be in the `build/` directory.

## Project Structure
```
prms-frontend/
├── public/           # Static files (index.html, favicon, etc)
├── src/
│   ├── assets/       # Images, icons, etc
│   ├── components/   # Reusable React components
│   ├── contexts/     # React context providers (Auth, etc)
│   ├── hooks/        # Custom React hooks
│   ├── models/       # Data models/types
│   ├── pages/        # Top-level pages (Login, Register, Dashboards, NotFound)
│   ├── routes/       # AppRoutes and route logic
│   ├── services/     # API service layer
│   ├── styles/       # CSS files
│   └── utils/        # Utility functions
├── package.json
├── README.md
└── ...
```

## Troubleshooting
- **CORS errors:** Ensure your backend allows requests from the frontend origin (see backend CORS settings).
- **404 or blank pages:** Make sure the backend is running and accessible at the configured URL. Check your browser console for errors.
- **.env not working:** Double-check variable names and restart the dev server after changes.



**Happy coding!**