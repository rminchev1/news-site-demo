# News Site Demo with Authentication

A full-stack news website built with React frontend and Node.js backend, featuring user authentication, article management, and paywall integration with Poool.

## 📋 Table of Contents

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

### Frontend Stack
| Technology | Version | Purpose | Configuration |
|------------|---------|---------|---------------|
| **React** | 18.x | UI Library | `create-react-app` with custom config |
| **React Router DOM** | 6.x | Client-side routing | Hash/Browser routing |
| **Axios** | 1.x | HTTP client | Interceptors for auth headers |
| **Poool React Access** | 4.1.5+ | Paywall integration | AccessContext + RestrictedContent |
| **CSS3** | - | Styling | Responsive design + CSS Grid/Flexbox |

### Backend Stack
| Technology | Version | Purpose | Configuration |
|------------|---------|---------|---------------|
| **Node.js** | 18.x+ | Runtime environment | ES6+ with modern features |
| **Express.js** | 4.x | Web framework | RESTful API with middleware |
| **MongoDB** | 5.x+ | Primary database | Replica set recommended |
| **Mongoose** | 7.x | ODM for MongoDB | Schema validation + middleware |
| **JWT** | 9.x | Authentication tokens | RS256 algorithm |
| **bcryptjs** | 2.x | Password hashing | 12 rounds (configurable) |

### Security & Middleware
| Technology | Purpose | Implementation |
|------------|---------|----------------|
| **Helmet** | Security headers | CSP, HSTS, XSS protection |
| **CORS** | Cross-origin requests | Configurable origins |
| **express-validator** | Input validation | Schema-based validation |
| **express-rate-limit** | Rate limiting | Sliding window algorithm |

### Development Tools
| Tool | Purpose | Configuration |
|------|---------|---------------|
| **nodemon** | Dev server auto-reload | Watch files + ignore patterns |
| **concurrently** | Run multiple processes | Frontend + Backend parallel |
| **ESLint** | Code linting | Airbnb style guide |
| **Prettier** | Code formatting | Auto-format on save |

## 📁 Project Structure

```
news-site-demo/
├── 📁 backend/                          # Node.js/Express backend
│   ├── 📁 middleware/                   # Custom middleware
│   │   ├── auth.js                      # JWT authentication
│   │   └── validation.js                # Input validation
│   ├── 📁 models/                       # Data models
│   │   ├── User.js                      # MongoDB user model
│   │   ├── InMemoryUser.js              # Fallback storage
│   │   └── UserAdapter.js               # Unified interface
│   ├── 📁 routes/                       # API route definitions
│   │   ├── auth.js                      # Authentication routes
│   │   └── users.js                     # User management routes
│   ├── 📁 config/                       # Configuration files
│   │   └── database.js                  # Database connection
│   ├── server.js                        # Express app entry point
│   ├── package.json                     # Backend dependencies
│   └── .env                             # Environment variables
├── 📁 src/                              # React frontend source
│   ├── 📁 components/                   # Reusable components
│   │   ├── Header.js                    # Navigation header
│   │   ├── Footer.js                    # Site footer
│   │   ├── ArticleCard.js               # Article preview card
│   │   ├── FreeArticleCounter.js        # Paywall counter
│   │   └── SubscriptionStatus.js        # User status banner
│   ├── 📁 pages/                        # Page components
│   │   ├── Login.js                     # Login form
│   │   ├── Register.js                  # Registration form
│   │   ├── Profile.js                   # User profile
│   │   └── Favorites.js                 # Favorite articles
│   ├── 📁 context/                      # React Context
│   │   └── AuthContext.js               # Authentication state
│   ├── 📁 services/                     # External services
│   │   └── api.js                       # Axios configuration
│   ├── 📁 utils/                        # Utility functions
│   │   └── pooolConfig.js               # Poool configuration
│   ├── 📁 data/                         # Static data
│   │   └── articles.js                  # Sample articles
│   ├── Home.js                          # Homepage component
│   ├── ArticleDetail.js                 # Article detail page
│   ├── App.js                           # Root component
│   ├── index.js                         # React entry point
│   └── Home.css                         # Global styles
├── 📁 public/                           # Static assets
│   ├── index.html                       # HTML template
│   └── favicon.ico                      # Site icon
├── package.json                         # Frontend dependencies
├── .env                                 # Frontend environment
└── README.md                            # This documentation
```

## ⚡ Performance Considerations

### Frontend Optimization
```mermaid
graph LR
    subgraph "Bundle Optimization"
        CODE_SPLIT[Code Splitting]
        LAZY_LOAD[Lazy Loading]
        TREE_SHAKE[Tree Shaking]
    end
    
    subgraph "Runtime Optimization"
        MEMO[React.memo]
        CALLBACK[useCallback/useMemo]
        VIRTUAL[Virtual Scrolling]
    end
    
    subgraph "Asset Optimization"
        IMG_OPT[Image Optimization]
        CSS_MIN[CSS Minification]
        GZIP[GZIP Compression]
    end
    
    BUNDLE --> CODE_SPLIT
    BUNDLE --> LAZY_LOAD  
    BUNDLE --> TREE_SHAKE
    
    RUNTIME --> MEMO
    RUNTIME --> CALLBACK
    RUNTIME --> VIRTUAL
    
    ASSETS --> IMG_OPT
    ASSETS --> CSS_MIN
    ASSETS --> GZIP
```

