-- Nepal Real Estate Database Schema
-- Run this script to initialize the database

-- Create ENUM types
CREATE TYPE property_type_enum AS ENUM ('apartment', 'house', 'villa', 'commercial', 'land');
CREATE TYPE property_status_enum AS ENUM ('sale', 'rent');
CREATE TYPE user_role_enum AS ENUM ('buyer', 'seller', 'admin');

-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  role user_role_enum DEFAULT 'buyer',
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  last_login TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Properties table (migrated from JSON)
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  type property_type_enum NOT NULL,
  status property_status_enum NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area NUMERIC(10, 2) NOT NULL,
  area_unit VARCHAR(10) DEFAULT 'sqft',
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  address TEXT,
  description TEXT,
  contact VARCHAR(20),
  featured BOOLEAN DEFAULT FALSE,
  listed_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  view_count INTEGER DEFAULT 0
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_seller_id ON properties(seller_id);

-- Features table for property amenities
CREATE TABLE property_features (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_features_property_id ON property_features(property_id);

-- Images table for property photos
CREATE TABLE property_images (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_images_property_id ON property_images(property_id);

-- Favorites/Bookmarks table for user saved properties
CREATE TABLE user_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);

CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_property_id ON user_bookmarks(property_id);

-- Property inquiries table for tracking user interactions
CREATE TABLE property_inquiries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  inquiry_message TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  inquiry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

CREATE INDEX idx_property_inquiries_property_id ON property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_user_id ON property_inquiries(user_id);

-- Search history table for analytics
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  search_query JSONB,
  result_count INTEGER,
  search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);

-- Property verification/approval table (for admin approval workflow)
CREATE TABLE property_verifications (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  verification_status VARCHAR(50) DEFAULT 'pending',
  verification_date TIMESTAMP,
  rejection_reason TEXT,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_verifications_property_id ON property_verifications(property_id);
CREATE INDEX idx_property_verifications_status ON property_verifications(verification_status);
CREATE INDEX idx_property_verifications_verified_by ON property_verifications(verified_by);

-- Property comments table (for user reviews/comments)
CREATE TABLE property_comments (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_comments_property_id ON property_comments(property_id);
CREATE INDEX idx_property_comments_user_id ON property_comments(user_id);
CREATE INDEX idx_property_comments_approved ON property_comments(is_approved);

-- Alter properties table to add approval_status column if it doesn't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending';
CREATE INDEX IF NOT EXISTS idx_properties_approval_status ON properties(approval_status);
