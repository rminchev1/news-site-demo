# 📰 News Site Demo

A modern, full-stack news application built with React and Node.js, featuring user authentication, premium content access, and integrated paywall functionality.

## 🏢 Business Overview

This demo showcases a complete digital subscription business model for modern news publishers. The application demonstrates key revenue-generating capabilities and user engagement strategies that drive successful digital media businesses.

### 📊 Supported Business Cases

#### **Freemium Content Strategy**
- **Free Article Access**: Anonymous users get limited article views to sample content quality
- **Premium Content Paywall**: Seamless conversion funnel when free limit is reached
- **User Registration Incentive**: Enhanced experience and extended access for registered users
- **Content Monetization**: Clear separation between free and premium content tiers

#### **User Acquisition & Retention**
- **Low-Friction Onboarding**: Quick registration with email/password
- **Personalized Experience**: User profiles with favorite articles and reading history  
- **Session Persistence**: Seamless experience across browser sessions
- **Engagement Tracking**: User behavior analytics for content optimization

#### **Revenue Generation Models**
- **Subscription Conversion**: Integrated Poool paywall for premium content access
- **Tiered Access Control**: Different content access levels based on user status
- **Flexible Paywall Configuration**: Dashboard-controlled article limits and access rules
- **Revenue Analytics**: Track conversion rates and subscription performance

#### **Content Management & Distribution**
- **Article Categorization**: Organized content with premium/free designation
- **User-Generated Engagement**: Favorite articles and personal content curation
- **Responsive Design**: Optimal experience across all devices and platforms
- **SEO-Friendly Structure**: Public content accessibility for search engines

### 🎯 Target Use Cases

| Business Scenario | Demonstration Value | Key Features |
|-------------------|-------------------|--------------|
| **Digital News Publisher** | Complete subscription funnel | Paywall integration, user auth, content tiers |
| **Content Marketing Platform** | Lead generation through gated content | Registration incentives, user profiles |
| **Media Startup MVP** | Full-stack technical foundation | Authentication, database, responsive UI |
| **Subscription SaaS Demo** | Revenue model implementation | Freemium strategy, conversion tracking |
| **Developer Portfolio** | Modern web development skills | React, Node.js, MongoDB, JWT authentication |

### 💼 Business Value Proposition

- **Proven Revenue Model**: Implements successful freemium-to-premium conversion strategies
- **Scalable Architecture**: Built to handle growing user bases and content volumes
- **Analytics-Ready**: Foundation for tracking key business metrics and KPIs
- **Integration-Friendly**: Modular design for adding payment processors, CRM systems, and marketing tools
- **Mobile-First Design**: Optimized for the mobile-dominant media consumption landscape

## 📸 Product Screenshots

<!-- Add your product screenshots here -->
<!-- Example: -->
<!-- ![Home Page](./screenshots/home.png) -->
<!-- ![Authentication](./screenshots/auth.png) -->
<!-- ![Article View](./screenshots/article.png) -->
<!-- ![User Profile](./screenshots/profile.png) -->

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (optional - uses in-memory storage as fallback)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/radominchev/news-site-demo.git
   cd news-site-demo
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   npm install
   
   # Or install separately
   npm install                    # Frontend dependencies
   cd backend && npm install      # Backend dependencies
   ```

3. **Environment Configuration**
   
   Create `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # Database (Optional - uses in-memory storage if not configured)
   MONGODB_URI=mongodb://localhost:27017/newssite
   
   # JWT Secret (Generate a secure random string)
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   
   # Poool Configuration
   REACT_APP_POOOL_APP_ID=your-poool-app-id
   ```

4. **Start the application**
   ```bash
   # Development mode (starts both frontend and backend)
   npm run dev
   
   # Or start separately
   npm start                      # Frontend (http://localhost:3000)
   cd backend && npm start        # Backend (http://localhost:5001)
   ```

5. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001
   - **API Documentation**: http://localhost:5001/api-docs (if available)

### Production Deployment

#### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t news-site-demo .
docker run -p 3000:3000 -p 5001:5001 news-site-demo
```

#### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production npm run start:prod
```

## 🌟 Features

- [Architecture Overview](#-architecture-overview)
- [System Architecture](#-system-architecture)
- [Authentication Flow](#-authentication-flow-diagram)
- [Paywall Integration](#-paywall-integration-architecture)
- [Database Design](#-database-design)
- [API Architecture](#-api-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Security Architecture](#-security-architecture)
- [Deployment Architecture](#-deployment-architecture)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Reference](#api-reference)

## 🏗️ Architecture Overview

This application follows a modern full-stack architecture with clear separation of concerns, implementing industry best practices for security, scalability, and maintainability.

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend<br/>Port 3000]
        PWA[Progressive Web App<br/>Responsive Design]
    end
    
    subgraph "API Layer"
        API[Express.js Server<br/>Port 5001]
        AUTH[Authentication Middleware]
        VALID[Validation Layer]
    end
    
    subgraph "Business Logic"
        ROUTES[Route Controllers]
        MODELS[Data Models]
        SERVICES[Business Services]
    end
    
    subgraph "Data Layer"
        MONGO[(MongoDB Database)]
        MEMORY[(In-Memory Fallback)]
    end
    
    subgraph "External Services"
        POOOL[Poool Paywall Service]
        JWT[JWT Token Service]
    end
    
    UI --> API
    PWA --> API
    API --> AUTH
    API --> VALID
    AUTH --> ROUTES
    VALID --> ROUTES
    ROUTES --> MODELS
    ROUTES --> SERVICES
    MODELS --> MONGO
    MODELS --> MEMORY
    UI --> POOOL
    API --> JWT
    
    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px
    classDef backend fill:#68a063,stroke:#333,stroke-width:2px
    classDef database fill:#47a248,stroke:#333,stroke-width:2px
    classDef external fill:#ff6b6b,stroke:#333,stroke-width:2px
    
    class UI,PWA frontend
    class API,AUTH,VALID,ROUTES,MODELS,SERVICES backend
    class MONGO,MEMORY database
    class POOOL,JWT external
```

