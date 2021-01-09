var orm = require("../config/orm.js");

const employees = {
    getAll: function(cb) {
        orm.selectWholeTable('employees', function(res) {
            cb(res);
        })
    },

    viewAll: function(orderBy, cb) {
        orm.viewAllEmployees(orderBy, function(res) {
            cb(res);
        })
    }
}

module.exports = employees;