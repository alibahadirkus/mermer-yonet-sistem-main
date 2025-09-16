-- Create database
CREATE DATABASE IF NOT EXISTS websitedb;
USE websitedb;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    pdf_path VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create company_references table
CREATE TABLE IF NOT EXISTS company_references (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    image_path VARCHAR(255),
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES team_members(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT IGNORE INTO categories (name, description) VALUES 
('COANTE', 'Coante mermer koleksiyonu'),
('DOLOMİT', 'Dolomit taş ürünleri'),
('BEJLER', 'Bej renkli mermerler'),
('NG STONE', 'NG Stone ürünleri'),
('TRAVERTEN', 'Traverten taşları'),
('MERMER', 'Genel mermer ürünleri'),
('YERLİ GRANİT', 'Yerli granit ürünleri');

-- Insert team members
INSERT IGNORE INTO team_members (name, position, department, parent_id, sort_order) VALUES 
-- Kurucular (Level 1)
('Ali ZORLAR', 'Yön. Kur. Bşk. Yrd.', 'Kurucular', NULL, 1),
('Cemal GÜMÜŞ', 'Yön. Kur. Bşk. Yrd.', 'Kurucular', NULL, 2),

-- Finans Müdürü (Level 1)
('Mert GÜLTEN', 'Finans Müd. & İdari İşler Müd.', 'Finans', NULL, 3),

-- Bursa Depo Müdürü (Level 1)
('Tolga YEŞİLDAĞ', 'Bursa dep. Müd.', 'Bursa Depo', NULL, 4),

-- Bandırma Depo Müdürü (Level 1)
('Okan KARAKAHYA', 'Bandırma dep. Müd.', 'Bandırma Depo', NULL, 5),

-- İhracat Departmanı (Level 1)
('İ.Furkan ZORLAR', 'İhracat Departmanı', 'İhracat', NULL, 6),

-- Bursa Depo Çalışanları (Level 2)
('ARİF', 'Vinc operatörü', 'Bursa Depo', 4, 7),
('..........', 'forlift operatörü', 'Bursa Depo', 4, 8),
('KEZİBAN', 'Mutfak Sorumlusu', 'Bursa Depo', 4, 9),
('İ.Furkan ZORLAR', 'Satış', 'Bursa Depo', 4, 10),
('Murat BİLİR', 'Pazarlama', 'Bursa Depo', 4, 11),
('Tolga YEŞİLDAĞ', 'Pazarlama', 'Bursa Depo', 4, 12),

-- Bandırma Depo Çalışanları (Level 2)
('İbrahim', 'Vinc operatörü', 'Bandırma Depo', 5, 13),
('Emre', 'forlift operatörü', 'Bandırma Depo', 5, 14),
('EMİNE', 'Mutfak Sorumlusu', 'Bandırma Depo', 5, 15),
('BİLGE', 'SATIN ALMA Muhasebe', 'Bandırma Depo', 5, 16),
('YELİZ', 'Satış Muhasebe', 'Bandırma Depo', 5, 17),
('Elif Nur', 'İdari İşler Sorumlusu', 'Bandırma Depo', 5, 18),
('Murat ÇETİN', 'Pazarlama', 'Bandırma Depo', 5, 19),
('Hakan GÜLER', 'Pazarlama', 'Bandırma Depo', 5, 20),
('Okan KARAKAHYA', 'Satış', 'Bandırma Depo', 5, 21),

-- İhracat Departmanı Çalışanları (Level 2)
('Rıdvan', 'İhracat takibi', 'İhracat', 6, 22);

-- Insert sample data
INSERT IGNORE INTO products (name, description, image_path, category) VALUES 
('Test Ürün 1', 'Bu bir test ürünüdür', '/images/marble-default.jpg', 'MERMER'),
('Test Ürün 2', 'Bu da bir test ürünüdür', '/images/marble-default.jpg', 'COANTE');

INSERT IGNORE INTO company_references (name, description, location, image_path) VALUES 
('Test Referans 1', 'Bu bir test referansıdır', 'İstanbul', '/images/marble-default.jpg');
