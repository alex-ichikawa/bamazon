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
                if (isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    ]).then(function (res) {
        connection.query("SELECT ??, ?? FROM ?? WHERE ?? = ?", ["price", "stock_quantity", "products", "item_id", res.selection], function (err, qres) {
            if (parseInt(qres[0].stock_quantity) < parseInt(res.quantity)) {
                console.log("Insufficient quantity!");
                // Add inquirer to ask if you'd like to continue shopping, if no close connection
            }
            else {
                console.log("Your total is $" + parseInt(qres[0].price) * parseInt(res.quantity));
                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: parseInt(qres[0].stock_quantity) - parseInt(res.quantity)
                        },
                        {
                            item_id: res.selection
                        }
                    ],
                    function(err, response) {
                        console.log(response.affectedRows + " products updated!\n");

                })
            }
        })
    })
}