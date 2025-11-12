CREATE DATABASE IF NOT EXISTS HybridScraping;

USE HybridScraping;

CREATE TABLE IF NOT EXISTS companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    base_url VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ai_providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ai_models (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_name VARCHAR(255) NOT NULL UNIQUE,
    thought BOOLEAN NOT NULL,
    fast_generation BOOLEAN NOT NULL,
    ai_provider_id INT NOT NULL,
    FOREIGN KEY (ai_provider_id) REFERENCES ai_providers(id)
);

-- 🔹 Input Types table
CREATE TABLE IF NOT EXISTS input_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    value VARCHAR(255) NOT NULL UNIQUE
);

-- 🔹 Return Types table
CREATE TABLE IF NOT EXISTS return_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    value VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
	id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) NOT NULL,
    apikey VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS extensions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(25) NOT NULL,
    user_id INT NOT NULL,
    ai_model_id INT,
    action_name VARCHAR(255) NOT NULL,
    ai_generated BOOLEAN NOT NULL,
    verified BOOLEAN NOT NULL,
    last_edited DATETIME NOT NULL,
    input_type_id INT NOT NULL,
    return_type_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ai_model_id) REFERENCES ai_models(id),
    FOREIGN KEY (input_type_id) REFERENCES input_types(id),
    FOREIGN KEY (return_type_id) REFERENCES return_types(id)
);

CREATE TABLE IF NOT EXISTS company_extensions (
	company_id INT NOT NULL,
    extension_id INT NOT NULL,
    FOREIGN KEY (extension_id) REFERENCES extensions(id),
	FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 🔹 Seed default input types
INSERT IGNORE INTO input_types (value) VALUES
('text'),
('json'),
('html'),
('xml'),
('csv');

-- 🔹 Seed default return types
INSERT IGNORE INTO return_types (value) VALUES
('json'),
('csv'),
('xml'),
('text'),
('html');
