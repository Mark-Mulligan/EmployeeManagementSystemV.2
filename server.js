const connection = require("./config/connection.js");
const cTable = require('console.table');
const util = require('./util');
var orm = require("./config/orm.js");
const inquirer = require('inquirer');
const prompts = require('./prompts');

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    userMainMenu();
});

function userMainMenu() {
    inquirer.prompt(prompts.mainMenuPrompt).then(res => {
        console.log(res.action);
        handleMainMenuSelect(res.action);
    })
}

function handleMainMenuSelect(optionSelected) {
    switch (optionSelected) {
        case 'View All Employees':
            viewAllEmployees('id');
            break;
        case 'View All Employees By Department':
            viewAllEmployees('department');
            break;
        case 'View All Employees By Manager':
            viewAllEmployees('manager');    
            break;
        case 'View All Employees Alphabetically':
            viewAllEmployees('last_name');
            break;
        case 'Add Employee':
            createEmployee();
            break;
        case 'Remove Employee':
            deleteEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'Update Employee Manager':
            updateEmployeeManager();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'Add New Role':
            createRole();
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'Add New Department':
            createDepartment();
            break;
        default:
            console.log('default triggered');
    }
}

function continueProgram() {
    inquirer.prompt(prompts.continueProgramPrompt).then(res => {
        if (res.continue) userMainMenu();
        else connection.end();
    })
}

function viewAllEmployees (orderBy) {
    orm.viewAllEmployees(orderBy, (employees) => { 
        console.log(cTable.getTable(employees));
        continueProgram();
    });

}

function viewAllDepartments () {
    orm.simpleSelect(['*'], 'departments', function(departmentsObj) {
        console.log(cTable.getTable(departmentsObj));
        continueProgram();
    })
}

function viewAllRoles () {
    orm.viewAllRoles(function(roles) {
        console.log(cTable.getTable(roles));
        continueProgram();
    })
}

function createEmployee() {
    orm.simpleSelect(['id', 'first_name', 'last_name'], 'employees', function (employeesObj) {
        let employeesArr = util.createArrOfNames(employeesObj);
        employeesArr.push('No Manager');

        orm.simpleSelect(['id', 'title'], 'roles', function (rolesObj) {
            let rolesArr = util.createArrayFromSqlData(rolesObj, 'title');

            inquirer.prompt(prompts.createEmployeePrompts(rolesArr, employeesArr)).then(res => {
                let roleId = util.getIdOfSqlTarget(rolesObj, 'title', res.role);

                if (res.manager === 'No Manager') {
                    orm.createEmployee(res.firstName, res.lastName, roleId, null, function(res) { 
                        console.log(res);
                    });
                } else {
                    let manager = util.createNameObj(res.manager);
                    let managerId = util.getIdOfEmployee(employeesObj, manager.firstName, manager.lastName);
                    orm.createEmployee(res.firstName, res.lastName, roleId, managerId, function(res) {
                        console.log(res);
                        continueProgram();
                    });
                }
            })
        });
    })
}

function deleteEmployee () {
    orm.simpleSelect(['id', 'first_name', 'last_name'], 'employees', function (employeesObj) {
        let employeesArr = util.createArrOfNames(employeesObj);

        inquirer.prompt(prompts.deleteEmployeePrompt(employeesArr)).then(res => {
            let selectedEmployee = util.createNameObj(res.employee);
            let employeeId = util.getIdOfEmployee(employeesObj, selectedEmployee.firstName, selectedEmployee.lastName);
            orm.deleteEmployee(employeeId, selectedEmployee, function(res) {
                console.log(res);
                continueProgram();
            })
        })
    })
}

function updateEmployeeRole() {
    orm.simpleSelect(['id', 'first_name', 'last_name'], 'employees', function(allEmployees) {
        let employeesAsArr = util.createArrOfNames(allEmployees);

        orm.simpleSelect(['id', 'title'], 'roles', function(allRoles) {
            let rolesArr = util.createArrayFromSqlData(allRoles, 'title');

            inquirer.prompt(prompts.updateEmployeeRolePrompts(employeesAsArr, rolesArr)).then(res => {
                let selectedEmployee = util.createNameObj(res.employee);
                let employeeId = util.getIdOfEmployee(allEmployees, selectedEmployee.firstName, selectedEmployee.lastName);
                let roleId = util.getIdOfSqlTarget(allRoles, 'title', res.updatedRole);
                console.log('roleId: ' + roleId);
                orm.updateTable('employees', 'role_id', roleId, employeeId, function(res) {
                    console.log(res);
                    continueProgram();
                })
            })
        })
    })
}

function updateEmployeeManager() {
    orm.simpleSelect(['id', 'first_name', 'last_name'], 'employees', function(employees) {
        let employeesArr = util.createArrOfNames(employees);
        
        inquirer.prompt(prompts.updateEmployeeManagerPrompt1(employeesArr)).then(res => {
            let selectedEmployee = util.createNameObj(res.employee);
            let employeeId = util.getIdOfEmployee(employees, selectedEmployee.firstName, selectedEmployee.lastName);

            orm.selectAllWithParam(['id', 'first_name', 'last_name'], 'employees', 'id', employeeId, function(possibleManagers) {
                let managersArr = util.createArrOfNames(possibleManagers);

                inquirer.prompt(prompts.updateEmployeeManagerPrompt2(managersArr)).then(res => {
                    let selectedManager = util.createNameObj(res.manager);
                    let managerId = util.getIdOfEmployee(possibleManagers, selectedManager.firstName, selectedManager.lastName);
                    orm.updateTable('employees', 'manager_id', managerId, employeeId, function(result) {
                        console.log(result);
                        continueProgram();
                    })
                })
            })  
        })
    })
}

function createRole() {
    orm.simpleSelect(['*'], 'departments', function (departments) {
        let departmentsArr = util.createArrayFromSqlData(departments, 'name');

        inquirer.prompt(prompts.createRolesPrompt(departmentsArr)).then(res => {
            let departmentId = util.getIdOfSqlTarget(departments, 'name', res.department);
            orm.createRole(res.roleName, res.salary, departmentId, function(res) {
                console.log(res);
                continueProgram();
            })
        })
    })
}

function createDepartment() {
    inquirer.prompt(prompts.createDepartmentPrompt).then(res => {
        orm.createDepartment(res.name, function(res) {
            console.log(res);
            continueProgram();
        })
    })
}


