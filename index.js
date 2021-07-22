const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const e = require('cors');
var app = express();

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '00164458',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connecton succeded');
    else
        console.log('DB connection failed \n Error ' + JSON.stringify(err, undefined, 2))
})

app.get('/', (req, res) => {
    res.send("APP IS RUNNING");
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

/* get all data from database */
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

/* get an from database */
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

/* delete an from database */
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Successfully deleted');
        else
            console.log(err);
    })
});

/* insert an from database */
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
     CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('inserted employee id :' + element[0].EmpID);
            });
        else
            console.log(err);
    })
});

/* update an from database */
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
     CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated Successfully');
        else
            console.log(err);
    })
});

