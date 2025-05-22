# G18 - iMood (ItzInwZerZa007)

## Architecture

This is a monorepo containing two main applications:

```
📦 G18-ItzInwZerZa007-PreHack-2025/
├── 🎨 frontend/     # React SPA with Vite
├── 🔧 backend/      # Node.js API with Hono
```

### Tech Stack

**Frontend:**
- **Vite + React 19** - Lightning-fast development and modern React features
- **Tailwind CSS** - Utility-first styling with custom design system
- **Radix UI** - Accessible, unstyled UI components
- **Shadcn UI** - UI Library based on Radix UI components
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant form handling with validation
- **React Router** - Client-side routing

**Backend:**
-  **Hono.js** - Fast, lightweight web framework for Edge
- ️ **Prisma + Mysql** - Type-safe database access and migrations
-  **JWT Authentication** - Secure user sessions with HTTP-only cookies

**Development:**
- **PNPM Workspaces** - Efficient monorepo package management
- **Turbo** - High-performance build system
- **ESLint + Prettier** - Code quality and formatting

## Quick Start

### Prerequisites
- **Node.js 22+** (LTS recommended)
- **PNPM 9+** (package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CSC105-2024/G18-ItzInwZerZa007-PreHack-2025.git
   cd G18-ItzInwZerZa007-PreHack-2025
   ```

2. **Enable Corepack for package manager consistency**
   ```bash
   corepack enable
   corepack use pnpm@latest
   ```

3. **Install all dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   
   # Frontend configuration  
   cp frontend/.env.example frontend/.env
   ```

5. **Initialize the database**
   ```bash
   cd backend
   pnpm prisma:generate
   pnpm prisma:init
   pnpm run prisma:seed
   pnpm run prisma:simulate # (Optional) If you want to simulate a user who already has mood data
   ```

6. **Start development servers**
   ```bash
   # Run both frontend and backend
   pnpm dev
   
   # Or run individually
   pnpm dev:frontend  # Frontend only (http://localhost:5173)
   pnpm dev:backend   # Backend only (http://localhost:3000)
   ```

### Database Schema

Key entities in our system:
- **Users**
- **Mood** - Available Moods
- **History** - Users' mood tracking records

## API Endpoints

### General Endpoints

| Method | Route | Description                                                                     | Auth Required |
|--------|-------|---------------------------------------------------------------------------------|---------------|
| `GET`  | `/`   | Health check endpoint that returns API welcome message and version information. | No            |

### Authentication Endpoints

| Method   | Route                     | Description                                                                                                        | Auth Required |
|----------|---------------------------|--------------------------------------------------------------------------------------------------------------------|---------------|
| `POST`   | `/authentication/sign-in` | Authenticates a user with email and password. Sets authentication cookie on success.                               | No            |
| `POST`   | `/authentication/sign-up` | Creates a new user account with email, password, and password confirmation. Sets authentication cookie on success. | No            |
| `DELETE` | `/authentication/session` | Signs out the current user by clearing the authentication cookie.                                                  | No            |

### User Management Endpoints

| Method   | Route                 | Description                                                                                                                                                          | Auth Required |
|----------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `GET`    | `/me`                 | Retrieves the current authenticated user's profile information (id, email).                                                                                          | Yes           |
| `DELETE` | `/account`            | Permanently deletes the current user's account and all associated mood data.                                                                                         | Yes           |
| `GET`    | `/account/statistics` | Retrieves mood statistics for the authenticated user with configurable time periods (weekly, monthly, yearly). Returns summary stats and aggregated data for charts. | Yes           |

### Mood Management Endpoints

| Method   | Route          | Description                                                                                                        | Auth Required |
|----------|----------------|--------------------------------------------------------------------------------------------------------------------|---------------|
| `GET`    | `/moods`       | Retrieves all available mood types/categories that users can select from.                                          | Yes           |
| `GET`    | `/history`     | Retrieves paginated mood history entries for the authenticated user. Supports `limit` and `page` query parameters. | Yes           |
| `POST`   | `/history`     | Creates a new mood entry with mood ID and optional note (max 25,000 characters).                                   | Yes           |
| `PATCH`  | `/history/:id` | Updates an existing mood entry's mood type and/or note.                                                            | Yes           |
| `DELETE` | `/history/:id` | Deletes a specific mood entry belonging to the authenticated user.                                                 | Yes           |

## Deployment

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="mysql://user:password@host:3306/db"
SHADOW_DATABASE_URL="mysql://user:password@host:3306/db_shadow"
JWT_SECRET="your-secret-key"
```

**Frontend (.env)**
```env
VITE_API_URL="http://localhost:3000"
```

### Manual Deployment
```bash
# Build frontend
cd frontend && pnpm build

# Build backend  
cd backend && pnpm build

# Start production server
cd backend && pnpm start
```

## 👥 Team

**G18 Development Team:**
- **Theerawat Patthawee** ([@ttwrpz](https://github.com/ttwrpz)) - Fullstack
- **Karnsinee Phophutaraksa** ([@Tienkarnsinee](https://github.com/Tienkarnsinee)) - Fullstack & UX/UI
- **Chotiwet Wisitworanat** ([@Sunthewhat](https://github.com/Sunthewhat)) - Mentor
- **Thanatat Wongabut** ([@thanatat-wong](https://github.com/thanatat-wong)) - Mentor

---

Made with ❤️ by the G18 Team | **iMood - Your emotional journal, made beautiful.**