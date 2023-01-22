const inquirer = require("inquirer");
const fs = require("fs");

function begin() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "actions",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then(function (userInput) {
      switch (userInput.actions) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        default:
          quit();
      }
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "newEmpFirstName",
        default: "Sam",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "newEmpLastName",
        default: "Kash",
      },
      {
        type: "input",
        message: "What role do you want to assign the selected employee?",
        name: "newEmpRole",
        default: "Sales Lead", // this will pull a list of roles in the future
      },
    ])
    .then(function () {
      console.log("Added pretend Sam Kash to the database");
      begin();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the Role?",
        name: "newRole",
        default: "Customer Service",
      },
      {
        type: "input",
        message: "What is the Salary of the Role?",
        name: "newRoleSalary",
        default: 80000,
      },
      {
        type: "input",
        message: "Which department does the role belong to?",
        name: "newRoleDept",
        default: "Service", // this will pull a list of departments in the future
      },
    ])
    .then(function () {
      console.log("Added pretend Customer Service to the database");
      begin();
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the Department?",
        name: "newDept",
        default: "Service",
      },
    ])
    .then(function () {
      console.log("Added pretend Service to the database");
      begin();
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which Employee's role do you want to update?",
        name: "updtEmp",
        default: "Sam Kash", // this will pull a list of employees in the future
      },
      {
        type: "input",
        message: "Which role do you want to assign the selected employee?",
        name: "updtEmpRole",
        default: "Sales Lead",
      },
    ])
    .then(function () {
      console.log("Updated pretend Sam Kash's role");
      begin();
    });
}

function viewEmployees() {
  console.log("pretend the employees table displayed");
  begin();
}

function viewRoles() {
  console.log("pretend the roles table displayed");
  begin();
}

function viewDepartments() {
  console.log("pretend the departments table displayed");
  begin();
}

function quit() {
  console.log("thanks for playing");
  temp();
}

function temp() {
  console.log(
    "something wonderful is about to happen, as soon as i figure out how to make it so"
  );
}

begin();