## 🔧 System Architecture

### High-Level Architecture

The application implements a **3-tier architecture** with clear separation between presentation, business logic, and data layers:

```mermaid
graph LR
    subgraph "Presentation Tier"
        A[React SPA]
        B[Responsive UI]
        C[Poool Integration]
    end
    
    subgraph "Application Tier"
        D[Express.js API]
        E[Authentication Layer]
        F[Business Logic]
        G[Validation Layer]
    end
    
    subgraph "Data Tier"
        H[MongoDB Primary]
        I[In-Memory Fallback]
        J[Local Storage Cache]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    D --> G
    E --> H
    F --> H
    F --> I
    A --> J
    
    classDef tier1 fill:#e1f5fe
    classDef tier2 fill:#f3e5f5
    classDef tier3 fill:#e8f5e8
    
    class A,B,C tier1
    class D,E,F,G tier2
    class H,I,J tier3
```

### Component Architecture

```mermaid
graph TB
    subgraph "React Frontend Components"
        APP[App Component]
        HEADER[Header Component]
        FOOTER[Footer Component]
        
        subgraph "Pages"
            HOME[Home Page]
            ARTICLE[Article Detail]
            LOGIN[Login Page]
            REGISTER[Register Page]
            PROFILE[Profile Page]
            FAVORITES[Favorites Page]
        end
        
        subgraph "Shared Components"
            CARD[Article Card]
            COUNTER[Free Article Counter]
            STATUS[Subscription Status]
            AUTH_CTX[Auth Context]
        end
        
        subgraph "Services"
            API_SVC[API Service]
            POOOL_CFG[Poool Config]
        end
    end
    
    APP --> HEADER
    APP --> FOOTER
    APP --> HOME
    APP --> ARTICLE
    APP --> LOGIN
    APP --> REGISTER
    APP --> PROFILE
    APP --> FAVORITES
    
    HOME --> CARD
    ARTICLE --> COUNTER
    ARTICLE --> STATUS
    
    ALL_COMPONENTS -.-> AUTH_CTX
    ALL_COMPONENTS --> API_SVC
    ARTICLE --> POOOL_CFG
```

## 🔐 Authentication Flow Diagram

### User Registration & Login Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant API as Express API
    participant DB as Database
    participant JWT as JWT Service
    
    Note over U,JWT: User Registration Flow
    
    U->>FE: Fill registration form
    FE->>FE: Validate input (client-side)
    FE->>API: POST /api/auth/register
    API->>API: Validate request (server-side)
    API->>API: Hash password (bcrypt)
    API->>DB: Create user record
    DB-->>API: User created
    API->>JWT: Generate JWT token
    JWT-->>API: Return signed token
    API-->>FE: Return user + token
    FE->>FE: Store token in localStorage
    FE->>FE: Update auth context
    FE-->>U: Redirect to dashboard
    
    Note over U,JWT: Subsequent Requests
    
    U->>FE: Access protected resource
    FE->>FE: Get token from localStorage
    FE->>API: Request with Authorization header
    API->>API: Extract & verify JWT
    API->>API: Check user permissions
    API-->>FE: Return protected data
    FE-->>U: Display content
```

### Session Persistence Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant FE as React App
    participant LS as LocalStorage
    participant API as Backend API
    participant CTX as Auth Context
    
    Note over B,CTX: App Initialization
    
    B->>FE: Page load/refresh
    FE->>CTX: Initialize AuthContext
    CTX->>LS: Check for authToken
    CTX->>LS: Check for saved user data
    
    alt Token exists
        CTX->>API: POST /api/auth/verify-token
        alt Token valid
            API-->>CTX: User data + success
            CTX->>CTX: Set authenticated state
            CTX-->>FE: User authenticated
        else Token invalid/expired
            API-->>CTX: Error response
            CTX->>LS: Clear invalid token
            CTX->>CTX: Set unauthenticated state
            CTX-->>FE: User not authenticated
        end
    else No token
        CTX->>CTX: Set unauthenticated state
        CTX-->>FE: User not authenticated
    end
```

## 🔒 Paywall Integration Architecture

