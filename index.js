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
    ])
    // add role to employee
    .then(function (userInput) {
      let input = [userInput.newEmpFirstName, userInput.newEmpLastName];

      let sql = `
        SELECT
          id,
          title
        FROM roles
      `;

      db.query(sql, (err, results) => {
        if (err) throw err;

        let roleList = results.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              message: "What is the employee's roll?",
              name: "roleId",
              choices: roleList,
            },
          ])
          // add manager to employee
          .then(function (userInput) {
            let roleId = userInput.roleId;
            input.push(roleId);

            let sql = `
              SELECT
                id,
                first_name,
                last_name
              FROM employees
            `;

            db.query(sql, (err, results) => {
              if (err) throw err;

              let managersList = results.map(
                ({ id, first_name, last_name }) => ({
                  name: first_name + " " + last_name,
                  value: id,
                })
              );

              inquirer
                .prompt([
                  {
                    type: "list",
                    message: "Who is the employee's manager?",
                    name: "managerId",
                    choices: managersList,
                  },
                ])
                .then(function (userInput) {
                  let managerId = userInput.managerId;
                  input.push(managerId);

                  let sql = `
                    INSERT INTO employees (
                      first_name,
                      last_name,
                      role_id,
                      manager_id
                    )
                    VALUES (?, ?, ?, ?)
                  `;

                  db.query(sql, input, (error) => {
                    if (error) throw error;

                    console.log(
                      `Added ${input[0]} ${input[1]} to the database`
                    );

                    begin();
                  });
                });
            });
          });
      });
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
        SELECT
          id,
          name
        FROM departments
      `;

      db.query(sql, (err, results) => {
        if (err) throw err;
        let list = results.map(({ id, name }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              message: "Which department does the role belong to?",
              name: "deptId",
              choices: list,
            },
          ])
          .then(function (userInput) {
            let deptId = userInput.deptId;
            input.push(deptId);

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
  let sql = `
    SELECT
      id,
      first_name,
      last_name
    FROM employees
  `;

  db.query(sql, (err, results) => {
    if (err) throw err;

    let employeesList = results.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "Which Employee's role do you want to update?",
          name: "employeeId",
          choices: employeesList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.employeeId];

        let sql = `
          SELECT
            id,
            title
          FROM roles
        `;

        db.query(sql, (err, results) => {
          if (err) throw err;

          let roleList = results.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                message:
                  "Which role do you want to assign the selected employee?",
                name: "roleId",
                choices: roleList,
              },
            ])
            .then(function (userInput) {
              let roleId = userInput.roleId;
              input.push(roleId);

              let sql = `
                UPDATE employees
                SET employees.role_id = ?
                WHERE employees.id = ?
              `;
              // reverse the array to match the order needed for the UPDATE statement
              db.query(sql, input.reverse(), (error) => {
                if (error) throw error;

                console.log("Updated employee's role");

                begin();
              });
            });
        });
      });
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
      CONCAT(manager.first_name," ", manager.last_name) AS "manager"
    FROM employees
    LEFT JOIN roles
      ON employees.role_id=roles.id
    LEFT JOIN departments
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
    LEFT JOIN departments
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
  db.end();
}

begin();
