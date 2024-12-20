# SaaS Starter Kit PRD

## Tech Stack
- **Frontend**: Nuxt 3 + TypeScript
- **Styling**: TailwindCSS + shadcn-vue
- **Database**: Turso
- **ORM**: Drizzle
- **Auth**: nuxt-auth-utils
- **Emails**: Resend
- **Payments**: Stripe

## Authentication System
- Email/password login
- Session management
- Password reset flow
- Email verification
- Protected routes
- Rate limiting

## Email System (Resend)
- Welcome email
- Password reset emails
- Email verification
- Payment/subscription notifications
- Failed payment alerts

## Payment System (Stripe)
- Subscription management
- Webhook endpoints
- Customer portal access
- Payment processing
- Basic pricing page

## Database Schema
### Users Table
- id (primary key)
- email (unique)
- password_hash
- email_verified
- stripe_customer_id
- subscription_status
- created_at
- updated_at

### Password Reset Table
- id (primary key)
- user_id (foreign key)
- token
- expires_at

### Payment History Table
- id (primary key)
- user_id (foreign key)
- stripe_event_id
- amount
- status
- created_at

## Core Pages
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard
- `/settings` - User settings
- `/reset-password` - Password reset
- `/pricing` - Pricing page
- `/contact` - Contact form

## UI Components
### Essential Components
- Loading states/spinners
- Toast notifications
- Form components
- Error states
- Basic layouts

### Form Components
- Input fields
- Buttons
- Checkboxes
- Radio buttons
- Dropdowns
- Form validation states

## Utils/Helpers
### Formatting
- Date formatting utility
- Price formatting utility
- Email templates
- Form validation helpers

### API
- Error handling middleware
- Response formatting
- Request validation

### SEO
- Meta tags setup
- Open Graph tags
- Basic sitemap

## Settings Features
### Account Management
- Update email
- Change password
- Cancel subscription
- Account deletion

## Simple Analytics
### Tracking Points
- Page views
- Signup events
- Subscription conversions
- Feature usage

### Implementation
- Simple analytics dashboard
- Basic conversion tracking
- User journey tracking

## Security Measures
- Rate limiting implementation
- Input sanitization
- XSS protection
- CSRF protection
- Environment variables