### Poool Integration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant POOOL as Poool Service
    participant API as Backend API
    participant DASH as Poool Dashboard
    
    Note over U,DASH: Anonymous User Article Access
    
    U->>FE: Visit article page
    FE->>FE: Check authentication status
    
    alt User NOT authenticated
        FE->>POOOL: Initialize AccessContext
        DASH-->>POOOL: Load configuration (limits, scenarios)
        POOOL->>POOOL: Check article count for user
        
        alt Within free limit
            POOOL-->>FE: Allow full article access
            FE-->>U: Display full article
            POOOL->>POOOL: Increment article count
        else Exceeded free limit
            POOOL-->>FE: Show paywall after partial content
            FE-->>U: Display paywall
            
            alt User clicks signup
                FE->>FE: Redirect to /register
                U->>API: Complete registration
                API-->>FE: Return authenticated user
                FE->>POOOL: Update user status
                POOOL-->>FE: Grant full access
            end
        end
    else User authenticated
        FE->>FE: Skip Poool entirely
        FE-->>U: Display full article (premium access)
    end
```

### Poool Configuration Architecture

```mermaid
graph TB
    subgraph "Poool Dashboard (External)"
        DASH_CFG[Article Limits Configuration]
        DASH_SCEN[Scenario Management]
        DASH_AB[A/B Testing Setup]
    end
    
    subgraph "Application Configuration"
        POOOL_CFG[Poool Config Utility]
        EVENT_HANDLERS[Event Handlers]
        URL_CONFIG[URL Routing Config]
    end
    
    subgraph "React Components"
        ACCESS_CTX[AccessContext]
        RESTRICTED[RestrictedContent]
        PAYWALL[Paywall Component]
        PIXEL[Analytics Pixel]
    end
    
    subgraph "User Experience"
        ANON[Anonymous Users]
        AUTH[Authenticated Users]
    end
    
    DASH_CFG --> POOOL_CFG
    DASH_SCEN --> POOOL_CFG
    DASH_AB --> POOOL_CFG
    
    POOOL_CFG --> ACCESS_CTX
    EVENT_HANDLERS --> ACCESS_CTX
    URL_CONFIG --> EVENT_HANDLERS
    
    ACCESS_CTX --> RESTRICTED
    ACCESS_CTX --> PAYWALL
    ACCESS_CTX --> PIXEL
    
    ANON --> ACCESS_CTX
    AUTH -.-> RESTRICTED
    
    classDef external fill:#ff9999
    classDef config fill:#99ccff
    classDef component fill:#99ff99
    classDef user fill:#ffcc99
    
    class DASH_CFG,DASH_SCEN,DASH_AB external
    class POOOL_CFG,EVENT_HANDLERS,URL_CONFIG config
    class ACCESS_CTX,RESTRICTED,PAYWALL,PIXEL component
    class ANON,AUTH user
```

## 🗄️ Database Design

### Entity Relationship Diagram

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string firstName
        string lastName
        string email UK
        string password
        string role
        boolean isActive
        array favoriteArticles
        object preferences
        Date createdAt
        Date updatedAt
        Date lastLogin
    }
    
    Article {
        number id PK
        string title
        string author
        string date
        text content
        string category
        array tags
    }
    
    UserPreferences {
        boolean newsletter
        boolean notifications
        string theme
        string language
    }
    
    FavoriteArticles {
        array articleIds
        Date addedAt
    }
    
    User ||--|| UserPreferences : has
    User ||--o{ FavoriteArticles : contains
    Article ||--o{ FavoriteArticles : referenced_in
```

### Database Architecture with Fallback System

```mermaid
graph TB
    subgraph "Primary Database Layer"
        MONGO[(MongoDB)]
        MONGOOSE[Mongoose ODM]
        USER_MODEL[User Model]
    end
    
    subgraph "Fallback System"
        MEMORY[(In-Memory Store)]
        MEMORY_MODEL[InMemoryUser Model]
        ADAPTER[UserAdapter]
    end
    
    subgraph "Application Layer"
        ROUTES[API Routes]
        CONTROLLERS[Controllers]
    end
    
    ROUTES --> CONTROLLERS
    CONTROLLERS --> ADAPTER
    
    ADAPTER --> USER_MODEL
    ADAPTER --> MEMORY_MODEL
    
    USER_MODEL --> MONGOOSE
    MONGOOSE --> MONGO
    
    MEMORY_MODEL --> MEMORY
    
    MONGO -.->|Connection Failed| ADAPTER
    ADAPTER -.->|Fallback| MEMORY_MODEL
    
    classDef primary fill:#4caf50
    classDef fallback fill:#ff9800
    classDef app fill:#2196f3
    
    class MONGO,MONGOOSE,USER_MODEL primary
    class MEMORY,MEMORY_MODEL,ADAPTER fallback
    class ROUTES,CONTROLLERS app
```

## Features

### Frontend (React)
- 📰 News article browsing and reading
- 🔐 User authentication (login/register)
- ❤️ Favorite articles functionality
- 👤 User profile and settings management
- 🎨 Responsive design
- 🔒 Paywall integration with Poool

