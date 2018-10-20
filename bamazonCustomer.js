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

let idArray = [];

function start() {
    connection.query("SELECT ??, ??, ?? FROM ??", ["item_id", "product_name", "price", "products"], function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id} | ${res[i].product_name} | $${res[i].price}`);
            idArray.push(res[i].item_id);
        }
        console.log("-----------------------------------");
        purchase();
    })
}

function purchase() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'selection',
            message: "Enter the number of the item you'd like to purcahse",
            validate: function (value) {
                if (idArray.indexOf(parseInt(value)) == -1) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: "Enter the quantity you'd like to purcahse",
            validate: function (value) {
                if (isNaN(value) === false && value > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    ]).then(function (res) {
        connection.query("SELECT ??, ??, ?? FROM ?? WHERE ?? = ?", ["price", "stock_quantity", "product_sales", "products", "item_id", res.selection], function (err, qres) {
            if (parseInt(qres[0].stock_quantity) == 0) {
                console.log("Out of stock");
                end();
            }
            else if (parseInt(qres[0].stock_quantity) < parseInt(res.quantity)) {
                console.log(`Insufficient quantity in stock to process your order, we have ${qres[0].stock_quantity} in stock`);
                end();
            }
            else {
                console.log("\r\nYour total is $" + parseInt(qres[0].price) * parseInt(res.quantity));
                connection.query("UPDATE products SET ?, ? WHERE ?",
                    [
                        {
                            stock_quantity: parseInt(qres[0].stock_quantity) - parseInt(res.quantity)
                        },
                        {
                            product_sales: parseInt(qres[0].product_sales) + (parseInt(qres[0].price) * parseInt(res.quantity))
                        },
                        {
                            item_id: res.selection
                        }
                    ],
                    function (err, response) {
                        if (err) throw err;
                        end();

                    })
            }
        })
    })
}

function end() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'end',
            message: '\nWould you like to continue shopping?',
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