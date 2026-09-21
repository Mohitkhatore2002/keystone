-- V3__add_user_profile_columns.sql
-- Add profile attributes to users table

ALTER TABLE users ADD COLUMN title VARCHAR(150) DEFAULT 'Full Stack Developer';
ALTER TABLE users ADD COLUMN location VARCHAR(100) DEFAULT 'Indore';
ALTER TABLE users ADD COLUMN about_me VARCHAR(1000) DEFAULT 'Passionate software engineer with experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.';
ALTER TABLE users ADD COLUMN phone VARCHAR(30) DEFAULT '+91 9926734747';
ALTER TABLE users ADD COLUMN portfolio_url VARCHAR(255) DEFAULT 'https://mohitkhatore2002.github.io/portfolio/';
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN profile_completion INT DEFAULT 78;
ALTER TABLE users ADD COLUMN completed_courses INT DEFAULT 0;
ALTER TABLE users ADD COLUMN skills_verified INT DEFAULT 0;
ALTER TABLE users ADD COLUMN internships_done INT DEFAULT 0;