### Backend Optimization
- **Connection Pooling**: MongoDB connection pool (10-100 connections)
- **Caching Strategy**: In-memory caching for frequently accessed data
- **Database Indexing**: Compound indexes on email + status
- **Compression**: GZIP middleware for API responses
- **Request Optimization**: Pagination, field selection, data aggregation

## 🔍 Monitoring & Logging

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

## 🚀 Future Enhancements

### Roadmap

```mermaid
gantt
    title Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1
    User Authentication    :done,    auth, 2025-09-01, 2025-09-15
    Basic UI Components    :done,    ui, 2025-09-10, 2025-09-25
    Poool Integration     :done,    paywall, 2025-09-20, 2025-09-30
    section Phase 2
    Advanced Analytics    :active,  analytics, 2025-10-01, 2025-10-15
    Mobile App            :         mobile, 2025-10-15, 2025-11-15
    Advanced Paywall      :         advanced, 2025-10-01, 2025-10-30
    section Phase 3
    Multi-language       :          i18n, 2025-11-01, 2025-11-30
    Admin Dashboard      :          admin, 2025-11-15, 2025-12-15
    Advanced Security    :          security, 2025-12-01, 2025-12-30
```

### Planned Features

#### Short-term (Next Sprint)
- [ ] **Enhanced Analytics**: User behavior tracking and insights
- [ ] **Mobile Optimization**: PWA capabilities and mobile-first design
- [ ] **Advanced Caching**: Redis integration for improved performance
- [ ] **Email Integration**: Newsletter and notification system

#### Medium-term (Next Quarter)
- [ ] **Multi-language Support**: i18n with dynamic language switching
- [ ] **Admin Dashboard**: Content management and user administration
- [ ] **Advanced Paywall**: Subscription tiers and payment integration
- [ ] **Social Features**: Article sharing and user interactions

#### Long-term (6+ Months)
- [ ] **Microservices Architecture**: Service decomposition for scalability
- [ ] **Real-time Features**: WebSocket integration for live updates
- [ ] **Advanced Security**: OAuth2, 2FA, and enterprise security features
- [ ] **AI Integration**: Content recommendations and personalization

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/news-site-demo.git
   cd news-site-demo
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development Setup**
   ```bash
   npm run install:all
   npm run dev
   ```

4. **Code Standards**
   - Follow ESLint configuration
   - Write tests for new features
   - Update documentation
   - Follow conventional commits

5. **Submit Pull Request**
   - Clear description of changes
   - Link to related issues
   - Ensure CI passes
   - Request review from maintainers

### Code Style Guidelines

#### JavaScript/React
```javascript
// Use functional components with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  );
};

export default MyComponent;
```

#### API Design
```javascript
// RESTful endpoints with consistent naming
GET    /api/users          // List users
GET    /api/users/:id      // Get specific user
POST   /api/users          // Create user
PUT    /api/users/:id      // Update user
DELETE /api/users/:id      // Delete user
```

### Testing Requirements

- **Unit Tests**: Cover all utility functions and hooks
- **Component Tests**: Test React components with React Testing Library
- **Integration Tests**: Test API endpoints with proper mocking
- **E2E Tests**: Test critical user flows

## 📊 Analytics & Monitoring

### Key Metrics Dashboard

```mermaid
graph TB
    subgraph "User Metrics"
        DAU[Daily Active Users]
        REG[New Registrations]
        RET[User Retention]
    end
    
    subgraph "Content Metrics" 
        VIEWS[Article Views]
        ENGAGEMENT[Engagement Rate]
        FAVORITES[Favorite Actions]
    end
    
    subgraph "Business Metrics"
        CONVERSION[Paywall Conversion]
        REVENUE[Revenue Tracking]
        CHURN[User Churn Rate]
    end
    
    subgraph "Technical Metrics"
        UPTIME[System Uptime]
        RESPONSE[Response Times]
        ERRORS[Error Rates]
    end
    
    DASHBOARD --> DAU
    DASHBOARD --> REG
    DASHBOARD --> RET
    DASHBOARD --> VIEWS
    DASHBOARD --> ENGAGEMENT
    DASHBOARD --> FAVORITES
    DASHBOARD --> CONVERSION
    DASHBOARD --> REVENUE
    DASHBOARD --> CHURN
    DASHBOARD --> UPTIME
    DASHBOARD --> RESPONSE
    DASHBOARD --> ERRORS
```

### Monitoring Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| **Application Monitoring** | New Relic / DataDog | Performance monitoring |
| **Error Tracking** | Sentry | Error reporting and tracking |
| **Analytics** | Google Analytics | User behavior analysis |
| **Uptime Monitoring** | Pingdom / StatusPage | Service availability |
| **Log Aggregation** | ELK Stack | Centralized logging |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 News Site Demo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🆘 Support & Community

### Getting Help

- 📚 **Documentation**: This README and inline code comments
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/news-site-demo/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/news-site-demo/discussions)
- 💬 **Community**: Join our [Discord Server](https://discord.gg/your-invite)

### Maintainers

- **Lead Developer**: [@yourusername](https://github.com/yourusername)
- **Backend Specialist**: [@backend-dev](https://github.com/backend-dev)
- **Frontend Specialist**: [@frontend-dev](https://github.com/frontend-dev)

### Acknowledgments

- **Poool**: For paywall integration capabilities
- **React Team**: For the amazing React framework
- **Express.js**: For the robust backend framework
- **MongoDB**: For reliable database solutions
- **Community Contributors**: All developers who have contributed to this project

---

**Built with ❤️ using modern web technologies**

*For the latest updates and releases, please check our [GitHub repository](https://github.com/yourusername/news-site-demo).*