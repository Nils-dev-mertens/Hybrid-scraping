use hybridscraping;

INSERT IGNORE INTO users (username, apikey) values ("root","hfakjsdfjdsak");

-- 🔹 Companies
INSERT IGNORE INTO companies (base_url, company_name) VALUES
('https://example.com', 'ExampleCorp'),
('https://datahub.io', 'DataHub'),
('https://ai-tools.dev', 'AITools');

-- 🔹 AI Providers
INSERT IGNORE INTO ai_providers (name) VALUES
('OpenAI'),
('Anthropic'),
('Cohere');

-- 🔹 AI Models
INSERT IGNORE INTO ai_models (model_name, thought, fast_generation, ai_provider_id) VALUES
('gpt-4', TRUE, FALSE, 1),   -- OpenAI
('gpt-3.5', FALSE, TRUE, 1), -- OpenAI
('claude-3', TRUE, TRUE, 2), -- Anthropic
('command-r', FALSE, TRUE, 3); -- Cohere

-- 🔹 Input Types (already seeded, but ensuring more variety)
INSERT IGNORE INTO input_types (value) VALUES
('markdown'),
('url');

-- 🔹 Return Types (already seeded, but ensuring more variety)
INSERT IGNORE INTO return_types (value) VALUES
('pdf'),
('markdown'); 