### Backend (Node.js/Express)
- 🔑 JWT-based authentication
- 📊 MongoDB database with Mongoose
- 🛡️ Security middleware (helmet, cors, validation)
- 📝 User profile management
- ⭐ Favorites system
- 🔒 Protected routes and middleware

## 🔌 API Architecture

### RESTful API Design

```mermaid
graph TB
    subgraph "API Gateway Layer"
        CORS[CORS Middleware]
        HELMET[Security Headers]
        RATE[Rate Limiting]
        PARSER[Body Parser]
    end
    
    subgraph "Authentication Layer"
        AUTH_MW[Auth Middleware]
        JWT_VERIFY[JWT Verification]
        ROLE_CHECK[Role Authorization]
    end
    
    subgraph "Validation Layer"
        INPUT_VAL[Input Validation]
        SANITIZE[Data Sanitization]
        SCHEMA_VAL[Schema Validation]
    end
    
    subgraph "Route Handlers"
        AUTH_ROUTES[Auth Routes]
        USER_ROUTES[User Routes]
        HEALTH[Health Check]
    end
    
    subgraph "Business Logic"
        USER_SVC[User Service]
        AUTH_SVC[Auth Service]
        FAV_SVC[Favorites Service]
    end
    
    REQUEST --> CORS
    CORS --> HELMET
    HELMET --> RATE
    RATE --> PARSER
    PARSER --> AUTH_MW
    AUTH_MW --> JWT_VERIFY
    JWT_VERIFY --> ROLE_CHECK
    ROLE_CHECK --> INPUT_VAL
    INPUT_VAL --> SANITIZE
    SANITIZE --> SCHEMA_VAL
    SCHEMA_VAL --> AUTH_ROUTES
    SCHEMA_VAL --> USER_ROUTES
    SCHEMA_VAL --> HEALTH
    
    AUTH_ROUTES --> AUTH_SVC
    USER_ROUTES --> USER_SVC
    USER_ROUTES --> FAV_SVC
```

### API Endpoint Architecture

```mermaid
graph LR
    subgraph "Authentication Endpoints"
        AUTH_REG[POST /api/auth/register]
        AUTH_LOGIN[POST /api/auth/login]
        AUTH_VERIFY[POST /api/auth/verify-token]
        AUTH_LOGOUT[POST /api/auth/logout]
    end
    
    subgraph "User Management Endpoints"
        USER_PROFILE[GET /api/users/profile]
        USER_UPDATE[PUT /api/users/profile]
        USER_PREFS[PUT /api/users/preferences]
    end
    
    subgraph "Favorites Endpoints"
        FAV_LIST[GET /api/users/favorites]
        FAV_ADD[POST /api/users/favorites/:id]
        FAV_REMOVE[DELETE /api/users/favorites/:id]
    end
    
    subgraph "Utility Endpoints"
        HEALTH_CHECK[GET /api/health]
        NOT_FOUND[404 Handler]
        ERROR_HANDLER[Error Handler]
    end
    
    CLIENT --> AUTH_REG
    CLIENT --> AUTH_LOGIN
    CLIENT --> AUTH_VERIFY
    CLIENT --> AUTH_LOGOUT
    CLIENT --> USER_PROFILE
    CLIENT --> USER_UPDATE
    CLIENT --> USER_PREFS
    CLIENT --> FAV_LIST
    CLIENT --> FAV_ADD
    CLIENT --> FAV_REMOVE
    CLIENT --> HEALTH_CHECK
    
    classDef auth fill:#ffcdd2
    classDef user fill:#c8e6c9
    classDef fav fill:#fff3e0
    classDef util fill:#e1f5fe
    
    class AUTH_REG,AUTH_LOGIN,AUTH_VERIFY,AUTH_LOGOUT auth
    class USER_PROFILE,USER_UPDATE,USER_PREFS user
    class FAV_LIST,FAV_ADD,FAV_REMOVE fav
    class HEALTH_CHECK,NOT_FOUND,ERROR_HANDLER util
```

## 🎨 Frontend Architecture

### React Component Hierarchy

```mermaid
graph TB
    APP[App.js - Root Component]
    
    subgraph "Layout Components"
        HEADER[Header.js]
        FOOTER[Footer.js]
    end
    
    subgraph "Page Components"
        HOME[Home.js]
        ARTICLE_DETAIL[ArticleDetail.js]
        LOGIN[Login.js]
        REGISTER[Register.js]
        PROFILE[Profile.js]
        FAVORITES[Favorites.js]
    end
    
    subgraph "Shared Components"
        ARTICLE_CARD[ArticleCard.js]
        FREE_COUNTER[FreeArticleCounter.js]
        SUB_STATUS[SubscriptionStatus.js]
    end
    
    subgraph "Context & Services"
        AUTH_CONTEXT[AuthContext.js]
        API_SERVICE[api.js]
        POOOL_CONFIG[pooolConfig.js]
    end
    
    subgraph "Routing"
        ROUTER[React Router]
        ROUTES[Route Definitions]
    end
    
    APP --> ROUTER
    ROUTER --> HEADER
    ROUTER --> FOOTER
    ROUTER --> HOME
    ROUTER --> ARTICLE_DETAIL
    ROUTER --> LOGIN
    ROUTER --> REGISTER
    ROUTER --> PROFILE
    ROUTER --> FAVORITES
    
    HOME --> ARTICLE_CARD
    ARTICLE_DETAIL --> FREE_COUNTER
    ARTICLE_DETAIL --> SUB_STATUS
    
    ALL_COMPONENTS -.-> AUTH_CONTEXT
    ALL_COMPONENTS --> API_SERVICE
    ARTICLE_DETAIL --> POOOL_CONFIG
    
    classDef layout fill:#e3f2fd
    classDef page fill:#f3e5f5
    classDef shared fill:#e8f5e8
    classDef service fill:#fff3e0
    classDef routing fill:#fce4ec
    
    class HEADER,FOOTER layout
    class HOME,ARTICLE_DETAIL,LOGIN,REGISTER,PROFILE,FAVORITES page
    class ARTICLE_CARD,FREE_COUNTER,SUB_STATUS shared
    class AUTH_CONTEXT,API_SERVICE,POOOL_CONFIG service
    class ROUTER,ROUTES routing
```

