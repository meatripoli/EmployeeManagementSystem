DROP DATABASE IF EXISTS employeeManagment_db;
CREATE DATABASE employeeManagment_db;
USE employeeManagment_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  manager VARCHAR(255) NULL,
  PRIMARY KEY (id)
);
--employee is related to role through role_id

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10,2) NULL,
  department_id  INT NULL,
  PRIMARY KEY (id)
);
--role is related to department through department_id

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

-- Creates new rows containing data in all named columns --

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
 ("Salesperson", 80000, 1),
 ("Lead Engineer", 150000, 2),
 ("Software Engineer", 120000, 2),
 ("Accountant", 125000, 3),
 ("Legal Team Lead", 250000, 4),
 ("Lawyer", 190000, 4);

INSERT INTO departments (department_name)
VALUES 
  ("Sales"), 
  ("Engineering"), 
  ("Finance"), 
  ("Legal"), 
  ("Administration"), 
  ("Security"), 
  ("Marketing"), 
  ("Human Resources");

  INSERT INTO employees (first_name, last_name, role_id, manager)
  VALUES 
    ("John","Doe",1,"Ashley Rodriguez"),
    ("Mike","Chan",2,"John Doe"),
    ("Ashley","Rodriguez",3,null),
    ("Kevin","Tupik",4,"Ashley Rodriguez"),
    ("Malia","Brown",5,null),
    ("Sarah","Lourd",6,null),
    ("Tom","Allen",7,"Malia Brown");
    
