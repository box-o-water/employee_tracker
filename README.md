# employee_tracker

![open issues](https://img.shields.io/github/issues-raw/box-o-water/employee_tracker)
![closed issues](https://img.shields.io/github/issues-closed-raw/box-o-water/employee_tracker)

![license](https://img.shields.io/static/v1?label=license&message=MIT&color=blue)

## Description

A command-line application to manage an employee database, using Node.js, Inquirer, and MySQL.

![preview](//assets/images/employee_tracker_preview1.png)
![preview](/assets/images/employee_tracker_preview2.png)

Click [here TODO](https://) to see the deployed application.

## Table of Contents

- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)
- [Credits](#credits)
- [License](#license)

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

GIVEN a command-line application that accepts user input:

- [x] WHEN I start the application
      THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

- [x] WHEN I choose to view all departments
      THEN I am presented with a formatted table showing department names and department ids

- [x] WHEN I choose to view all roles
      THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

- [x] WHEN I choose to view all employees
      THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

- [x] WHEN I choose to add a department
      THEN I am prompted to enter the name of the department and that department is added to the database

- [x] WHEN I choose to add a role
      THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

- [x] WHEN I choose to add an employee
      THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

- [x] WHEN I choose to update an employee role
      THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Installation

- Install `nvm`
- Use `nvm` to install `npm`
- $ git clone git@github.com:box-o-water/employee_tracker.git
- $ npm install
- Install and set up mysql

## Usage

- $ mysql.server start
- $ mysql -u <user> -p
- mysql> SOURCE db/schema.sql
- mysql> SOURCE db/seeds.sql
- Optional: familiarize yourself with the data tables (next 3 SELECT commands):
- mysql> SELECT \* from departments;
- mysql> SELECT \* from roles;
- mysql> SELECT \* from employees;
- mysql> quit
- Create a copy of `.env_example` file at the same level named `.env`; `.env` is in .gitignore and should NOT be pushed to any VCS (like Github)
- Add your `USERDB` and `PASSWORD` values to the `.env` file
- $ node index.js
- Answer prompts

## Contributing

To contribute, create an issue in this repo, or fork this repo and create a pull request against this repo from your fork.

# Tests

N/A

# Questions

Visit my [box-o-water](https://github.com/box-o-water) profile page.

For any questions about this project, please send an email to <boxooowater@gmail.com>.

## Credits

N/A

## License

Licensed under the [MIT](/LICENSE) license.
