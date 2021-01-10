module.exports = {
    createArrayFromSqlData: (sqlData, key) => {
        let newArr = [];
        for (let i = 0; i < sqlData.length; i++) {
            newArr.push(sqlData[i][key]);
        }
        return newArr;
    },
    
    createArrOfNames: (sqlData) => {
        let newArr = [];
        for (let i = 0; i < sqlData.length; i++) {
            newArr.push(`${sqlData[i].first_name} ${sqlData[i].last_name}`);
        }
        return newArr;
    },
    
    getIdOfSqlTarget: (sqlData, key, targetValue) => {
        for (let i = 0; i < sqlData.length; i++) {
            if (sqlData[i][key] === targetValue) {
                return sqlData[i].id;
            }
        }
    },
    
    getIdOfEmployee: (sqlData, firstName, lastName) => {
        for (let i = 0; i < sqlData.length; i++) {
            if (sqlData[i].first_name === firstName && sqlData[i].last_name === lastName) {
                return sqlData[i].id;
            }
        }
    },
    
    createNameObj: (name) => {
        let nameArr = name.split(' ');
        return {firstName: nameArr[0], lastName: nameArr[1]};
    }

}
