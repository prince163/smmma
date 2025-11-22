-- Insert admin user (password: admin123)
INSERT OR IGNORE INTO User (id, email, password, name, role, balance, createdAt, updatedAt) 
VALUES ('admin-001', 'admin@smmpanel.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 'ADMIN', 1000.0, datetime('now'), datetime('now'));

-- Insert test user (password: test123)
INSERT OR IGNORE INTO User (id, email, password, name, role, balance, createdAt, updatedAt) 
VALUES ('user-001', 'test@example.com', '$2a$10$YourHashedPasswordHere', 'Test User', 'USER', 100.0, datetime('now'), datetime('now'));

-- Insert platforms
INSERT OR IGNORE INTO Platform (id, name, slug, icon) VALUES ('platform-ig', 'Instagram', 'instagram', '📷');
INSERT OR IGNORE INTO Platform (id, name, slug, icon) VALUES ('platform-tt', 'TikTok', 'tiktok', '🎵');
INSERT OR IGNORE INTO Platform (id, name, slug, icon) VALUES ('platform-yt', 'YouTube', 'youtube', '▶️');
INSERT OR IGNORE INTO Platform (id, name, slug, icon) VALUES ('platform-fb', 'Facebook', 'facebook', '👍');

-- Insert services
INSERT OR IGNORE INTO Service (id, name, platformId) VALUES ('ig-followers', 'Followers', 'platform-ig');
INSERT OR IGNORE INTO Service (id, name, platformId) VALUES ('ig-likes', 'Likes', 'platform-ig');
INSERT OR IGNORE INTO Service (id, name, platformId) VALUES ('tt-followers', 'Followers', 'platform-tt');
INSERT OR IGNORE INTO Service (id, name, platformId) VALUES ('tt-views', 'Views', 'platform-tt');
INSERT OR IGNORE INTO Service (id, name, platformId) VALUES ('yt-subscribers', 'Subscribers', 'platform-yt');

-- Insert packages
INSERT OR IGNORE INTO Package (id, name, description, price, minQuantity, maxQuantity, serviceId) 
VALUES ('ig-followers-basic', 'Basic', 'Standard quality followers', 5.99, 100, 5000, 'ig-followers');

INSERT OR IGNORE INTO Package (id, name, description, price, minQuantity, maxQuantity, serviceId) 
VALUES ('ig-followers-premium', 'Premium', 'High quality followers', 9.99, 100, 10000, 'ig-followers');

INSERT OR IGNORE INTO Package (id, name, description, price, minQuantity, maxQuantity, serviceId) 
VALUES ('ig-likes-basic', 'Basic', 'Standard likes', 2.99, 50, 5000, 'ig-likes');

INSERT OR IGNORE INTO Package (id, name, description, price, minQuantity, maxQuantity, serviceId) 
VALUES ('tt-followers-basic', 'Basic', 'Standard quality followers', 6.99, 100, 5000, 'tt-followers');

INSERT OR IGNORE INTO Package (id, name, description, price, minQuantity, maxQuantity, serviceId) 
VALUES ('tt-views-basic', 'Basic', 'Standard views', 3.99, 1000, 100000, 'tt-views');

INSERT OR IGNORE INTO Package (id, name, description, price, minQuantity, maxQuantity, serviceId) 
VALUES ('yt-subscribers-basic', 'Basic', 'Standard subscribers', 7.99, 50, 2000, 'yt-subscribers');
