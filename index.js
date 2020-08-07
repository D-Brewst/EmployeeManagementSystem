const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");
const logo = require("asciiart-logo");
var roles;
var employees;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "KryDevJusNa1200*",
  database: "employee_trackerDB"
});

const initialQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "initial",
        choices: ["Add an employee", "Add a department", "Add a role", "View departments", "View employees", "Update employee role","View all employees by manager", "Remove employee", "View all employees by department", "View all roles", "Add a role", "Remove roles", "Quit"]
    }
]

const addDepartmentQuestions = [
    {
        type: "input",
        message: "What is the name of your department?",
        name: "department_name",
    }
]

const addRole = [
    {
        type: "input",
        message: "What is the title of your new role?",
        name: "titleRole",
    },
    {
        type: "input",
        message: "What is the salary for this role?",
        name: "salary",
    },
    {
        type: "input",
        message: "What is the department id for this role?",
        name: "departmentIDrole",
    }
]

const removeRole = [
    {
        type: "list",
        message: "What is your employee's role?",
        name: "roleRemoval",
        choices: roles || ["Manager", "Associate", "Soft"]
    }
]

const quit = [
    {
        type: "list",
        message: "Are your sure you would like to quit?",
        name: "quit",
        choices: ["Yes", "No"]
    }
]

const removeEmployee = [
    {
        type: "list",
        message: "What is your employee's role?",
        name: "employeeRemoval",
        choices: employees || ["Manager", "Associate", "Soft"]
    }
]


async function start(){
    const userChoice = await inquirer.prompt(initialQuestion);
    switch(userChoice.initial){
        case "Add an employee":
            console.log("You picked add an employee!")
            addEmployee();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addNewRole();
            break;
        case "View departments":
            printDepartments();
            break;
        case "View employees":
            printEmployees();
            break;
        case "Update employee role":
            updateRole();
            break;
        case "View all employees by manager":
            employeesByManager();
            break;
        case "Remove employee":
            rmEmployee();
            break;
        case "View all employees by department":
            employeesByDepartment();
            break;
        case "View all roles":
            printRoles();
            break;
        case "Remove roles":
            rmRole();
            break;
        case "Quit":
            connection.end();
            break;
        default:
            connection.end();
    }

}

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    console.log(
        logo({
            name: 'Employee Management System',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'white',
            textColor: 'white',
        })
        .render()
    );
    start();
  });

  function addEmployee(){
    connection.query("SELECT * FROM employee", async (err, employee) => {
        // get the name, category, starting bid from user
        const { first_name, last_name, role, manager } = await inquirer.prompt([
            {
                type: "input",
                message: "What is your employee's first name?",
                name: "first_name",
            },
            {
                type: "input",
                message: "What is your employee's last name?",
                name: "last_name",
            },
            {
                type: "list",
                message: "What is your employee's roleID?",
                name: "role",
                choices: () => {
                    return employee.map((employee) => employee.role_id);
                  } 
            },
            {
                type: "list",
                message: "Who is your employee's manager?",
                name: "manager",
                choices: [2,3] 
            }
        ]);
        connection.query("INSERT INTO employee SET ?",
        {
          first_name: first_name,
          last_name: last_name,
          role_id: role,
          manager_id: manager
        },
        function (err) {
          if (err) throw err;
          console.log("New employee was added successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        });
    })
}

async function addDepartment(){
    const departmentDetails = await inquirer.prompt(addDepartmentQuestions)
    connection.query("INSERT INTO department SET ?",
        {
          name: departmentDetails.department_name
        },
        function (err) {
          if (err) throw err;
          console.log("New department was added successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
}

async function addNewRole(){
    const roleDetails = await inquirer.prompt(addRole)
    connection.query("INSERT INTO role SET ?",
        {
            title: roleDetails.titleRole,
            salary: roleDetails.salary,
            department_id: roleDetails.departmentIDrole
        },
        function (err) {
          if (err) throw err;
          console.log("New department was added successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
}

async function updateRole() {
    // query for the category choices
    connection.query("SELECT * FROM employee", async (err, employee) => {
        // get the name, category, starting bid from user
        const { worker, newrole } = await inquirer.prompt([
          {
            type: "list",
            message: "Choose an employee to update:",
            name: "worker",
            choices: () => {
              return employee.map((employee) => employee.last_name);
            },
          },
          {
            type: "list",
            message: "What is this employee's new role?",
            name: "newrole",
            choices: () => {
                return employee.map((employee) => employee.role_id);
            }
          }
        ]);
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          role_id: newrole,
        },
        {
          last_name: worker,
        },
      ],
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        console.table(employee);
        start();
      }
    );
})
}

function printDepartments(){
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
      });
}
// SELECT first_name, last_name, role_id FROM employee
function printEmployees(){
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
      });
}

function printRoles(){
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
      });
}

function employeesByManager(){
    connection.query("SELECT * FROM employee", async (err, employee) => {
        // get the name, category, starting bid from user
        const { managerID } = await inquirer.prompt([
          {
            type: "list",
            message: "Choose an manager:",
            name: "managerID",
            choices: [2,3]
          }
          ]);
    connection.query(`SELECT first_name, last_name FROM employee WHERE manager_id=${managerID}`, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
      });
    })
}

function employeesByDepartment(){
    connection.query("SELECT * FROM department", async (err, department) => {
        // get the name, category, starting bid from user
        const { departmentName } = await inquirer.prompt([
          {
            type: "list",
            message: "Choose a department:",
            name: "departmentName",
            choices: () => {
              return department.map((department) => department.name);
            }
          }
        ]);
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res.filter((name) => departmentName === name.department));
        start();
      });
    })
}

async function rmRole(){
    connection.query("SELECT * FROM role", async (err, role) => {
        const { roleName } = await inquirer.prompt([
          {
            type: "list",
            message: "Choose a role to delete:",
            name: "roleName",
            choices: () => {
              return role.map((role) => role.title);
            }
          }
        ]);
        console.log(roleName);
    connection.query(`DELETE FROM role WHERE ?`,
    {
        title: roleName
     },
     function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(role);
        start();
      });
    })
}

function rmEmployee(){
    connection.query("SELECT * FROM employee", async (err, employee) => {
        const { employeeName } = await inquirer.prompt([
          {
            type: "list",
            message: "Choose an employee to remove:",
            name: "employeeName",
            choices: () => {
              return employee.map((employee) => `${employee.last_name}`);
            }
          }
        ]);
    connection.query(`DELETE FROM employee WHERE ?`,
    {
        last_name: employeeName
     },
     function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        start();
      });
    })
}

