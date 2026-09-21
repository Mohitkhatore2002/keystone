-- V2__seed_data.sql
-- Password for all seed users is: password123

INSERT INTO users (id, name, email, role, password_hash, created_at) VALUES
(1, 'Marcus Vance', 'manager@meridian.com', 'MANAGER', 'password123', CURRENT_TIMESTAMP),
(2, 'Diane Miller', 'dispatcher@meridian.com', 'DISPATCHER', 'password123', CURRENT_TIMESTAMP),
(3, 'John Gallagher', 'tech.john@meridian.com', 'TECHNICIAN', 'password123', CURRENT_TIMESTAMP),
(4, 'Sarah Jenkins', 'tech.sarah@meridian.com', 'TECHNICIAN', 'password123', CURRENT_TIMESTAMP),
(5, 'Alice Acme', 'customer@acme.com', 'CUSTOMER', 'password123', CURRENT_TIMESTAMP);

INSERT INTO customers (id, name, contact_email, phone, created_at) VALUES
(1, 'Acme Commercial Facilities', 'customer@acme.com', '+1 (555) 234-5678', CURRENT_TIMESTAMP),
(2, 'Apex Plaza Group', 'ops@apexplaza.com', '+1 (555) 876-5432', CURRENT_TIMESTAMP);

INSERT INTO sites (id, customer_id, name, address, created_at) VALUES
(1, 1, 'Acme HQ - Tower A', '100 Innovation Way, Suite 400, Chicago IL', CURRENT_TIMESTAMP),
(2, 1, 'Acme East Warehouse', '450 Industrial Parkway, Dock 12, Chicago IL', CURRENT_TIMESTAMP),
(3, 2, 'Apex Mall - North Wing', '880 Metro Boulevard, Level 2, Chicago IL', CURRENT_TIMESTAMP);

INSERT INTO parts (id, name, sku, unit_cost, stock_qty, created_at) VALUES
(1, 'HVAC High Capacity Filter 24x24', 'PART-HVAC-01', 25.00, 45, CURRENT_TIMESTAMP),
(2, 'Copper Piping 3/4in (10ft)', 'PART-PLUM-02', 42.50, 20, CURRENT_TIMESTAMP),
(3, 'Circuit Breaker Commercial 20A', 'PART-ELEC-03', 18.75, 60, CURRENT_TIMESTAMP),
(4, 'Refrigerant R410A Canister', 'PART-HVAC-04', 185.00, 12, CURRENT_TIMESTAMP),
(5, 'LED Panel Light Fixture 40W', 'PART-ELEC-05', 35.00, 30, CURRENT_TIMESTAMP);

-- Work Orders
INSERT INTO work_orders (id, code, title, description, priority, status, sla_due_at, customer_id, site_id, assigned_to, created_by, created_at, updated_at) VALUES
(1, 'WO-2026-101', 'Main AC Chiller Tripping in Tower A', 'The main chiller unit on floor 4 is shutting down intermittently causing temperature spike in server room.', 'HIGH', 'ASSIGNED', CURRENT_TIMESTAMP + INTERVAL '2' HOUR, 1, 1, 3, 2, CURRENT_TIMESTAMP - INTERVAL '3' HOUR, CURRENT_TIMESTAMP),
(2, 'WO-2026-102', 'Electrical Sub-panel Buzzing & Overheating', 'Frequent breaker trip reported at Dock 12 sub-panel B. Needs immediate thermal inspection.', 'HIGH', 'IN_PROGRESS', CURRENT_TIMESTAMP + INTERVAL '4' HOUR, 1, 2, 4, 2, CURRENT_TIMESTAMP - INTERVAL '5' HOUR, CURRENT_TIMESTAMP),
(3, 'WO-2026-103', 'Quarterly HVAC Duct Maintenance', 'Standard quarterly filter replacement and air flow test across all main ducts.', 'MEDIUM', 'NEW', CURRENT_TIMESTAMP + INTERVAL '24' HOUR, 1, 1, NULL, 5, CURRENT_TIMESTAMP - INTERVAL '1' HOUR, CURRENT_TIMESTAMP),
(4, 'WO-2026-104', 'Restroom Pipe Leak - North Wing', 'Water dripping from main supply line near North Wing main atrium restroom.', 'HIGH', 'ON_HOLD', CURRENT_TIMESTAMP - INTERVAL '1' HOUR, 2, 3, 3, 2, CURRENT_TIMESTAMP - INTERVAL '8' HOUR, CURRENT_TIMESTAMP),
(5, 'WO-2026-105', 'Lobby Emergency Light Replacement', 'Replaced battery backup unit and LED panel in primary lobby exit corridor.', 'LOW', 'COMPLETED', CURRENT_TIMESTAMP + INTERVAL '48' HOUR, 2, 3, 4, 2, CURRENT_TIMESTAMP - INTERVAL '12' HOUR, CURRENT_TIMESTAMP);

-- Work Order Status History
INSERT INTO work_order_status_history (id, work_order_id, from_status, to_status, changed_by, changed_at, note) VALUES
(1, 1, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', CURRENT_TIMESTAMP - INTERVAL '2' HOUR, 'Assigned to John Gallagher for priority response'),
(2, 2, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', CURRENT_TIMESTAMP - INTERVAL '4' HOUR, 'Assigned to Sarah Jenkins'),
(3, 2, 'ASSIGNED', 'IN_PROGRESS', 'tech.sarah@meridian.com', CURRENT_TIMESTAMP - INTERVAL '3' HOUR, 'Arrived on site, beginning electrical diagnostics'),
(4, 4, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', CURRENT_TIMESTAMP - INTERVAL '7' HOUR, 'Assigned to John Gallagher'),
(5, 4, 'ASSIGNED', 'IN_PROGRESS', 'tech.john@meridian.com', CURRENT_TIMESTAMP - INTERVAL '5' HOUR, 'Shut off main valve, investigating pipe crack'),
(6, 4, 'IN_PROGRESS', 'ON_HOLD', 'tech.john@meridian.com', CURRENT_TIMESTAMP - INTERVAL '2' HOUR, 'Waiting for replacement 3/4 inch copper valve fitting from supplier'),
(7, 5, 'NEW', 'ASSIGNED', 'dispatcher@meridian.com', CURRENT_TIMESTAMP - INTERVAL '11' HOUR, 'Assigned to Sarah Jenkins'),
(8, 5, 'ASSIGNED', 'IN_PROGRESS', 'tech.sarah@meridian.com', CURRENT_TIMESTAMP - INTERVAL '10' HOUR, 'Work started on lobby lighting fixture'),
(9, 5, 'IN_PROGRESS', 'COMPLETED', 'tech.sarah@meridian.com', CURRENT_TIMESTAMP - INTERVAL '2' HOUR, 'Replaced 40W LED fixture and battery pack. Operational.');

-- Seed Part Usage
INSERT INTO part_usages (id, work_order_id, part_id, qty_used, created_at) VALUES
(1, 5, 5, 2, CURRENT_TIMESTAMP - INTERVAL '2' HOUR);

-- Seed Time Logs
INSERT INTO time_logs (id, work_order_id, technician_id, minutes, note, logged_at) VALUES
(1, 2, 4, 90, 'Inspected circuit breakers, performed thermal imaging test.', CURRENT_TIMESTAMP - INTERVAL '3' HOUR),
(2, 5, 4, 120, 'Removed faulty fixture, wired new LED panel, verified emergency battery backup.', CURRENT_TIMESTAMP - INTERVAL '2' HOUR);
