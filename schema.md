# Database Schema Documentation

## Overview
Schema documentation for SaaS starter kit using Turso database.

## Tables

### Users Table
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT,  -- Nullable for social auth
    auth_type TEXT CHECK (auth_type IN ('google', 'local')) NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
);

CREATE INDEX idx_users_email ON users(email);
```

### Stripe Customers Table
```sql
CREATE TABLE stripe_customers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    stripe_customer_id TEXT UNIQUE NOT NULL,
    plan_type TEXT CHECK (plan_type IN ('basic', 'pro', 'enterprise')) NOT NULL,
    credits INTEGER DEFAULT NULL,  -- Optional if using credits
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_stripe_customers_user_id ON stripe_customers(user_id);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
```

## Notes
- Using cookie-based sessions with nuxt-auth-utils
- All tables include created_at, updated_at, and soft delete
- Foreign keys maintain referential integrity
- Indexes added for common query patterns
- Stripe customer data minimal as most data stored in Stripe dashboard