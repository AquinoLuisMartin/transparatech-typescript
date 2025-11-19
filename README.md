# PUPSMB TransparaTech

A comprehensive transparency portal and management system designed for the Polytechnic University of the Philippines Sta. Maria Branch (PUPSMB). This digital platform promotes openness, accountability, and responsible governance within the university community through modern web technologies.

## 🏗️ Architecture Overview

This is a full-stack TypeScript application built with modern web technologies, featuring:
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + PostgreSQL + JWT Authentication  
- **Security**: Parameterized queries, input validation, rate limiting, CORS protection
- **Database**: PostgreSQL with connection pooling and transaction support
- **AI Integration**: Google Gemini AI for content generation and analysis

## 📋 Project Description

The PUPSMB Transparency Portal is a digital platform dedicated to promoting openness, accountability, and responsible governance within the university community. It serves as a central hub for managing, submitting, and reviewing organizational and financial reports with clarity and integrity.

### Key Features

- **🏛️ Role-based Dashboard System**: Three distinct user roles with specialized interfaces
  - **Admin Dashboard**: Complete system oversight, user management, document approvals, analytics, and system settings
  - **Officer Dashboard**: Document submission, activity tracking, and organizational announcements
  - **Viewer Dashboard**: Public access to transparency reports, documents, and feedback submission

- **📊 Transparency Dashboard**: Real-time visibility and control with performance data and operational metrics
- **🤖 Automation Solutions**: Intelligent automation tools that handle repetitive tasks and data entry
- **📁 Data Management Services**: Comprehensive data handling with enhanced organization and accessibility
- **📱 Responsive Design**: Fully responsive interface built with Tailwind CSS
- **🔐 Authentication & Authorization**: Secure login system with role-based access control
- **📈 Analytics & Reporting**: Built-in analytics with ApexCharts integration
- **📅 Calendar Integration**: FullCalendar integration for scheduling and events

## 🛠️ Technology Stack

### Frontend Technologies
- **React 19.0.0** - Modern React with latest features and concurrent rendering
- **TypeScript 5.7.2** - Type-safe development with advanced type checking
- **React Router DOM 7.9.5** - Client-side routing with data loading capabilities
- **Vite 6.1.0** - Lightning-fast build tool and development server with HMR

### Backend Technologies  
- **Node.js** - JavaScript runtime for server-side development
- **Express.js 5.1.0** - Fast, minimalist web framework for Node.js
- **PostgreSQL** - Advanced open-source relational database system
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **bcryptjs** - Password hashing and validation library

### Styling & UI Framework
- **Tailwind CSS 4.0.8** - Utility-first CSS framework for rapid UI development
- **Tailwind Merge** - Dynamic class merging for conditional styling
- **ApexCharts 4.1.0** - Interactive and responsive charts library
- **React ApexCharts** - React wrapper for ApexCharts integration

### Database & Security
- **PostgreSQL Connection Pooling** - Efficient database connection management
- **Parameterized Queries** - SQL injection prevention and secure data handling  
- **Helmet.js** - Security headers and protection middleware
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - API request throttling and abuse prevention

### AI & External Services
- **Google Gemini AI (@google/genai)** - Advanced AI text generation and analysis
- **Axios** - HTTP client for API requests and external service integration

### Development & DevOps
- **Nodemon** - Development server with auto-restart functionality
- **ESLint 9.19.0** - Code quality and consistency enforcement
- **dotenv** - Environment variable management
- **Morgan** - HTTP request logging middleware

### Additional Frontend Libraries
- **React Helmet Async** - SEO and document head management
- **React Dropzone** - Drag-and-drop file upload interface
- **FullCalendar** - Feature-rich calendar component
- **Swiper** - Modern touch slider component
- **Flatpickr** - Advanced date/time picker
- **CLSX** - Conditional class names utility

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (version 18.0.0 or higher) 
- **npm** (version 8.0.0 or higher) or **yarn**
- **PostgreSQL** (version 12 or higher)
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AquinoLuisMartin/transparatech-typescript.git
   cd transparatech-typescript
   ```

2. **Install dependencies for both client and server**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies  
   cd ../server
   npm install
   ```

3. **Database Setup**
   ```bash
   # Navigate to server directory
   cd server
   
   # Copy environment variables template
   cp .env.example .env
   
   # Edit .env file with your database credentials
   # Set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
   
   # Test database connection
   node test-db-connection.js
   
   # Run database setup (if needed)
   npm run db:migrate
   npm run db:seed
   ```

4. **Security Configuration**
   ```bash
   # Generate secure JWT secret and validate configuration
   npm run security:setup
   npm run security:validate
   ```

