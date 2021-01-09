const connection = require("../config/connection.js");
const cTable = require('console.table');

const orm = {
    selectWholeTable: function(tableInput, cb) {
      let queryString = "SELECT * FROM ??";
      connection.query(queryString, [tableInput], function(err, result) {
        if (err) throw err;
        return cb(cTable.getTable(result));
      });
    },

    viewAllEmployees: function(orderCriteria, cb) {
        let queryString = `Select a.id, a.first_name, a.last_name, roles.title, 
        departments.name as department, roles.salary, CONCAT(b.first_name, ' ', b.last_name) as manager
        FROM employees a join roles on a.role_id = roles.id 
        join departments on roles.department_id = departments.id
        left join employees b on b.id = a.manager_id or a.manager_id = null
        order by ${orderCriteria}`;
        console.log(queryString);
        connection.query(queryString, [orderCriteria], function(err, result) {
            if (err) throw err;
            return cb(cTable.getTable(result));
        })
    }
}

module.exports = orm;