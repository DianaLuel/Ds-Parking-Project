CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),  -- Better than 'username' for real names; optional but recommended
  username VARCHAR(100) UNIQUE,  -- Keep if you need username-based login
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),  -- Added role for RBAC
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create default admin user
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@parking.com', '$2b$04$atDfrL.LZMwDT27cFMmi.duj9fyq91UpfUZvaaeBVlbvFwi6aiamZm', 'ADMIN')
ON CONFLICT (email) DO NOTHING;