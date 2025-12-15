-- ============================================
-- SAMPLE DATA INSERT FOR CLUBS
-- ============================================
-- This file contains sample data for:
-- - NIMUN (Nile International Model United Nations)
-- - RPM (Robotics and Programming Club)
-- - ICPC (International Collegiate Programming Contest)
-- - IEEE (Institute of Electrical and Electronics Engineers)

USE ClubsData;

-- ============================================
-- 1. INSERT CLUBS
-- ============================================

INSERT INTO clubs (club_name, description, logo_url, budget, total_members) VALUES
('NIMUN', 
 'Nile International Model United Nations - A platform for students to engage in diplomatic simulations, debate global issues, and develop leadership skills through Model UN conferences.',
 '/nimun-logo.jpg',
 5000.00,
 45),

('RPM', 
 'Robotics and Programming Club - Dedicated to fostering innovation in robotics, programming, and automation. We organize workshops, competitions, and projects.',
 '/rpm-logo.jpg',
 3500.00,
 38),

('ICPC', 
 'International Collegiate Programming Contest - Prepares students for competitive programming through training sessions, practice contests, and participation in regional and international competitions.',
 '/icpc-logo.jpg',
 4000.00,
 52),

('IEEE', 
 'Institute of Electrical and Electronics Engineers - Student branch promoting technical excellence, networking, and professional development in electrical engineering and computer science.',
 '/ieee-logo.jpg',
 4500.00,
 41);

-- ============================================
-- 2. INSERT ROOMS
-- ============================================

INSERT INTO rooms (room_name, purpose, capacity) VALUES
('Auditorium A', 'Large events and conferences', 200),
('Conference Room B', 'Meetings and workshops', 50),
('Lab 101', 'Technical workshops and hands-on sessions', 30),
('Hall C', 'Medium-sized events', 100),
('Seminar Room D', 'Small meetings and presentations', 25);

-- ============================================
-- 3. INSERT USERS (Club Leaders & Admins)
-- ============================================

-- NIMUN Club Leader
INSERT INTO users (university_id, fullname, email, password_hash, role, club_id) VALUES
('NU2021001', 'Ahmed Hassan', 'ahmed.hassan@nu.edu.eg', '$2b$10$example_hash_nimun_leader', 'CLUB_LEADER', 1);

-- RPM Club Leader
INSERT INTO users (university_id, fullname, email, password_hash, role, club_id) VALUES
('NU2021002', 'Mariam Ali', 'mariam.ali@nu.edu.eg', '$2b$10$example_hash_rpm_leader', 'CLUB_LEADER', 2);

-- ICPC Club Leader
INSERT INTO users (university_id, fullname, email, password_hash, role, club_id) VALUES
('NU2021003', 'Omar Khaled', 'omar.khaled@nu.edu.eg', '$2b$10$example_hash_icpc_leader', 'CLUB_LEADER', 3);

-- IEEE Club Leader
INSERT INTO users (university_id, fullname, email, password_hash, role, club_id) VALUES
('NU2021004', 'Fatima Mohamed', 'fatima.mohamed@nu.edu.eg', '$2b$10$example_hash_ieee_leader', 'CLUB_LEADER', 4);

-- SU Admin
INSERT INTO users (university_id, fullname, email, password_hash, role, club_id) VALUES
('NU2020001', 'Dr. Sarah Ibrahim', 'sarah.ibrahim@nu.edu.eg', '$2b$10$example_hash_su_admin', 'SU_ADMIN', NULL);

-- Student Life Admin
INSERT INTO users (university_id, fullname, email, password_hash, role, club_id) VALUES
('NU2020002', 'Dr. Mohamed Farid', 'mohamed.farid@nu.edu.eg', '$2b$10$example_hash_student_life', 'STUDENT_LIFE_ADMIN', NULL);

-- ============================================
-- NOTE: Only CLUB_LEADER, SU_ADMIN, and STUDENT_LIFE_ADMIN roles have dashboard access
-- Students (if added later) will not have login credentials for the dashboard
-- ============================================

-- ============================================
-- 4. INSERT SAMPLE REQUESTS
-- ============================================

-- NIMUN Requests
INSERT INTO requests (club_id, title, description, request_type, status, event_date, start_time, end_time, room_id, submitted_by) VALUES
(1, 'Annual MUN Conference Room Booking', 'Requesting Auditorium A for our annual Model UN conference', 'ROOM_BOOKING', 'APPROVED', '2025-03-15', '09:00:00', '17:00:00', 1, 1),
(1, 'MUN Workshop Funding Request', 'Funding for guest speakers and materials for MUN training workshop', 'FUNDING', 'PENDING', NULL, NULL, NULL, NULL, 1),
(1, 'Diplomatic Simulation Event', 'Organizing a diplomatic simulation event for new members', 'EVENT', 'PENDING', '2025-02-20', '14:00:00', '18:00:00', 2, 1);