### State Management Architecture

```mermaid
graph TB
    subgraph "React Context API"
        AUTH_CTX[AuthContext Provider]
        AUTH_STATE[Authentication State]
        AUTH_ACTIONS[Auth Actions]
    end
    
    subgraph "Component State"
        LOCAL_STATE[Local Component State]
        FORM_STATE[Form State Management]
        UI_STATE[UI State (loading, errors)]
    end
    
    subgraph "External State"
        LOCALSTORAGE[localStorage]
        POOOL_STATE[Poool Service State]
        API_CACHE[API Response Cache]
    end
    
    subgraph "State Flow"
        COMPONENTS[React Components]
        HOOKS[Custom Hooks]
        REDUCERS[State Reducers]
    end
    
    COMPONENTS --> AUTH_CTX
    COMPONENTS --> LOCAL_STATE
    COMPONENTS --> HOOKS
    
    AUTH_CTX --> AUTH_STATE
    AUTH_CTX --> AUTH_ACTIONS
    AUTH_CTX --> REDUCERS
    
    AUTH_STATE --> LOCALSTORAGE
    HOOKS --> API_CACHE
    COMPONENTS --> POOOL_STATE
    
    classDef context fill:#e1f5fe
    classDef local fill:#f3e5f5
    classDef external fill:#e8f5e8
    classDef flow fill:#fff3e0
    
    class AUTH_CTX,AUTH_STATE,AUTH_ACTIONS context
    class LOCAL_STATE,FORM_STATE,UI_STATE local
    class LOCALSTORAGE,POOOL_STATE,API_CACHE external
    class COMPONENTS,HOOKS,REDUCERS flow
```

## 🛡️ Security Architecture

### Multi-Layer Security Model

```mermaid
graph TB
    subgraph "Frontend Security"
        INPUT_VAL[Input Validation]
        XSS_PROTECT[XSS Protection]
        CSRF_TOKEN[CSRF Tokens]
        SECURE_STORAGE[Secure Token Storage]
    end
    
    subgraph "API Security"
        CORS_CONFIG[CORS Configuration]
        HELMET_SEC[Security Headers]
        RATE_LIMIT[Rate Limiting]
        JWT_AUTH[JWT Authentication]
    end
    
    subgraph "Data Security"
        BCRYPT_HASH[Password Hashing]
        INPUT_SANIT[Input Sanitization]
        SQL_INJECT[Injection Prevention]
        DATA_VALID[Data Validation]
    end
    
    subgraph "Infrastructure Security"
        HTTPS_TLS[HTTPS/TLS]
        ENV_VARS[Environment Variables]
        SECRET_MGT[Secret Management]
        ACCESS_CTRL[Access Control]
    end
    
    USER_INPUT --> INPUT_VAL
    INPUT_VAL --> XSS_PROTECT
    XSS_PROTECT --> CSRF_TOKEN
    CSRF_TOKEN --> SECURE_STORAGE
    
    API_REQUESTS --> CORS_CONFIG
    CORS_CONFIG --> HELMET_SEC
    HELMET_SEC --> RATE_LIMIT
    RATE_LIMIT --> JWT_AUTH
    
    DATA_INPUT --> BCRYPT_HASH
    BCRYPT_HASH --> INPUT_SANIT
    INPUT_SANIT --> SQL_INJECT
    SQL_INJECT --> DATA_VALID
    
    DEPLOYMENT --> HTTPS_TLS
    HTTPS_TLS --> ENV_VARS
    ENV_VARS --> SECRET_MGT
    SECRET_MGT --> ACCESS_CTRL
```

