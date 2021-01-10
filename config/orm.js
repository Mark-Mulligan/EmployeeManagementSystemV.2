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

    simpleSelect: function(colsArr, table, cb) {
        let colsString = colsArr.join(', ');
        let queryString = `SELECT ${colsString} FROM ??`;
        connection.query(queryString, [table], function(err, result) {
            if (err) throw err;
            return cb(result);
        })
    },

    selectAllWithParam: function(colsArr, table, criteria, target, cb) {
        let colsString = colsArr.join(', ');
        let queryString = `SELECT ${colsString} FROM ?? WHERE ${criteria} != ?`
        connection.query(queryString, [table, target], function(err, result) {
            if (err) throw err;
            return cb(result);
        })
    },

    viewAllEmployees: function(orderBy, cb) {
        let queryString = `Select a.id, a.first_name, a.last_name, roles.title, 
        departments.name as department, roles.salary, CONCAT(b.first_name, ' ', b.last_name) as manager
        FROM employees a join roles on a.role_id = roles.id 
        join departments on roles.department_id = departments.id
        left join employees b on b.id = a.manager_id or a.manager_id = null
        order by ${orderBy}`;
        
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            return cb(result);
        })
    },

    viewAllRoles: function(cb) {
        let queryString = `select roles.id, title, salary, departments.name as department from roles 
        join departments where roles.department_id = departments.id;`
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            return cb(result);
        })
    },

    createEmployee: function(firstName, lastName, roleId, managerId, cb) {
        let queryString = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        connection.query(queryString, [firstName, lastName, roleId, managerId], function(err, results) {
            if (err) throw err;
            return cb('New employee added.');
        })
    },

    createRole: function(title, salary, department_id, cb) {
        let queryString = `INSERT INTO roles (title, salary, department_id) values (?, ?, ?)`;
        connection.query(queryString, [title, salary, department_id], function (err, results) {
            if (err) throw err;
            return cb('New Role Add');
        })
    },

    createDepartment: function(name, cb) {
        let queryString = `INSERT INTO departments (name) values (?)`;
        connection.query(queryString, [name], function (err, results) {
            if (err) throw err;
            return cb('New department added');
        })
    },

    deleteEmployee: function (employeeId, nameObj, cb) {
        let queryString = `DELETE FROM employees WHERE id = ?`;
        connection.query(queryString, [employeeId], function(err, results) {
            if (err) throw err;
            return cb(`${nameObj.firstName} ${nameObj.lastName} removed from employees table.`);
        })
    },

    updateTable: function(table, propertyToUpdate, updatedValue, targetId, cb) {
        let queryString = `UPDATE ?? SET ?? = ? WHERE id = ?`;
        connection.query(queryString, [table, propertyToUpdate, updatedValue, targetId], function(err, results) {
            return cb(`${table} updated.`);
        })
    }
}

module.exports = orm;