-- RPM Requests
INSERT INTO requests (club_id, title, description, request_type, status, event_date, start_time, end_time, room_id, submitted_by) VALUES
(2, 'Robotics Workshop Lab Booking', 'Requesting Lab 101 for robotics programming workshop', 'ROOM_BOOKING', 'APPROVED', '2025-02-10', '10:00:00', '14:00:00', 3, 2),
(2, 'Robot Competition Funding', 'Funding for robot parts and competition registration fees', 'FUNDING', 'APPROVED', NULL, NULL, NULL, NULL, 2),
(2, 'Arduino Programming Session', 'Hands-on Arduino programming session for beginners', 'EVENT', 'PENDING', '2025-02-25', '15:00:00', '17:00:00', 3, 2);

-- ICPC Requests
INSERT INTO requests (club_id, title, description, request_type, status, event_date, start_time, end_time, room_id, submitted_by) VALUES
(3, 'Programming Contest Room Booking', 'Requesting Hall C for ICPC practice contest', 'ROOM_BOOKING', 'PENDING', '2025-03-01', '09:00:00', '13:00:00', 4, 3),
(3, 'Regional Contest Registration Funding', 'Funding for team registration in regional ICPC contest', 'FUNDING', 'PENDING', NULL, NULL, NULL, NULL, 3),
(3, 'Algorithm Training Session', 'Weekly algorithm training session for competitive programming', 'EVENT', 'APPROVED', '2025-02-15', '16:00:00', '18:00:00', 2, 3);

-- IEEE Requests
INSERT INTO requests (club_id, title, description, request_type, status, event_date, start_time, end_time, room_id, submitted_by) VALUES
(4, 'IEEE Technical Talk Room Booking', 'Requesting Seminar Room D for technical presentation', 'ROOM_BOOKING', 'APPROVED', '2025-02-18', '11:00:00', '13:00:00', 5, 4),
(4, 'IEEE Conference Funding', 'Funding for IEEE student conference participation', 'FUNDING', 'PENDING', NULL, NULL, NULL, NULL, 4),
(4, 'Circuit Design Workshop', 'Workshop on circuit design and PCB fabrication', 'EVENT', 'PENDING', '2025-03-05', '10:00:00', '15:00:00', 3, 4);

-- ============================================
-- 5. INSERT FUNDING DETAILS
-- ============================================

INSERT INTO funding_details (request_id, requested_amount, approved_amount, purpose, admin_notes) VALUES
(2, 1500.00, 0.00, 'Guest speakers honorarium and workshop materials', NULL),
(5, 2000.00, 1800.00, 'Robot parts, sensors, and competition registration', 'Approved with slight reduction in parts budget'),
(8, 3000.00, 0.00, 'Team registration fees and travel expenses', NULL),
(11, 2500.00, 0.00, 'Conference registration and accommodation', NULL);

-- ============================================
-- 6. INSERT EVENTS
-- ============================================

-- NIMUN Events
INSERT INTO events (request_id, club_id, title, description, event_date, start_time, end_time, location, room_id, status, created_by) VALUES
(1, 1, 'Annual NIMUN Conference 2025', 'Full-day Model UN conference with multiple committees', '2025-03-15', '09:00:00', '17:00:00', NULL, 1, 'Approved', 1),
(3, 1, 'Diplomatic Simulation for New Members', 'Introduction to MUN procedures and diplomatic simulations', '2025-02-20', '14:00:00', '18:00:00', NULL, 2, 'Pending', 1);

-- RPM Events
INSERT INTO events (request_id, club_id, title, description, event_date, start_time, end_time, location, room_id, status, created_by) VALUES
(4, 2, 'Robotics Programming Workshop', 'Hands-on workshop on robot programming and control systems', '2025-02-10', '10:00:00', '14:00:00', NULL, 3, 'Approved', 2),
(6, 2, 'Arduino Programming for Beginners', 'Introduction to Arduino programming and basic projects', '2025-02-25', '15:00:00', '17:00:00', NULL, 3, 'Pending', 2);

-- ICPC Events
INSERT INTO events (request_id, club_id, title, description, event_date, start_time, end_time, location, room_id, status, created_by) VALUES
(9, 3, 'Algorithm Training Session', 'Weekly training on data structures and algorithms', '2025-02-15', '16:00:00', '18:00:00', NULL, 2, 'Approved', 3),
(NULL, 3, 'ICPC Practice Contest', 'Mock contest to prepare for regional competition', '2025-03-01', '09:00:00', '13:00:00', NULL, 4, 'Pending', 3);