### Authentication Security Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant MW as Security Middleware
    participant AUTH as Auth Service
    participant DB as Database
    
    Note over U,DB: Secure Authentication Process
    
    U->>FE: Submit credentials
    FE->>FE: Client-side validation
    FE->>MW: HTTPS request + headers
    MW->>MW: Rate limiting check
    MW->>MW: CORS validation
    MW->>MW: Security headers
    MW->>AUTH: Validated request
    AUTH->>AUTH: Input sanitization
    AUTH->>AUTH: Password validation rules
    AUTH->>DB: Secure query (parameterized)
    DB-->>AUTH: User data (if found)
    AUTH->>AUTH: bcrypt.compare(password, hash)
    
    alt Authentication successful
        AUTH->>AUTH: Generate JWT (secure)
        AUTH-->>FE: Return token + user data
        FE->>FE: Store token (httpOnly if possible)
        FE-->>U: Authenticated state
    else Authentication failed
        AUTH-->>FE: Generic error message
        FE-->>U: Login failed (no details)
    end
```

## 🚀 Deployment Architecture

### Production Deployment Flow

```mermaid
graph TB
    subgraph "Development Environment"
        DEV_FE[React Dev Server<br/>localhost:3000]
        DEV_BE[Express Dev Server<br/>localhost:5001]
        DEV_DB[Local MongoDB]
    end
    
    subgraph "Build Process"
        BUILD_FE[npm run build]
        BUILD_BE[Production Bundle]
        OPTIMIZE[Asset Optimization]
    end
    
    subgraph "Production Environment"
        PROD_FE[Static File Server<br/>nginx/Apache]
        PROD_BE[Node.js Process<br/>PM2/Docker]
        PROD_DB[MongoDB Atlas/Cloud]
    end
    
    subgraph "External Services"
        POOOL_PROD[Poool Production]
        CDN[Content Delivery Network]
        MONITORING[Application Monitoring]
    end
    
    DEV_FE --> BUILD_FE
    DEV_BE --> BUILD_BE
    BUILD_FE --> OPTIMIZE
    
    BUILD_FE --> PROD_FE
    BUILD_BE --> PROD_BE
    DEV_DB --> PROD_DB
    
    PROD_FE --> CDN
    PROD_BE --> MONITORING
    PROD_FE --> POOOL_PROD
    
    classDef dev fill:#ffeb3b
    classDef build fill:#ff9800
    classDef prod fill:#4caf50
    classDef external fill:#9c27b0
    
    class DEV_FE,DEV_BE,DEV_DB dev
    class BUILD_FE,BUILD_BE,OPTIMIZE build
    class PROD_FE,PROD_BE,PROD_DB prod
    class POOOL_PROD,CDN,MONITORING external
```

## 🛠️ Tech Stack

**Frontend**: React 18, React Router, Axios, Poool React Access  
**Backend**: Node.js, Express.js, JWT Authentication, bcrypt  
**Database**: MongoDB with in-memory fallback  
**Development**: Docker, ESLint, Prettier, Jest

## � Configuration

### Poool Integration Setup

1. **Create Poool Account**: Sign up at [Poool Dashboard](https://dashboard.poool.fr)
2. **Get App ID**: Copy your App ID from the dashboard
3. **Configure Environment**: Add `REACT_APP_POOOL_APP_ID` to your `.env` file
4. **Set Paywall Rules**: Configure article limits and access rules in Poool dashboard

### Authentication Configuration

The app uses JWT-based authentication with the following features:
- **Session Persistence**: Automatic login restoration on page refresh
- **Secure Storage**: JWT tokens stored in localStorage with expiration
- **Route Protection**: Private routes for authenticated users only
- **Password Security**: bcrypt hashing with salt rounds

### Database Options

**MongoDB (Recommended for Production)**
```env
MONGODB_URI=mongodb://localhost:27017/newssite
```

**In-Memory Storage (Development Fallback)**
- Automatically used when MongoDB is unavailable
- Data persists only during application runtime
- Perfect for development and testing

## 🆘 Troubleshooting

### Application Monitoring Stack
```mermaid
graph TB
    subgraph "Frontend Monitoring"
        ERROR_BOUND[Error Boundaries]
        CONSOLE_LOG[Console Logging]
        USER_ANALYTICS[User Analytics]
    end
    
    subgraph "Backend Monitoring"
        ACCESS_LOG[Access Logs]
        ERROR_LOG[Error Logs]
        PERF_LOG[Performance Logs]
        HEALTH_CHECK[Health Endpoints]
    end
    
    subgraph "Infrastructure Monitoring"
        SERVER_METRICS[Server Metrics]
        DB_METRICS[Database Metrics]
        UPTIME[Uptime Monitoring]
    end
    
    subgraph "External Monitoring"
        POOOL_ANALYTICS[Poool Analytics]
        USER_BEHAVIOR[User Behavior Tracking]
    end
    
    APPLICATION --> ERROR_BOUND
    APPLICATION --> CONSOLE_LOG
    APPLICATION --> USER_ANALYTICS
    
    API --> ACCESS_LOG
    API --> ERROR_LOG
    API --> PERF_LOG
    API --> HEALTH_CHECK
    
    INFRASTRUCTURE --> SERVER_METRICS
    INFRASTRUCTURE --> DB_METRICS
    INFRASTRUCTURE --> UPTIME
    
    BUSINESS --> POOOL_ANALYTICS
    BUSINESS --> USER_BEHAVIOR
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd news-site-demo
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   This will install both frontend and backend dependencies.

