Use employee_tracker_db;

INSERT INTO departments (name) VALUES
('Management'),
('Sales'),
('Finance'),
('R&D'),
('Human Resources');

INSERT INTO roles (title, salary, department_id) VALUES
('CEO', 500000, 1),
('Regional Manager', 150000, 1),
('Lead Salesperson', 90000, 2),
('Salesperson', 70000, 2),
('Lead Accountant', 100000, 3),
('Accountant', 75000, 3),
('Analyst', 85000, 4),
('HR Rep', 50000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('David', 'Wallace', 1,  null),
('Michael', 'Scott', 2, 1),
('Dwight', 'Schrute', 3, 2),
('Jim', 'Halpert', 4, 3),
('Stanley', 'Hudson', 4, 3),
('Creed', 'Bratton', 7, 2),
('Andy', 'Bernard', 3, 3),
('Oscar', 'Martinez', 5, 2),
('Angela', 'Martin', 6, 8),
('Kevin', 'Malone', 6, 8),
('Ryan', 'Howard', 7, 2),
('Gabe', 'Lewis', 8, 2);