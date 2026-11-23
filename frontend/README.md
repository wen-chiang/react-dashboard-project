# Frontend README

## Getting Started

This is the React + Vite frontend for the Dashboard application.

### Prerequisites

- Node.js 18+ with npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── services/       # API and WebSocket services
├── store/          # Zustand state management
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── assets/         # Images and static files
├── constants.js    # Application constants
├── App.jsx         # Main App component
├── main.jsx        # React entry point
└── index.css       # Global styles
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:8080/api
```

## Technologies

- React 18
- Vite
- React Router v6
- Axios
- Zustand
- Bootstrap 5
- Recharts
- React-Toastify
- SockJS & Stomp.js

## Features

- Dashboard with analytics
- Order management (CRUD)
- Customer management (CRUD)
- Global search
- Real-time notifications via WebSocket
- Dark/Light theme
- Responsive design
- Form validation

## API Integration

The frontend communicates with the backend via REST API at `http://localhost:8080/api`.

Authentication is done via HTTP Basic Auth using credentials stored in localStorage.

### Available API Endpoints

- `GET /api/dashboard` - Dashboard data
- `GET/POST/PUT/DELETE /api/orders` - Order CRUD
- `GET/POST/PUT/DELETE /api/customers` - Customer CRUD
- `GET /api/search` - Search orders and customers
- `WS /ws` - WebSocket for real-time updates

## Notes

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Ensure backend is running on `http://localhost:8080`
