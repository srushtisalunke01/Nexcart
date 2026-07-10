# NexCart Backend API

> Production-ready MERN e-commerce backend built with Node.js, Express, and MongoDB Atlas.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js 18+ | JavaScript runtime |
| Express 4.x | HTTP framework |
| MongoDB Atlas | Cloud database |
| Mongoose 8 | ODM / schema management |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| Cloudinary | Cloud image storage |
| Multer | File upload handling |
| Winston | Structured application logging |
| Morgan | HTTP request logging |
| Helmet | Security HTTP headers |
| express-validator | Request validation |
| express-rate-limit | API rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |
| CORS | Cross-Origin Resource Sharing |
| compression | Gzip response compression |

---

## Project Structure

```
backend/
├── src/
│   ├── config/           # External service configurations
│   │   ├── env.js        # Env validation + typed exports
│   │   ├── database.js   # MongoDB Atlas connection + retry
│   │   ├── jwt.js        # JWT sign/verify helpers
│   │   ├── cloudinary.js # Cloudinary SDK + upload helpers
│   │   ├── multer.js     # File upload configuration
│   │   └── logger.js     # Winston logger configuration
│   │
│   ├── constants/        # Immutable application constants
│   │   ├── httpStatus.js # HTTP status code enum
│   │   ├── apiMessages.js# Centralised response messages
│   │   └── appConstants.js # Business rules and enums
│   │
│   ├── utils/            # Stateless pure utilities
│   │   ├── ApiError.js   # Custom error class
│   │   ├── ApiResponse.js# Standardised response builder
│   │   └── asyncHandler.js # Async error wrapper
│   │
│   ├── helpers/          # Business-adjacent utilities
│   │   ├── tokenHelper.js      # Token extraction/cookie utils
│   │   ├── paginationHelper.js # Pagination query builder
│   │   └── sanitizeHelper.js   # Input sanitisation
│   │
│   ├── middlewares/      # Express middleware (one purpose each)
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── adminMiddleware.js      # RBAC / role checks
│   │   ├── validationMiddleware.js # express-validator result handler
│   │   ├── uploadMiddleware.js     # Multer wrappers
│   │   ├── requestLogger.js        # Morgan HTTP logging
│   │   ├── notFoundMiddleware.js   # 404 catch-all
│   │   └── errorMiddleware.js      # Global error handler
│   │
│   ├── validators/       # express-validator rule chains
│   │   └── commonValidators.js # Shared validators
│   │
│   ├── models/           # Mongoose schema definitions (Phase 1B+)
│   ├── repositories/     # Database query functions (Phase 1B+)
│   ├── services/         # Business logic layer (Phase 1B+)
│   ├── controllers/      # HTTP I/O layer (Phase 1B+)
│   │
│   ├── routes/           # Express router definitions
│   │   ├── index.js      # Root router
│   │   └── health.routes.js # Health check
│   │
│   ├── types/            # Type definitions + enums
│   │   └── roles.types.js
│   │
│   └── interfaces/       # JSDoc typedef contracts
│       └── common.interfaces.js
│
├── uploads/temp/         # Temporary file storage (gitignored)
├── logs/                 # Log files (gitignored)
├── tests/                # Test files (Phase 2+)
├── app.js                # Express app configuration
├── server.js             # Application entry point
├── .env.example          # Environment variable template
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier works)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env

# 3. Fill in your .env values
#    Required: MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET

# 4. Start in development mode
npm run dev

# 5. Verify health
curl http://localhost:5000/api/v1/health
```

---

## Environment Variables

See [.env.example](.env.example) for all available variables.

**Required for startup:**
```
MONGODB_URI        — MongoDB Atlas connection string
JWT_ACCESS_SECRET  — Min 32 chars, random string
JWT_REFRESH_SECRET — Min 32 chars, different from access secret
COOKIE_SECRET      — Min 32 chars, for signed cookies
```

**Optional (have defaults):**
```
NODE_ENV           — development | production (default: development)
PORT               — HTTP port (default: 5000)
CORS_ORIGINS       — Comma-separated allowed origins (default: localhost:5173)
LOG_LEVEL          — Winston log level (default: info)
```

---

## API Endpoints

### Phase 1A (Available Now)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | None | API welcome message |
| GET | `/api/v1/health` | None | System health check |

### Phase 1B (Authentication)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | None | Register a new user |
| POST | `/api/v1/auth/login` | None | Login, receive tokens |
| POST | `/api/v1/auth/logout` | Token | Logout, clear cookies |
| POST | `/api/v1/auth/refresh` | Cookie | Refresh access token |
| GET | `/api/v1/users/me` | Token | Get own profile |

---

## API Response Format

All endpoints return the same envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request completed successfully.",
  "data": {},
  "errors": null
}
```

Error responses:
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed. Please check the errors and try again.",
  "data": null,
  "errors": [
    { "field": "email", "message": "Please provide a valid email address." }
  ]
}
```

---

## Architecture Layers

| Layer | Responsibility | Rule |
|---|---|---|
| Routes | URL mapping | No logic |
| Middleware | Cross-cutting concerns | No DB calls |
| Controllers | HTTP I/O | No business logic |
| Services | Business logic | No req/res access |
| Repositories | DB queries | No business logic |
| Models | Schema definitions | No controller logic |

---

## Security

- **Helmet** — Sets 15+ security HTTP headers
- **CORS** — Whitelist-based origin control
- **Rate Limiting** — 100 req/15min per IP globally, 10/15min for auth routes
- **NoSQL Injection** — express-mongo-sanitize strips `$` and `.` from all input
- **JWT** — Short-lived access tokens (15min) + long-lived refresh tokens (7d)
- **httpOnly Cookies** — Tokens stored in httpOnly + Secure + SameSite=Strict cookies
- **Password Hashing** — bcryptjs with 12 salt rounds
- **Input Validation** — express-validator on every mutation endpoint
- **No Stack Traces in Production** — Error details are never leaked to clients

---

## Development Phases

| Phase | Scope | Status |
|---|---|---|
| **1A** | Backend Foundation | ✅ Complete |
| **1B** | Auth + User Profile | 🔜 Next |
| **1C** | Products + Categories | 📅 Planned |
| **1D** | Cart + Wishlist | 📅 Planned |
| **1E** | Orders + Checkout | 📅 Planned |
| **2** | Reviews + Ratings | 📅 Planned |
| **3** | Marketplace / Seller Portal | 📅 Planned |
| **4** | Payments Integration | 📅 Planned |

---

## Scripts

```bash
npm run dev    # Start with nodemon (hot reload)
npm start      # Start production server
npm test       # Run tests (Phase 2+)
```
