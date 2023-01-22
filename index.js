require("dotenv").config();
require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

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
          getDepartmentsList();
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

function getDepartmentsList() {
  let sql = `
    SELECT
      id,
      name
    FROM departments
  `;

  db.query(sql, function (err, results) {
    if (err) throw err;

    let deptList = results.map(({ id, name }) => ({
      value: id,
      name: `${name}`,
    }));

    addRole(deptList);
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
    ])
    .then(function (userInput) {
      let input = [userInput.newRole, userInput.newRoleSalary];

      let sql = `
        SELECT * FROM departments
      `;

      db.query(sql, (err, results) => {
        if (err) throw err;
        let list = results.map(({ id, name }) => ({ name: name, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which department does the role belong to?",
              name: "dept",
              choices: list,
            },
          ])
          .then(function (param) {
            let list = param.dept;
            input.push(list);

            let sql = `
              INSERT INTO roles (
                title,
                salary,
                dept_id
              )
              VALUES (?, ?, ?)
            `;
            db.query(sql, input, (error) => {
              if (error) throw error;

              console.log(`Added ${userInput.newRole} to the database`);

              begin();
            });
          });
      });
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
    .then(function (userInput) {
      let input = [userInput.newDept];

      let sql = `
        INSERT INTO departments (
          name
        )
        VALUES (?)
      `;

      db.query(sql, input, (err) => {
        if (err) throw err;
        console.log(`Added ${input} to the database`);
        begin();
      });
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
  let sql = `
    SELECT
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS "department",
      roles.salary,
      manager.first_name AS "manager"
    FROM employees
    JOIN roles
      ON employees.role_id=roles.id
    JOIN departments
      ON roles.dept_id=departments.id
    LEFT JOIN employees manager
      ON manager.id=employees.manager_id
  ;`;

  db.query(sql, function (err, results) {
    if (err) throw err;
    console.log("\n");
    console.table(results);
    begin();
  });
}

function viewRoles() {
  let sql = `
    SELECT
      roles.id,
      title,
      departments.name AS "department",
      salary
    FROM roles
    JOIN departments
      ON roles.dept_id=departments.id
  ;`;

  db.query(sql, function (err, results) {
    if (err) throw err;
    console.log("\n");
    console.table(results);
    begin();
  });
}

function viewDepartments() {
  let sql = `
    SELECT
      id,
      name
    FROM departments
  ;`;

  db.query(sql, function (err, results) {
    if (err) throw err;
    console.log("\n");
    console.table(results);
    begin();
  });
}

function quit() {
  console.log("thanks for playing");
  db.end();
}

begin();
