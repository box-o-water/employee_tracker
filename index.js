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
          "View Total Utilized Budget By Department",
          "View All Employees By Department",
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Delete Employee",
          "Delete Role",
          "Delete Department",
          "Quit",
        ],
      },
    ])
    .then(function (userInput) {
      switch (userInput.actions) {
        case "View Total Utilized Budget By Department":
          viewBudgetByDept();
          break;
        case "View All Employees By Department":
          viewEmployeesByDept();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeMgr();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        default:
          quit();
      }
    });
}

function viewBudgetByDept() {
  let sql = `
    SELECT
      id,
      name
    FROM departments
    ORDER BY name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let departmentList = results.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "Which Department do you want to view?",
          name: "deptId",
          choices: departmentList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.deptId];

        let sql = `
          SELECT
            SUM(roles.salary) AS "Department Budget"
          FROM employees
          LEFT JOIN roles
            ON employees.role_id=roles.id
          LEFT JOIN departments
            ON roles.department_id=departments.id
          WHERE departments.id = ?
        `;

        db.query(sql, input, (error, results) => {
          if (error) throw error;

          console.log("\n");
          console.table(results);

          begin();
        });
      });
  });
}

function viewEmployeesByDept() {
  let sql = `
    SELECT
      id,
      name
    FROM departments
    ORDER BY name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let departmentList = results.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "Which Department do you want to view?",
          name: "deptId",
          choices: departmentList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.deptId];

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
          LEFT JOIN employees manager
          ON manager.id=employees.manager_id
          LEFT JOIN roles
            ON employees.role_id=roles.id
          LEFT JOIN departments
            ON roles.department_id=departments.id
          WHERE departments.id = ?
        `;

        db.query(sql, input, (error, results) => {
          if (error) throw error;

          console.log("\n");
          console.table(results);

          begin();
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
      ON roles.department_id=departments.id
    LEFT JOIN employees manager
      ON manager.id=employees.manager_id
  ;`;

  db.query(sql, (error, results) => {
    if (error) throw error;

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
      ON roles.department_id=departments.id
  ;`;

  db.query(sql, (error, results) => {
    if (error) throw error;

    console.log("\n");
    console.table(results);

    begin();
  });
}

// The viewDepartments function will return a table showing all departments.
function viewDepartments() {
  let sql = `
    SELECT
      id,
      name
    FROM departments
  ;`;

  db.query(sql, (error, results) => {
    if (error) throw error;

    console.log("\n");
    console.table(results);

    begin();
  });
}

function updateEmployeeRole() {
  let sql = `
    SELECT
      id,
      first_name,
      last_name
    FROM employees
    ORDER BY first_name, last_name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

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

        db.query(sql, (error, results) => {
          if (error) throw error;

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

function updateEmployeeMgr() {
  let sql = `
    SELECT
      id,
      first_name,
      last_name
    FROM employees
    ORDER BY first_name, last_name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let employeesList = results.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "Which Employee's manager do you want to update?",
          name: "employeeId",
          choices: employeesList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.employeeId];

        let sql = `
          SELECT
            id,
            first_name,
            last_name
          FROM employees
          ORDER BY first_name, last_name
        `;

        db.query(sql, (error, results) => {
          if (error) throw error;

          let managersList = results.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));

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
                UPDATE employees
                SET employees.manager_id = ?
                WHERE employees.id = ?
              `;
              // reverse the array to match the order needed for the UPDATE statement
              db.query(sql, input.reverse(), (error) => {
                if (error) throw error;

                console.log("Updated employee's manager");

                begin();
              });
            });
        });
      });
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

      db.query(sql, (error, results) => {
        if (error) throw error;

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

            db.query(sql, (error, results) => {
              if (error) throw error;

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

      db.query(sql, (error, results) => {
        if (error) throw error;
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
                department_id
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

      db.query(sql, input, (error) => {
        if (error) throw error;

        console.log(`Added ${input} to the database`);

        begin();
      });
    });
}

function deleteEmployee() {
  let sql = `
    SELECT
      id,
      CONCAT(first_name, " ", last_name) AS employee
    FROM employees
    ORDER BY first_name, last_name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let empList = results.map(({ id, employee }) => ({
      name: employee,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "Which Employee do you want to delete?",
          name: "empId",
          choices: empList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.empId];

        let sql = `
          DELETE FROM employees
          WHERE id = ?
        `;

        db.query(sql, input, (error) => {
          if (error) throw error;

          console.log(`Deleted Employee from the database`);

          begin();
        });
      });
  });
}

function deleteRole() {
  let sql = `
    SELECT
      id,
      title
    FROM roles
    ORDER BY title
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let roleList = results.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "What Role do you want to delete?",
          name: "roleId",
          choices: roleList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.roleId];

        let sql = `
          DELETE FROM roles
          WHERE id = ?
        `;

        db.query(sql, input, (error) => {
          if (error) throw error;

          console.log(`Deleted Role from the database`);

          begin();
        });
      });
  });
}

function deleteDepartment() {
  let sql = `
    SELECT
      id,
      name
    FROM departments
    ORDER BY name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let departmentList = results.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          message: "What Department do you want to delete?",
          name: "deptId",
          choices: departmentList,
        },
      ])
      .then(function (userInput) {
        let input = [userInput.deptId];

        let sql = `
          DELETE FROM departments
          WHERE id = ?
        `;

        db.query(sql, input, (error) => {
          if (error) throw error;

          console.log(`Deleted Department from the database`);

          begin();
        });
      });
  });
}

function quit() {
  db.end();
}

begin();