5. **Start the development servers**

   **Terminal 1 - Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend Client:**
   ```bash
   cd client  
   npm run dev
   ```

6. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - API endpoints available at `/api/v1/`

### Available Scripts

#### Frontend (client/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

#### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm run security:setup` - Generate secure configurations
- `npm run security:validate` - Validate security settings
- `npm run security:jwt` - Generate new JWT secret
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database to clean state

## 📁 Project Structure

The project is organized into two main parts: a `client` directory for the frontend application and a `server` directory for the backend services.

### Client-Side Structure

The `client` directory contains the React-based frontend application, built with Vite and TypeScript.

```
client/
├── public/                          # Static assets
│   └── images/                      # Publicly accessible images
│       ├── country/
│       ├── error/
│       ├── logo/
│       └── user/
│
├── src/                             # Source code
│   ├── components/                  # Reusable React components
│   │   ├── charts/                  # Chart components (Bar, Line)
│   │   ├── common/                  # Common UI elements (Breadcrumbs, Cards)
│   │   ├── form/                    # Form inputs and controls
│   │   ├── header/                  # Header and navigation components
│   │   ├── tables/                  # Table components
│   │   ├── ui/                      # Core UI building blocks (Button, Modal)
│   │   ├── ActivityCard.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── SubmissionCard.tsx
│   │   └── SubmissionDetailsModal.tsx
│   │
│   ├── context/                     # React Context for global state
│   │   ├── AuthContext.ts
│   │   ├── AuthProvider.tsx
│   │   ├── SidebarContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useGoBack.ts
│   │   └── useModal.ts
│   │
│   ├── icons/                       # SVG icon components
│   │
│   ├── layout/                      # Application layout components
│   │   ├── AppHeader.tsx
│   │   ├── AppLayout.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── Backdrop.tsx
│   │   └── SidebarWidget.tsx
│   │
│   ├── pages/                       # Top-level page components
│   │   ├── AuthPages/               # Authentication (Login, Signup)
│   │   ├── Dashboard/               # Role-based dashboards
│   │   ├── Landing/                 # Public landing pages
│   │   └── ...                      # Other application pages
│   │
│   ├── routes/                      # Routing configuration
│   │   └── index.tsx
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── auth.ts
│   │   └── submission.ts
│   │
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles
│
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML template
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite configuration
```

### Server-Side Structure

The `server` directory contains a secure Node.js and Express.js backend with enterprise-level security features, database management, and AI integration.

```
server/
├── database/                        # Database management and setup
│   ├── migrations/                  # Database schema migrations
│   ├── seeds/                       # Initial data seeding scripts
│   ├── queries/                     # Externalized SQL query definitions
│   │   └── userQueries.js          # User-related parameterized queries
│   ├── seed.js                     # Database seeding utility
│   └── setup.js                    # Database connection and health checks
│
├── src/                            # Server application source code
│   ├── app.js                      # Express application configuration
│   │
│   ├── config/                     # Application configuration
│   │   ├── database.js             # PostgreSQL connection pool setup
│   │   ├── corsConfig.js           # CORS security configuration  
│   │   ├── envValidator.js         # Environment validation and security
│   │   └── index.js                # Centralized configuration management
│   │
│   ├── controllers/                # Request handlers and business logic
│   │   ├── authController.js       # Authentication endpoints (register, login)
│   │   ├── userController.js       # User management endpoints
│   │   └── aiController.js         # AI service integration endpoints
│   │
│   ├── middleware/                 # Express middleware stack
│   │   ├── auth.js                 # JWT authentication and authorization
│   │   ├── errorHandler.js         # Global error handling and logging
│   │   ├── notFound.js             # 404 error handling
│   │   └── sanitization.js         # Input sanitization and validation
│   │
│   ├── models/                     # Data access layer
│   │   └── User.js                 # User model with secure data formatting
│   │
│   ├── routes/                     # API route definitions
│   │   ├── auth.js                 # Authentication routes (/api/v1/auth)
│   │   ├── users.js                # User management routes (/api/v1/users)
│   │   └── ai.js                   # AI service routes (/api/v1/ai)
│   │
│   ├── services/                   # External service integrations
│   │   ├── DatabaseService.js      # Secure database operations with query externalization
│   │   ├── UserService.js          # User-specific business logic
│   │   └── GenAIService.js         # Google Gemini AI integration
│   │
│   ├── scripts/                    # Utility and maintenance scripts  
│   │   └── setup-security.js       # Security configuration generator
│   │
│   └── utils/                      # Utility functions and helpers
│       ├── asyncHandler.js         # Async error handling wrapper
│       ├── auth.js                 # Password hashing, JWT utilities
│       ├── validator.js            # Input validation and sanitization
│       └── secureLogger.js         # Security-focused logging system
│
├── .env                            # Environment variables (not in version control)
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies, scripts, and metadata
├── server.js                       # Server entry point and startup
├── test-db-connection.js           # Database connectivity testing
├── check-signup-table.js           # Database schema validation
├── diagnose.js                     # Server diagnostics and troubleshooting
└── *.md                           # Security documentation and audit reports
```