3. **Set up environment variables:**
   
   **Frontend (.env):**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   
   **Backend (backend/.env):**
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/news-site-demo
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

### Development

**Run both frontend and backend concurrently:**
```bash
npm run dev
```

**Or run them separately:**

Frontend only (runs on http://localhost:3000):
```bash
npm start
```

Backend only (runs on http://localhost:5000):
```bash
npm run dev:backend
```

### Building for Production

```bash
npm run build
```

## 📡 API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /api/auth/verify-token`
Verify JWT token validity.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": { /* user object */ }
}
```

#### `POST /api/auth/logout`
Logout user (client-side token removal).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Management Endpoints

#### `GET /api/users/profile` 🔒
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "favoriteArticles": [1, 3, 5],
    "preferences": {
      "newsletter": true,
      "notifications": true
    },
    "createdAt": "2025-09-30T12:00:00Z"
  }
}
```

#### `PUT /api/users/profile` 🔒
Update user profile information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### `PUT /api/users/preferences` 🔒
Update user preferences.

**Request Body:**
```json
{
  "newsletter": false,
  "notifications": true
}
```

### Favorites Management

#### `GET /api/users/favorites` 🔒
Get user's favorite articles.

**Response:**
```json
{
  "success": true,
  "favorites": [
    {
      "articleId": 1,
      "addedAt": "2025-09-30T12:00:00Z"
    }
  ]
}
```

#### `POST /api/users/favorites/:articleId` 🔒
Add article to favorites.

**Response:**
```json
{
  "success": true,
  "message": "Article added to favorites"
}
```

#### `DELETE /api/users/favorites/:articleId` 🔒
Remove article from favorites.

**Response:**
```json
{
  "success": true,
  "message": "Article removed from favorites"
}
```

### Utility Endpoints

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-30T12:00:00Z",
  "database": "connected",
  "memory": "4.2MB"
}
```

### Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, PUT requests |
| `201` | Created | Successful POST requests |
| `400` | Bad Request | Validation errors |
| `401` | Unauthorized | Missing/invalid authentication |
| `403` | Forbidden | Access denied |
| `404` | Not Found | Resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server errors |

## Frontend Routes

- `/` - Home page with article list
- `/article/:id` - Individual article page
- `/login` - User login page
- `/register` - User registration page
- `/profile` - User profile and settings
- `/favorites` - User's favorite articles

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api

# Poool Configuration
REACT_APP_POOOL_APP_ID=your-poool-app-id

# Development Settings
REACT_APP_ENV=development
GENERATE_SOURCEMAP=true
```

#### Backend (backend/.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/news-site-demo
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/news-site-demo

# Authentication Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm start\"",
    "start": "react-scripts start",
    "dev:backend": "cd backend && npm run dev",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "install:all": "npm install && cd backend && npm install",
    "build:backend": "cd backend && npm run build"
  }
}
```

## 🧪 Testing Strategy

### Testing Architecture

```mermaid
graph TB
    subgraph "Frontend Testing"
        UNIT_FE[Unit Tests - Jest]
        COMP_TEST[Component Tests - RTL]
        E2E_FE[E2E Tests - Cypress]
    end
    
    subgraph "Backend Testing"
        UNIT_BE[Unit Tests - Jest]
        INT_TEST[Integration Tests]
        API_TEST[API Tests - Supertest]
    end
    
    subgraph "End-to-End Testing"
        USER_FLOW[User Flow Tests]
        AUTH_FLOW[Authentication Flow]
        PAYWALL_TEST[Paywall Integration]
    end
    
    subgraph "Performance Testing"
        LOAD_TEST[Load Testing]
        STRESS_TEST[Stress Testing]
        PERF_PROF[Performance Profiling]
    end
    
    DEVELOPMENT --> UNIT_FE
    DEVELOPMENT --> UNIT_BE
    INTEGRATION --> INT_TEST
    INTEGRATION --> API_TEST
    PRODUCTION --> USER_FLOW
    PRODUCTION --> AUTH_FLOW
    PRODUCTION --> PAYWALL_TEST
    SCALING --> LOAD_TEST
    SCALING --> STRESS_TEST
    SCALING --> PERF_PROF
```

### Test Coverage Areas

| Component | Test Type | Coverage |
|-----------|-----------|----------|
| **Authentication** | Unit + Integration | Login, Register, Token handling |
| **User Management** | Unit + API | Profile, Preferences, Validation |
| **Favorites System** | Integration | Add, Remove, List operations |
| **Poool Integration** | E2E | Paywall display, Article limits |
| **Error Handling** | Unit | Input validation, Error states |
| **Security** | Integration | Auth middleware, Rate limiting |

## 🚀 Deployment Guide

### Development Deployment

1. **Local Development:**
   ```bash
   # Install dependencies
   npm run install:all
   
   # Start development servers
   npm run dev
   ```

2. **Environment Setup:**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp backend/.env.example backend/.env
   
   # Configure variables
   vim .env
   vim backend/.env
   ```

### Production Deployment

#### Option 1: Traditional Server Deployment

