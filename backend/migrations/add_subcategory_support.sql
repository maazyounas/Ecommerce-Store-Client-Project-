-- Migration to add subcategory support to categories table
-- Run this migration to update your existing database

-- Add parent_id column to categories table
ALTER TABLE categories 
ADD COLUMN parent_id INT DEFAULT NULL AFTER image;

-- Add foreign key constraint
ALTER TABLE categories 
ADD CONSTRAINT fk_parent_category 
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_parent_id ON categories(parent_id);
