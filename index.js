// Modules to require
require("dotenv").config();
require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Database connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// The begin function lists the user options,
// and calls the corresponding function
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
    // call the function for the user's choice
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

// The viewBudgetByDept function will display
// the sum of salaries for the selected department
function viewBudgetByDept() {
  // get a list of departments
  let sql = `
    SELECT
      id,
      CONCAT(name, ", id: ", id) AS departments
    FROM departments
    ORDER BY departments
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let departmentList = results.map(({ id, departments }) => ({
      name: departments,
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

        // sum the salaries of the selected department
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

// The viewEmployeesByDept function will display
// a table of employees for the selected department
function viewEmployeesByDept() {
  // get a list of departments
  let sql = `
    SELECT
      id,
      CONCAT(name, ", id: ", id) AS departments
    FROM departments
    ORDER BY departments
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let departmentList = results.map(({ id, departments }) => ({
      name: departments,
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

        // list the employees for the selected department
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

// The viewEmployees function will display
// a table of all employees
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

// The viewRoles function will display
// a table of all roles
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

// The viewDepartments function will display
// a table of all departments
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

// The updateEmployeeRole function will update
// the role for a selected employee
function updateEmployeeRole() {
  let sql = `
    SELECT
      id,
      CONCAT(first_name, " ", last_name, ", id: ", id) AS name
    FROM employees
    ORDER BY name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let employeesList = results.map(({ id, name }) => ({
      name: name,
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

        // get a list of roles
        let sql = `
          SELECT
            id,
            CONCAT(title, ", id: ", id) AS roles
          FROM roles
          ORDER BY roles
        `;

        db.query(sql, (error, results) => {
          if (error) throw error;

          let roleList = results.map(({ id, roles }) => ({
            name: roles,
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

              // update the role for the selected employee
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

// The updateEmployeeMgr function will update
// the manager for a selected employee
function updateEmployeeMgr() {
  // get a list of employees
  let sql = `
    SELECT
      id,
      CONCAT(first_name, " ", last_name, ", id: ", id) AS name
    FROM employees
    ORDER BY name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let employeesList = results.map(({ id, name }) => ({
      name: name,
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

        // get a list of employees (managers)
        let sql = `
          SELECT
            id,
            CONCAT(first_name, " ", last_name, ", id: ", id) AS name
          FROM employees
          ORDER BY name
        `;

        db.query(sql, (error, results) => {
          if (error) throw error;

          let managersList = results.map(({ id, name }) => ({
            name: name,
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

              // update the manager for the selected employee
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

// The addEmployee function will add an employee to the database
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "newEmpFirstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "newEmpLastName",
      },
    ])
    // add role to employee
    .then(function (userInput) {
      let input = [userInput.newEmpFirstName, userInput.newEmpLastName];

      // get a list of roles
      let sql = `
        SELECT
          id,
          CONCAT(title, ", id: ", id) AS roles
        FROM roles
        ORDER BY roles
      `;

      db.query(sql, (error, results) => {
        if (error) throw error;

        let roleList = results.map(({ id, roles }) => ({
          name: roles,
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

            // get a list of employees (managers)
            let sql = `
              SELECT
                id,
                CONCAT(first_name, " ", last_name, ", id: ", id) AS name
              FROM employees
              ORDER BY name
            `;

            db.query(sql, (error, results) => {
              if (error) throw error;

              let managersList = results.map(({ id, name }) => ({
                name: name,
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

                  // add the new employee
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

// The addRole function will add a role to the database
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the Role?",
        name: "newRole",
      },
      {
        type: "input",
        message: "What is the Salary of the Role?",
        name: "newRoleSalary",
      },
    ])
    .then(function (userInput) {
      let input = [userInput.newRole, userInput.newRoleSalary];

      // get a list of departments
      let sql = `
        SELECT
          id,
          CONCAT(name, ", id: ", id) AS departments
        FROM departments
        ORDER BY departments
      `;

      db.query(sql, (error, results) => {
        if (error) throw error;
        let list = results.map(({ id, departments }) => ({
          name: departments,
          value: id,
        }));

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

            // add the new role
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

// The addDepartment function will add a department to the database
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the Department?",
        name: "newDept",
      },
    ])
    .then(function (userInput) {
      let input = [userInput.newDept];

      // add the new department
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

// The deleteEmployee function will delete an employee from the database
function deleteEmployee() {
  // get a list of employees
  let sql = `
    SELECT
      id,
      CONCAT(first_name, " ", last_name, ", id: ", id) AS name
    FROM employees
    ORDER BY name
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let empList = results.map(({ id, name }) => ({
      name: name,
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

        // delete the selected employee
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

// The deleteRole function will delete a role from the database
function deleteRole() {
  // get a list of roles
  let sql = `
    SELECT
      id,
      CONCAT(title, ", id: ", id) AS roles
    FROM roles
    ORDER BY roles
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let roleList = results.map(({ id, roles }) => ({
      name: roles,
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

        // delete the selected role
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

// The deleteDepartment function will delete a department from the database
function deleteDepartment() {
  // get a list of departments
  let sql = `
    SELECT
      id,
      CONCAT(name, ", id: ", id) AS departments
    FROM departments
    ORDER BY departments
  `;

  db.query(sql, (error, results) => {
    if (error) throw error;

    let departmentList = results.map(({ id, departments }) => ({
      name: departments,
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

        // delete the selected department
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
