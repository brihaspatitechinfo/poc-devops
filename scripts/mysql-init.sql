-- Create databases for WeAce microservices
CREATE DATABASE IF NOT EXISTS weace_coaching;
CREATE DATABASE IF NOT EXISTS weace_training;
CREATE DATABASE IF NOT EXISTS weace_event;
CREATE DATABASE IF NOT EXISTS weace_engagement;
CREATE DATABASE IF NOT EXISTS weace_utility;

-- Create users for different services
CREATE USER IF NOT EXISTS 'coaching_user'@'%' IDENTIFIED BY 'Admin@123';
CREATE USER IF NOT EXISTS 'training_user'@'%' IDENTIFIED BY 'Admin@123';
CREATE USER IF NOT EXISTS 'event_user'@'%' IDENTIFIED BY 'Admin@123';
CREATE USER IF NOT EXISTS 'engagement_user'@'%' IDENTIFIED BY 'Admin@123';
CREATE USER IF NOT EXISTS 'utility_user'@'%' IDENTIFIED BY 'Admin@123';

-- Grant permissions to service-specific users
GRANT ALL PRIVILEGES ON weace_coaching.* TO 'coaching_user'@'%';
GRANT ALL PRIVILEGES ON weace_training.* TO 'training_user'@'%';
GRANT ALL PRIVILEGES ON weace_event.* TO 'event_user'@'%';
GRANT ALL PRIVILEGES ON weace_engagement.* TO 'engagement_user'@'%';
GRANT ALL PRIVILEGES ON weace_utility.* TO 'utility_user'@'%';
    
FLUSH PRIVILEGES;