#### Key Server Features

**🔒 Security Architecture**
- **Parameterized Queries**: All SQL queries use parameter binding to prevent injection
- **Query Externalization**: SQL queries stored in dedicated files for better maintenance
- **JWT Security**: Secure token generation with configurable expiration and refresh tokens
- **Password Security**: bcrypt hashing with configurable salt rounds (12+ for production)
- **Input Validation**: Comprehensive sanitization and validation middleware
- **Rate Limiting**: Configurable request throttling per IP address
- **CORS Protection**: Strict cross-origin resource sharing policies
- **Security Headers**: Helmet.js for HTTP security headers

**🗄️ Database Management**
- **Connection Pooling**: PostgreSQL connection pool with configurable limits
- **Health Monitoring**: Database health checks and connection validation
- **Migration System**: Schema versioning and database setup automation
- **Seed Data**: Initial data population for development and testing
- **Query Optimization**: Indexed queries and performance monitoring

**🤖 AI Integration**
- **Google Gemini AI**: Text generation and content analysis capabilities
- **Configurable API**: Optional AI features with environment-based configuration
- **Error Handling**: Graceful fallbacks when AI services are unavailable
- **Usage Logging**: AI request tracking and monitoring

**⚡ Performance Features**
- **Async/Await**: Modern asynchronous JavaScript patterns
- **Error Boundaries**: Comprehensive error handling and recovery
- **Logging System**: Structured logging with different levels (debug, info, warn, error)
- **Environment Management**: Multi-environment configuration (dev, staging, production)

## 🔐 User Roles & Permissions

### Admin Role
- **System Management**: Complete oversight of the entire system
- **User Management**: Create, edit, and manage user accounts
- **Document Approvals**: Review and approve submitted documents
- **Organization Management**: Manage student organizations
- **Analytics & Reports**: Access to system-wide analytics
- **System Settings**: Configure system parameters

### Officer Role
- **Document Upload**: Submit organizational documents and reports
- **Submission Tracking**: Monitor status of submitted documents
- **Activity Logging**: Track personal activities and submissions
- **Announcements**: View organizational announcements

### Viewer Role
- **Document Access**: View approved public documents
- **Transparency Reports**: Access transparency reports
- **Public Announcements**: View public announcements
- **Feedback Submission**: Submit feedback and suggestions

## 🌍 Supported Organizations

The system currently supports the following PUPSMB student organizations:

- **SC** - Student Council
- **CEM** - Chamber of Entrepreneurs and Managers
- **iSITE** - Integrated Students in Information Technology Education
- **ACES** - Alliance of Computer Engineering Students
- **AFT** - Association of Future Teachers
- **HMSOC** - Hospitality Management Society
- **JPIA** - Junior Philippine Institute of Accountancy - Sta Maria

## 🔧 Configuration

### Environment Variables

The application uses environment variables for secure configuration. Copy `.env.example` to `.env` in the server directory and configure:

