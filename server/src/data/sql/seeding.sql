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

-- 🔹 Extensions (test data)
INSERT IGNORE INTO extensions 
(company_id, ai_model_id, action_name, ai_generated, verified, tag, last_edited, query_selectors, input_type_id, return_type_id) VALUES
(1, 1, 'Summarize Articles', TRUE, TRUE, 'summarization', NOW(), JSON_ARRAY('div.article', 'p.content'), 1, 1), -- text -> json
(1, 2, 'Extract Links', TRUE, FALSE, 'link_extraction', NOW(), JSON_ARRAY('a[href]'), 3, 2), -- html -> csv
(2, 3, 'Generate Insights', TRUE, TRUE, 'insights', NOW(), JSON_ARRAY('div.data'), 2, 1), -- json -> json
(2, 4, 'Parse Reports', FALSE, TRUE, 'reports', NOW(), JSON_ARRAY('section.report'), 5, 3), -- csv -> xml
(3, 1, 'Convert Docs', TRUE, FALSE, 'doc_conversion', NOW(), JSON_ARRAY('article'), 6, 6); -- markdown -> pdf

SELECT e.id, c.company_name, m.model_name, it.value AS input_type, rt.value AS return_type, e.action_name
FROM extensions e
JOIN companies c ON e.company_id = c.id
JOIN ai_models m ON e.ai_model_id = m.id
JOIN input_types it ON e.input_type_id = it.id
JOIN return_types rt ON e.return_type_id = rt.id;