-- IEEE Events
INSERT INTO events (request_id, club_id, title, description, event_date, start_time, end_time, location, room_id, status, created_by) VALUES
(10, 4, 'IEEE Technical Talk: Future of Electronics', 'Guest speaker presentation on emerging technologies', '2025-02-18', '11:00:00', '13:00:00', NULL, 5, 'Approved', 4),
(12, 4, 'Circuit Design and PCB Workshop', 'Hands-on workshop on circuit design and PCB fabrication', '2025-03-05', '10:00:00', '15:00:00', NULL, 3, 'Pending', 4);

-- ============================================
-- 7. INSERT NOTIFICATIONS
-- ============================================

-- Notifications for NIMUN Leader
INSERT INTO notifications (user_id, club_id, title, message, type, related_request_id, is_read) VALUES
(1, 1, 'Room Booking Approved', 'Your request for Auditorium A on March 15 has been approved', 'REQUEST_UPDATE', 1, FALSE),
(1, 1, 'Funding Request Pending', 'Your funding request for MUN Workshop is under review', 'FUNDING_UPDATE', 2, FALSE),
(1, 1, 'Event Reminder', 'Diplomatic Simulation Event is scheduled for February 20', 'EVENT_REMINDER', NULL, FALSE);

-- Notifications for RPM Leader
INSERT INTO notifications (user_id, club_id, title, message, type, related_request_id, is_read) VALUES
(2, 2, 'Lab Booking Approved', 'Lab 101 has been reserved for your robotics workshop', 'REQUEST_UPDATE', 4, FALSE),
(2, 2, 'Funding Approved', 'Your robot competition funding request has been approved with amount: $1800', 'FUNDING_UPDATE', 5, TRUE),
(2, 2, 'New Event Request', 'Your Arduino programming session request is pending approval', 'REQUEST_UPDATE', 6, FALSE);

-- Notifications for ICPC Leader
INSERT INTO notifications (user_id, club_id, title, message, type, related_request_id, is_read) VALUES
(3, 3, 'Training Session Approved', 'Your algorithm training session has been approved', 'REQUEST_UPDATE', 9, TRUE),
(3, 3, 'Contest Room Pending', 'Your request for Hall C is under review', 'REQUEST_UPDATE', 7, FALSE),
(3, 3, 'Funding Request Submitted', 'Your regional contest funding request has been received', 'FUNDING_UPDATE', 8, FALSE);

-- Notifications for IEEE Leader
INSERT INTO notifications (user_id, club_id, title, message, type, related_request_id, is_read) VALUES
(4, 4, 'Technical Talk Approved', 'Seminar Room D has been reserved for your technical talk', 'REQUEST_UPDATE', 10, TRUE),
(4, 4, 'Conference Funding Pending', 'Your IEEE conference funding request is under review', 'FUNDING_UPDATE', 11, FALSE),
(4, 4, 'Workshop Reminder', 'Circuit Design Workshop is scheduled for March 5', 'EVENT_REMINDER', NULL, FALSE);

-- ============================================
-- 9. INSERT BUDGET TRANSACTIONS
-- ============================================

-- Initial Budget Allocations (when clubs were created)
INSERT INTO budget_transactions (club_id, transaction_type, amount, description, created_by) VALUES
(1, 'ALLOCATION', 5000.00, 'Initial budget allocation for NIMUN', 5),
(2, 'ALLOCATION', 3500.00, 'Initial budget allocation for RPM', 5),
(3, 'ALLOCATION', 4000.00, 'Initial budget allocation for ICPC', 5),
(4, 'ALLOCATION', 4500.00, 'Initial budget allocation for IEEE', 5);

-- Approved Funding (RPM)
INSERT INTO budget_transactions (club_id, transaction_type, amount, description, related_request_id, created_by) VALUES
(2, 'EXPENSE', 1800.00, 'Robot competition funding - approved', 5, 6);

-- ============================================
-- VERIFICATION QUERIES (Optional - Run to check data)
-- ============================================

-- Check clubs and their budgets
-- SELECT club_id, club_name, budget FROM clubs;

-- Check club members count (stored directly in clubs table)
-- SELECT club_id, club_name, total_members FROM clubs;

-- Check pending requests per club
-- SELECT c.club_name, COUNT(r.request_id) as pending_requests
-- FROM clubs c
-- LEFT JOIN requests r ON c.club_id = r.club_id AND r.status = 'PENDING'
-- GROUP BY c.club_id, c.club_name;

-- Check upcoming events per club
-- SELECT c.club_name, COUNT(e.event_id) as upcoming_events
-- FROM clubs c
-- LEFT JOIN events e ON c.club_id = e.club_id 
--   AND e.status = 'Approved' 
--   AND e.event_date >= CURDATE()
-- GROUP BY c.club_id, c.club_name;

