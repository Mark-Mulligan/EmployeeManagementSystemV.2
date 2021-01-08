const connection = require("../config/connection.js");

const orm = {
    selectWhere: function(tableInput, colToSearch, valOfCol) {
      let queryString = "SELECT * FROM ?? WHERE ?? = ?";
      connection.query(queryString, [tableInput, colToSearch, valOfCol], function(err, result) {
        if (err) throw err;
        console.log(result);
      });
    }
}

module.exports = orm;