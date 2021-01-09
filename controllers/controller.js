const inquirer = require('inquirer');
const prompts = require('../prompts');

module.exports = {
    userMainMenu: function (cb) {
        inquirer.prompt(prompts.mainMenuPrompt).then(res => {
            return cb(res);
        })
    }

}
