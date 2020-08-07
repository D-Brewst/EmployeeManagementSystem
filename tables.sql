DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;
DROP TABLE employee;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO department (name)
VALUES ("Engineering"), ("Legal"), ("Finance"), ("Marketing"), ("HR"), ("Executive"), ("Security");

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 100000.00, 2), ("Software engineer", 150000.00, 1), ("CEO", 200000.00, 6), ("Guard", 50000.00, 7), ("Accountant", 100000.00, 3), ("Salesman", 80000.00, 4), ("HR manager", 90000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Bill", 3, 3), ("Shanique", "Washington", 2, 3), ("Jennifer", "Walton", 1, 3), ("Jason", "Borne", 4, 3), ("John", "Wick", 5, 2), ("Thomas", "Chen", 6, 3), ("Trevor", "Lewis", 7, 3);

SELECT * FROM employee