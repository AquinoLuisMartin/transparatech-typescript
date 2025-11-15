# PUPSMB TransparaTech

A comprehensive transparency portal and management system designed for the Polytechnic University of the Philippines Sta. Maria Branch (PUPSMB). This digital platform promotes openness, accountability, and responsible governance within the university community through modern web technologies.

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

### Frontend Framework
- **React 19.0.0** - Modern React with latest features
- **TypeScript 5.7.2** - Type-safe development
- **React Router DOM 7.9.5** - Client-side routing

### Styling & UI
- **Tailwind CSS 4.0.8** - Utility-first CSS framework
- **Tailwind Merge** - Dynamic class merging
- **Custom CSS** - Additional styling for specific components

### Charts & Visualization
- **ApexCharts 4.1.0** - Interactive charts and graphs
- **React ApexCharts** - React wrapper for ApexCharts
- **React JVectorMap** - Interactive vector maps

### Form & Input Handling
- **React Dropzone** - File upload interface
- **Flatpickr** - Date/time picker
- **React DnD** - Drag and drop functionality

### Development Tools
- **Vite 6.1.0** - Fast build tool and development server
- **ESLint 9.19.0** - Code linting and formatting
- **PostCSS** - CSS processing

### Additional Libraries
- **React Helmet Async** - Document head management
- **Swiper** - Touch slider component
- **FullCalendar** - Calendar component
- **CLSX** - Conditional class names utility

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher) or **yarn**
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/transparatech-typescript.git
   cd transparatech-typescript
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The development server will automatically reload when you make changes

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

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

The `server` directory contains the Node.js and Express.js backend, which handles API requests, database interactions, and authentication.

```
server/
├── database/                        # Database setup, migrations, and seeds
│   ├── migrations/
│   ├── seeds/
│   ├── seed.js
│   └── setup.js
│
├── src/                             # Server source code
│   ├── app.js                       # Express application setup
│   ├── config/                      # Configuration files (database, etc.)
│   ├── controllers/                 # Request handlers for different routes
│   ├── middleware/                  # Express middleware (auth, error handling)
│   ├── models/                      # Database models (e.g., User)
│   ├── routes/                      # API route definitions
│   ├── services/                    # Business logic and external service integrations
│   └── utils/                       # Utility functions
│
├── .env                             # Environment variables (ignored by Git)
├── package.json                     # Server dependencies and scripts
└── server.js                        # Server entry point
```

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

### Environment Setup
Create environment variables for:
- Database connections
- Authentication secrets
- API endpoints
- File upload configurations

### Development Configuration
The project uses several configuration files:
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.js` - Code linting rules
- `postcss.config.js` - PostCSS processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Note**: This project is specifically designed for PUPSMB's transparency initiatives and governance requirements. The system promotes accountability, openness, and efficient document management within the university community.#