#### Server Configuration
```env
# Server Settings
PORT=3000
NODE_ENV=development

# Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transparatech_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Security (CRITICAL)
JWT_SECRET=your_secure_64_character_jwt_secret_generated_randomly
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
JWT_ISSUER=transparatech
JWT_AUDIENCE=transparatech-users

# CORS Security
CLIENT_URL=http://localhost:5173

# API Configuration
API_PREFIX=/api/v1

# Google Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Security Requirements
- **JWT_SECRET**: Must be at least 32 characters, cryptographically random
- **DB_PASSWORD**: Use strong passwords for database access
- **CLIENT_URL**: Only allow trusted frontend origins
- **HTTPS**: Required for production environments

### Configuration Files

#### Frontend Configuration
- `client/vite.config.ts` - Vite build tool configuration with proxy setup
- `client/tsconfig.json` - TypeScript compiler options and path mapping
- `client/eslint.config.js` - Code quality and linting rules
- `client/postcss.config.js` - CSS processing and Tailwind integration

#### Backend Configuration  
- `server/src/config/database.js` - PostgreSQL connection pool settings
- `server/src/config/corsConfig.js` - Cross-origin resource sharing policies
- `server/src/config/envValidator.js` - Environment variable validation
- `server/src/config/index.js` - Centralized configuration management

### Development vs Production

#### Development Environment
- CORS allows localhost origins
- Detailed error messages and stack traces
- Hot module replacement and auto-restart
- Relaxed rate limiting for testing
- Database connection logging enabled

#### Production Environment
- Strict CORS policies with HTTPS origins only
- Generic error messages to prevent information disclosure
- Optimized builds with minification
- Aggressive rate limiting and security headers
- Comprehensive audit logging and monitoring

### Database Configuration

#### Connection Pooling
```javascript
// Production settings
pool: {
  max: 50,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Connection idle timeout
  connectionTimeoutMillis: 2000 // Connection attempt timeout
}
```

#### Development vs Production Pools
- **Development**: 20 max connections, relaxed timeouts
- **Production**: 50 max connections, strict timeouts
- **Testing**: 5 max connections, minimal timeouts

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with refresh token support
- **Role-Based Access**: Admin, Officer, and Viewer roles with specific permissions
- **Password Security**: bcrypt hashing with configurable salt rounds (12+ for production)
- **Session Management**: Configurable session timeouts and automatic logout

### Data Protection
- **SQL Injection Prevention**: Parameterized queries and input sanitization
- **XSS Protection**: Input validation and output encoding
- **CORS Security**: Strict cross-origin policies with whitelisted domains
- **Rate Limiting**: API request throttling to prevent abuse
- **Security Headers**: Helmet.js for comprehensive HTTP security headers

### Database Security
- **Connection Security**: Encrypted connections with connection pooling
- **Query Externalization**: SQL queries stored separately from business logic  
- **Input Validation**: Multi-layer validation and sanitization
- **Error Handling**: Secure error messages without information disclosure

## 🚀 API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User authentication  
GET  /api/v1/auth/me          # Get current user profile
PUT  /api/v1/auth/change-password # Update user password
POST /api/v1/auth/logout      # User logout
```

### User Management Endpoints
```
GET    /api/v1/users          # List users (Admin only)
GET    /api/v1/users/:id      # Get specific user (Admin/Self)
PUT    /api/v1/users/:id      # Update user (Admin/Self)
DELETE /api/v1/users/:id      # Delete user (Admin only)
```

### AI Service Endpoints
```
POST /api/v1/ai/generate      # Generate text content
POST /api/v1/ai/analyze       # Analyze text content
```

## 🧪 Testing & Debugging

### Database Testing
```bash
# Test database connection
node test-db-connection.js

# Validate table structure
node check-signup-table.js

# Run server diagnostics
node diagnose.js

# Test user registration flow
node check-signup-table.js
```

### Development Tools
```bash
# Check server configuration
npm run security:validate

# Generate new JWT secret
npm run security:jwt

# Reset database to clean state
npm run db:reset

# Seed database with test data
npm run db:seed
```

## 🤝 Contributing

### Development Workflow
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/transparatech-typescript.git
   cd transparatech-typescript
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
4. **Set up development environment**
   ```bash
   # Install dependencies
   cd client && npm install
   cd ../server && npm install
   
   # Configure environment
   cp .env.example .env
   # Edit .env with your configuration
   
   # Test setup
   npm run security:validate
   node test-db-connection.js
   ```
5. **Make your changes** following the coding standards
6. **Test your changes** thoroughly
7. **Commit your changes** with descriptive messages
   ```bash
   git commit -m "feat: add amazing new feature for user management"
   ```
8. **Push to your fork**
   ```bash
   git push origin feature/amazing-new-feature
   ```
9. **Open a Pull Request** with detailed description

### Code Standards
- **TypeScript**: Use strict type checking and proper interfaces
- **ESLint**: Follow the configured linting rules
- **Security**: Never commit sensitive data (passwords, API keys)
- **Documentation**: Update README and code comments for new features
- **Testing**: Test both client and server components

### Security Guidelines
- Use parameterized queries for all database operations
- Validate and sanitize all user inputs
- Follow JWT best practices for authentication
- Keep dependencies updated for security patches
- Never expose sensitive information in error messages

## 📞 Support & Documentation

### Getting Help
- **Issues**: Report bugs and request features on GitHub Issues
- **Security**: Report security vulnerabilities privately to the maintainers
- **Documentation**: Check the `/docs` folder for detailed technical documentation

### Project Links
- **Repository**: https://github.com/AquinoLuisMartin/transparatech-typescript
- **Live Demo**: (To be deployed)
- **API Documentation**: Available at `/api/v1/docs` when server is running

---

**Note**: This project is specifically designed for PUPSMB's transparency initiatives and governance requirements. The system promotes accountability, openness, and efficient document management within the university community while maintaining the highest standards of security and data protection.
