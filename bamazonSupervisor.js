var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: "\r\nWhat would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (answer) {
        if (answer.selection == "View Product Sales by Department") {
            dropCreate();
            let values = [];
            let header = [];
            connection.query(
                "SELECT * FROM ??", ["supervisor"], function (err, res) {
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                        values.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
                    }
                    connection.query(
                        "DESCRIBE supervisor", function (err, res) {
                            for (let i = 0; i < res.length; i++) {
                                header.push(res[i].Field)
                            }
                            console.table(header, values);
                            end();
                        })
                })
        }
        else if (answer.selection == "Create New Department") {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: '\r\nWhat is the department name?'
                },
                {
                    type: 'input',
                    name: 'overhead',
                    message: "\r\nWhat is the department over head?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            ]).then(function (res) {
                connection.query(
                    "INSERT INTO departments SET ?",
                    {
                        department_name: res.departmentName,
                        over_head_costs: res.overhead
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("department added");
                        end();
                    }

                )
            })
        }
    })
}

function end() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'end',
            message: '\nWould you like to continue?',
            choices: ["Yes", "No"]
        }
    ]).then(function (answer) {
        if (answer.end == "Yes") {
            start();
        }
        else {
            connection.end();
        }
    })
}

function dropCreate() {
    connection.query("DROP TABLE ??", ["total_sales"]);
    connection.query("DROP TABLE ?? ", ["supervisor"]);
    connection.query("CREATE TABLE ?? AS (SELECT department_name, SUM(??) as ?? FROM ?? GROUP BY ??);" ,["total_sales", "product_sales", "product_sales", "products", "department_name"]);
    connection.query("CREATE TABLE ?? AS (SELECT ??, ??, ??, IFNULL(??, 0) as ?? ,SUM(IFNULL(??, 0) - ??) as ?? FROM ?? T0 LEFT OUTER JOIN ?? T1 ON ?? = ?? GROUP BY ?? ORDER BY ??);", ["supervisor", "T0.department_id", "T0.department_name", "T0.over_head_costs", "T1.product_sales", "product_sales", "T1.product_sales", "T0.over_head_costs", "total_profit", "departments", "total_sales", "T0.department_name", "T1.department_name", "T0.department_name", "T0.department_id"])
}