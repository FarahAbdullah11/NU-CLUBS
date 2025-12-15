-- ============================================
-- SCHEMA REVIEW & RECOMMENDED AMENDMENTS
-- ============================================

-- ORIGINAL SCHEMA ISSUES IDENTIFIED:
-- 1. Missing: Club members count (dashboard shows "Members" metric) - Now stored as total_members in clubs table
-- 2. Missing: University ID field (login accepts "University ID or Email")
-- 3. Missing: Events table (dashboard shows "Upcoming Events")
-- 4. Missing: Budget tracking per club (dashboard shows "Budget")
-- 5. Missing: Notifications system
-- 6. Note: Students don't log in, only club leaders and admins have accounts
-- 7. Potential: Redundancy between reviewed_by and request_reviews
-- 9. Missing: Budget transactions/history

-- ============================================
-- AMENDED SCHEMA
-- ============================================

CREATE DATABASE IF NOT EXISTS ClubsData;
USE ClubsData;

-- 1. Clubs table (ENHANCED)
CREATE TABLE clubs (
    club_id INT PRIMARY KEY AUTO_INCREMENT,
    club_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(255),
    budget DECIMAL(10,2) DEFAULT 0.00,  -- Current available budget
    total_members INT DEFAULT 0,  -- Total number of club members (students don't log in)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Users table (ENHANCED - Added university_id)
-- Note: Students don't log in, only club leaders and admins have accounts
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    university_id VARCHAR(50) UNIQUE,  -- NEW: For login with University ID
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SU_ADMIN', 'STUDENT_LIFE_ADMIN', 'CLUB_LEADER') NOT NULL,
    club_id INT NULL,  -- Only for CLUB_LEADER
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Note: Using RESTRICT to prevent deleting clubs with active leaders
    -- The role-club_id relationship is enforced at application level
    -- (MySQL doesn't allow CHECK constraints on columns with FK referential actions)
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE RESTRICT,
    
    -- Ensure either university_id or email is provided for login
    CONSTRAINT chk_login_identifier CHECK (
        university_id IS NOT NULL OR email IS NOT NULL
    )
);

-- 3. Rooms table (UNCHANGED)
CREATE TABLE rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(100) NOT NULL,
    purpose TEXT,
    capacity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Requests table (ENHANCED - Added location field for events)
CREATE TABLE requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    club_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    request_type ENUM('ROOM_BOOKING', 'EVENT', 'FUNDING') NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',  -- Added CANCELLED
    
    -- Event/booking details
    event_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),  -- NEW: For events not in rooms (e.g., "Campus Lawn")
    room_id INT NULL,
    
    -- Audit & workflow fields
    submitted_by INT NOT NULL,
    reviewed_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL,
    FOREIGN KEY (submitted_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 5. Events table (NEW - Separate from requests for better tracking)
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NULL,  -- Link to original request if created from one
    club_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    room_id INT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. Funding details (ENHANCED - Added notes)
CREATE TABLE funding_details (
    funding_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL UNIQUE,
    requested_amount DECIMAL(10,2) NOT NULL,
    approved_amount DECIMAL(10,2) DEFAULT 0.00,
    purpose TEXT NOT NULL,
    submission_pdf_url VARCHAR(255),
    admin_notes TEXT,  -- NEW: Admin can add notes when approving/rejecting
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE
);

-- 7. Budget Transactions table (NEW - Track budget changes)
CREATE TABLE budget_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    club_id INT NOT NULL,
    transaction_type ENUM('ALLOCATION', 'EXPENSE', 'REFUND', 'ADJUSTMENT') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    related_request_id INT NULL,  -- Link to funding request if applicable
    created_by INT NOT NULL,  -- Admin who made the transaction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (related_request_id) REFERENCES requests(request_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. Notifications table (NEW - For dashboard notifications)
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,  -- Who should see this notification
    club_id INT NULL,  -- If notification is club-specific
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('REQUEST_UPDATE', 'EVENT_REMINDER', 'FUNDING_UPDATE', 'ANNOUNCEMENT', 'SYSTEM') NOT NULL,
    related_request_id INT NULL,  -- Link to request if applicable
    related_event_id INT NULL,  -- Link to event if applicable
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE,
    FOREIGN KEY (related_request_id) REFERENCES requests(request_id) ON DELETE SET NULL,
    FOREIGN KEY (related_event_id) REFERENCES events(event_id) ON DELETE SET NULL
);

-- 9. Request reviews (ENHANCED - Keep for detailed audit trail)
CREATE TABLE request_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    action ENUM('APPROVED', 'REJECTED') NOT NULL,
    comment TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES (ENHANCED)
-- ============================================

-- Performance indexes
CREATE INDEX idx_requests_club ON requests(club_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_date ON requests(event_date);
CREATE INDEX idx_requests_type ON requests(request_type);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_university_id ON users(university_id);
CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_budget_transactions_club ON budget_transactions(club_id);
CREATE INDEX idx_budget_transactions_date ON budget_transactions(created_at);

-- ============================================
-- USEFUL VIEWS (OPTIONAL BUT RECOMMENDED)
-- ============================================

-- View: Club dashboard metrics
CREATE OR REPLACE VIEW club_dashboard_metrics AS
SELECT 
    c.club_id,
    c.club_name,
    c.total_members,
    COUNT(DISTINCT CASE WHEN r.status = 'PENDING' THEN r.request_id END) AS pending_requests,
    COUNT(DISTINCT CASE WHEN e.status = 'Approved' AND e.event_date >= CURDATE() THEN e.event_id END) AS upcoming_events,
    c.budget AS current_budget
FROM clubs c
LEFT JOIN requests r ON c.club_id = r.club_id
LEFT JOIN events e ON c.club_id = e.club_id
GROUP BY c.club_id, c.club_name, c.total_members, c.budget;

-- View: User notifications (unread count)
CREATE OR REPLACE VIEW user_notification_counts AS
SELECT 
    user_id,
    COUNT(*) AS unread_count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id;

