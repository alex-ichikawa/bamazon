var mysql = require("mysql");
var inquirer = require("inquirer");

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
            choices: ["View Produc Sales by Department", "Create New Department"]
        }
    ]).then(function (answer) {
        if (answer.selection == "View Produc Sales by Department") {
            dropCreate();
            connection.query(
                "SELECT * FROM ??", ["supervisor"], function (err, res) {
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                        console.log(`${res[i].department_id} | ${res[i].department_name} | ${res[i].over_head_costs} | ${res[i].product_sales} | ${res[i].total_profit}`);
                    }
                    end();
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
    connection.query("CREATE TABLE total_sales AS (SELECT department_name, SUM(product_sales) as product_sales FROM products GROUP BY department_name);");
    connection.query("CREATE TABLE supervisor AS (SELECT T0.department_id, T0.department_name ,T0.over_head_costs ,T1.product_sales ,SUM(T1.product_sales - T0.over_head_costs) as total_profit FROM departments T0 LEFT OUTER JOIN total_sales T1 ON T0.department_name = T1.department_name GROUP BY T0.department_name ORDER BY T0.department_id);")
}




// connection.query(
//     "DESCRIBE supervisor", function(err, res) {
//         console.log(res[0].Field + res[1].Field);
//     }
// )