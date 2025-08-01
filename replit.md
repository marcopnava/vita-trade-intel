# VITA Trading Intelligence Platform

## Overview

VITA (Virtual Investment Technology Assistant) is a full-stack trading intelligence platform built for portfolio management, market analysis, and trading governance. The platform combines modern web technologies with financial data visualization to provide traders and administrators with comprehensive trading tools and insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for multi-page setup

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development**: Hot reload with Vite middleware integration

### UI Component System
- **Component Library**: Radix UI primitives with custom styling
- **Design System**: Custom VITA brand colors and theming
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA compliance through Radix UI components

## Key Components

### Authentication System
- Mock authentication service with predefined users
- Role-based access (admin/trader roles)
- Session persistence using localStorage
- Protected route components

### Trading Features
- **Portfolio Management**: Real-time portfolio tracking and P&L calculations
- **Market Charts**: TradingView widget integration for 35+ financial instruments
- **Trade Governance**: Voting system for trade approval
- **Analytics**: Market analysis and reporting tools

### Communication System
- Real-time chat functionality with channel support
- Alert system with categorized notifications
- User presence and activity tracking

### Data Management
- PostgreSQL database with comprehensive trading schema
- Type-safe data models with Zod validation schemas
- Complete CRUD operations through DatabaseStorage interface
- Real-time market data ingestion from Yahoo Finance, RSS feeds
- Automated data fetching: prices (15min), news (10min), economic events (hourly)
- Seeded with realistic trading data for development

## Data Flow

### Client-Server Communication
1. Frontend makes API requests to Express backend
2. Backend processes requests using DatabaseStorage interface
3. PostgreSQL database with full relational schema
4. Real-time data persistence with proper transactions

### State Management Flow
1. TanStack Query manages server state and caching
2. Local component state for UI interactions
3. Authentication state managed through custom hooks
4. Database-backed real-time updates

### Database Schema
- **Users**: Authentication, roles, voting weights
- **Clients**: Portfolio accounts with profit-sharing
- **Trades**: Position tracking with P&L calculations
- **Proposals**: Governance system for trade decisions
- **Votes**: Democratic trade approval mechanism
- **Chat Messages**: Communication channels
- **Alerts**: Notification system

## External Dependencies

### UI and Styling
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Data and State
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Date-fns**: Date manipulation

### Trading Specific
- **TradingView Widgets**: Market chart integration
- **Yahoo Finance API**: Real-time OHLC price data for 35+ instruments
- **RSS Parser**: Financial news from multiple sources
- **Node-cron**: Automated data fetching scheduler
- **Cheerio**: Economic calendar scraping from ForexFactory

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **ESBuild**: Production bundling
- **Replit integrations**: Development environment support

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend
- TSX for TypeScript execution in development
- Concurrent frontend/backend development setup

### Production Build
1. Frontend: Vite builds React app to `dist/public`
2. Backend: ESBuild bundles server code to `dist/index.js`
3. Static asset serving through Express in production
4. Database migrations via Drizzle Kit

### Environment Configuration
- Environment variables for database connection
- Replit-specific configurations for hosting
- Production/development mode switching

### Database Setup
- Drizzle configuration points to PostgreSQL
- Migration files in `./migrations` directory
- Schema definitions in shared directory for type safety
- Ready for Neon Database or any PostgreSQL provider

The application follows a monorepo structure with shared TypeScript types between frontend and backend, ensuring type safety across the full stack while maintaining clear separation of concerns.