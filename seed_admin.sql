
-- Admin Seed Account
INSERT INTO flc_ops_users (name, email, password_hash, role)
VALUES ('Faseeh (Admin)', 'Admin@faseehlall.com', 'Admin@flc', 'admin')
ON CONFLICT (email) DO NOTHING;
