# Breedgestone Backend API

A comprehensive NestJS backend application for a real estate and marketplace platform. Built with TypeScript, TypeORM, and MySQL, this API provides authentication, property management, marketplace functionality, notifications, and payment processing.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Postman Integration](#postman-integration)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)

## ✨ Features

### Authentication & Authorization
- **JWT-based Authentication** - Secure token-based auth
- **OAuth Integration** - Google and Facebook login support
- **Local Authentication** - Email/password login with bcrypt
- **Password Management** - Forgot password, reset password, change password
- **OTP Email Verification** - Email verification with one-time passwords
- **Role-based Access Control** - User roles and permissions

### Property Management
- **Property Listings** - Create, read, update, delete properties
- **Property Assets** - Multiple images per property
- **Property Fees** - Associated fees and charges
- **Agent Management** - Property agent assignments

### Marketplace
- **Categories & Subcategories** - Hierarchical product organization
- **Products** - Full product management with variations
- **Shopping Cart** - Add to cart, update quantities, checkout
- **Orders** - Order creation and management
- **Order Items** - Detailed order item tracking

### Notifications
- **Email Notifications** - Nodemailer integration
- **Push Notifications** - Firebase Cloud Messaging support
- **In-app Notifications** - Real-time notifications
- **Email Templates** - Welcome emails, OTP, password resets

### Additional Features
- **WebSocket Support** - Real-time communication via Socket.io
- **Global Response Interceptor** - Consistent API response format
- **Entity Serialization** - Clean responses with excluded fields
- **Query Optimization** - Efficient database queries, no N+1 issues
- **Database Migrations** - TypeORM migrations for schema management
- **Database Seeding** - Test data generation

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: Passport.js (JWT, Google OAuth, Facebook OAuth)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer
- **Push Notifications**: Firebase Admin SDK
- **Real-time**: Socket.io
- **Password Hashing**: bcryptjs

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL (v8.0 or higher)
- Firebase account (for push notifications)
- Google OAuth credentials (optional)
- Facebook OAuth credentials (optional)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/breedgestone/Backend.git
cd breedgestone-backend
```

2. **Install dependencies**
```bash
npm install
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=breedgestone

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_email_app_password
MAIL_FROM=noreply@breedgestone.com

# Firebase (for push notifications)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Setup

1. **Create MySQL database**
```bash
mysql -u root -p
CREATE DATABASE breedgestone;
```

2. **Run migrations**
```bash
npm run migration:run
```

3. **Seed the database** (optional - adds test data)
```bash
npm run seed
```

The seeder creates:
- 6 test users (including admin)
- 8 categories
- 12 subcategories
- 18 products
- 9 properties

**Test Credentials:**
- Admin: `admin@breedgestone.com` / `password123`
- Agent: `agent1@breedgestone.com` / `password123`
- Buyer: `buyer1@breedgestone.com` / `password123`

## 🏃 Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:3000/api/docs
```

### OpenAPI JSON
Download the OpenAPI specification:
```
http://localhost:3000/api/docs-json
```

## 📮 Postman Integration

This project includes seamless Postman integration:

1. **Import Swagger JSON**
   - Export from `http://localhost:3000/api/docs-json`
   - Import into Postman as OpenAPI 3.0

2. **Auto-Token Script** (Already configured)
   - Login via `/auth/login` endpoint
   - JWT token automatically saved to `{{accessToken}}` variable
   - All authenticated endpoints use this variable automatically

3. **Collection Variables**
   - `accessToken` - Automatically populated on login
   - `baseUrl` - Set to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── database.module.ts           # Database configuration module
├── common/                      # Shared resources
│   ├── entities/               # Shared entities (Asset)
│   └── interceptors/           # Global interceptors (Response)
├── config/                      # Configuration files
│   ├── database.ts             # TypeORM configuration
│   └── env.ts                  # Environment validation
├── database/
│   ├── migrations/             # TypeORM migrations
│   └── seeds/                  # Database seeders
└── modules/                     # Feature modules
    ├── auth/                   # Authentication module
    │   ├── guards/            # Auth guards (JWT, OAuth)
    │   ├── strategies/        # Passport strategies
    │   └── templates/         # Email templates
    ├── users/                  # User management
    │   ├── dto/               # Data transfer objects
    │   └── entities/          # User entity
    ├── property/              # Property management
    ├── marketplace/           # Marketplace features
    │   ├── categories/        # Categories & subcategories
    │   ├── products/          # Products
    │   ├── cart/              # Shopping cart
    │   └── orders/            # Orders
    └── notification/          # Notification service
        ├── dto/               # Notification DTOs
        └── entities/          # Notification entity
```

## 📜 Available Scripts

```bash
# Development
npm run start:dev              # Start in watch mode
npm run start:debug            # Start in debug mode

# Build
npm run build                  # Build for production
npm run start:prod             # Run production build

# Code Quality
npm run format                 # Format code with Prettier
npm run lint                   # Lint and fix code

# Database
npm run migration:generate -- --name=MigrationName  # Generate migration
npm run migration:create -- --name=MigrationName    # Create empty migration
npm run migration:run          # Run pending migrations
npm run migration:revert       # Revert last migration
npm run migration:show         # Show migration status
npm run schema:sync            # Sync schema (use with caution)
npm run schema:drop            # Drop all tables (destructive)
npm run seed                   # Seed database with test data

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Run tests with coverage
npm run test:e2e               # Run end-to-end tests
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **CORS** - Configured for production
- **Validation** - Input validation with class-validator
- **SQL Injection Protection** - TypeORM parameterized queries
- **Rate Limiting** - (Recommended for production)

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

Timestamps and internal fields are automatically excluded from responses using `@Exclude()` decorators.

## 🚀 Deployment

### Environment Variables
Ensure all production environment variables are set, especially:
- `NODE_ENV=production`
- Strong `JWT_SECRET`
- Production database credentials
- Production OAuth credentials
- Production email configuration

### Build and Run
```bash
npm run build
npm run start:prod
```

### Recommended Production Setup
- Use PM2 or similar process manager
- Set up reverse proxy (Nginx)
- Enable HTTPS
- Configure rate limiting
- Set up monitoring and logging
- Regular database backups

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is UNLICENSED - Private and proprietary.

## 👥 Authors

- Breedgestone Development Team

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Powered by [TypeORM](https://typeorm.io/)
- Documentation by [Swagger](https://swagger.io/)
