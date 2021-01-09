const employees = require('./models/employees');
const connection = require("./config/connection.js");
//const controller = require('./controllers/controller');
const inquirer = require('inquirer');
const prompts = require('./prompts');

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
    userMainMenu();
});


function userMainMenu () {
    inquirer.prompt(prompts.mainMenuPrompt).then(res => {
        console.log(res);
        handleMainMenuSelect(res.action);
    })
}





/* employees.viewAll('last_name', function(res) {
    console.log(res);
}) */

function handleMainMenuSelect(optionSelected) {
    switch (optionSelected) {
        case 'View All Employees':
            employees.viewAll('id', function(res) {
                console.log(res);
            })
            break;
        case 'View All Employees By Department':
            employees.viewAll('department', function(res) {
                console.log(res);
            })
            break;
        case 'View All Employees By Manager':
            
            break;
        case 'View All Employees Alphabetically':
          
            break;
        case 'Add Employee':
            
            break;
        case 'Remove Employee':
            
            break;
        case 'Update Employee Role':
           
            break;
        case 'Update Employee Manager':
            
            break;
        case 'View All Roles':
            
            break;
        case 'Add New Role':
            
            break;
        case 'View All Departments':
            
            break;
        case 'Add New Department':
            
            break;
        default:
            console.log('default triggered');
    }
}