```bash
# 1. Build frontend
npm run build

# 2. Configure production environment
export NODE_ENV=production
export MONGODB_URI="your-production-mongodb-uri"
export JWT_SECRET="your-production-jwt-secret"

# 3. Start backend with PM2
pm2 start backend/server.js --name "news-site-api"

# 4. Serve frontend with nginx
# Copy build/ contents to nginx web root
```

#### Option 2: Docker Deployment

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
```

```dockerfile
# Dockerfile.backend  
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
EXPOSE 5001
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
      
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/newssite
    depends_on:
      - mongo
      
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
      
volumes:
  mongo_data:
```

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check MongoDB status
systemctl status mongod

# Check connection
mongo --eval "db.runCommand('ping')"

# Fix common connection issues
sudo systemctl restart mongod
```

#### Port Conflicts
```bash
# Check what's using ports
lsof -ti:3000  # Frontend port
lsof -ti:5001  # Backend port

# Kill processes
kill -9 $(lsof -ti:3000)
```

#### JWT Token Issues
```javascript
// Debug token in browser console
const token = localStorage.getItem('authToken');
console.log('Token:', token);
console.log('Payload:', JSON.parse(atob(token.split('.')[1])));
```

#### Poool Integration Issues
```javascript
// Debug Poool events in browser console
window.addEventListener('message', (event) => {
  if (event.origin === 'https://api.poool.fr') {
    console.log('Poool event:', event.data);
  }
});
```

### Performance Issues

#### Frontend Performance
```javascript
// React DevTools Profiler
// Chrome DevTools Performance tab
// Bundle analyzer
npm install --save-dev webpack-bundle-analyzer
npx react-scripts build
npx webpack-bundle-analyzer build/static/js/*.js
```

#### Backend Performance
```javascript
// Add request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path}: ${Date.now() - req.startTime}ms`);
  });
  next();
});
```

## Features in Detail

### User Authentication
- Secure password hashing with bcrypt
- JWT-based stateless authentication
- Input validation and sanitization
- Rate limiting for auth endpoints
- Automatic token verification on app load

### Article Management
- Article browsing and reading
- Favorite/unfavorite functionality
- Integration with existing Poool paywall system
- Responsive article cards and detail views

### User Profile
- Edit personal information
- Manage notification preferences
- View and manage favorite articles
- Account settings and preferences

## Security Features

- Password strength requirements
- JWT token validation
- Input sanitization
- CORS configuration
- Helmet for security headers
- Rate limiting
- Protected routes
- Environment variable configuration

## � Technical Architecture

### System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        BROWSER[Web Browser]
        MOBILE[Mobile Device]
    end
    
    subgraph "Frontend Layer"
        REACT[React App]
        ROUTER[React Router]
        AUTH_CTX[Auth Context]
        POOOL_SDK[Poool SDK]
    end
    
    subgraph "API Layer"
        EXPRESS[Express Server]
        AUTH_MW[Auth Middleware]
        ROUTES[API Routes]
    end
    
    subgraph "Data Layer"
        MONGODB[(MongoDB)]
        MEMORY[(In-Memory Store)]
    end
    
    subgraph "External Services"
        POOOL_API[Poool API]
        CDN[Static Assets CDN]
    end
    
    BROWSER --> REACT
    MOBILE --> REACT
    
    REACT --> ROUTER
    REACT --> AUTH_CTX
    REACT --> POOOL_SDK
    
    REACT --> EXPRESS
    EXPRESS --> AUTH_MW
    EXPRESS --> ROUTES
    
    ROUTES --> MONGODB
    ROUTES --> MEMORY
    
    POOOL_SDK --> POOOL_API
    REACT --> CDN
    
    class BROWSER,MOBILE client
    class REACT,ROUTER,AUTH_CTX,POOOL_SDK frontend  
    class EXPRESS,AUTH_MW,ROUTES api
    class MONGODB,MEMORY data
    class POOOL_API,CDN external
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth API
    participant D as Database
    
    U->>F: Login Request
    F->>A: POST /api/auth/login
    A->>D: Validate Credentials
    D-->>A: User Data
    A-->>F: JWT Token
    F->>F: Store Token (localStorage)
    F-->>U: Login Success
    
    Note over F: Subsequent Requests
    F->>A: API Request + JWT Header
    A->>A: Verify JWT Token
    A-->>F: Protected Resource
    
    Note over F: Session Restoration
    U->>F: Page Refresh
    F->>F: Check localStorage for token
    F->>A: Verify token validity
    A-->>F: User data (if valid)
    F-->>U: Auto-login
```

### Database Design

```mermaid
erDiagram
    User ||--o{ Article : favorites
    User {
        string id PK
        string email UK
        string password
        string name
        array favorites
        date createdAt
        date updatedAt
    }
    
    Article {
        string id PK
        string title
        string content
        string author
        date publishedAt
        boolean isPremium
        array tags
    }
```

## 📜 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 **Documentation**: This README and inline code comments
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/radominchev/news-site-demo/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/radominchev/news-site-demo/discussions)

---

**Built with ❤️ using React, Node.js, and modern web technologies**

*For the latest updates and releases, please check our [GitHub repository](https://github.com/radominchev/news-site-demo).*