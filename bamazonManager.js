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
    connection.query("SELECT * FROM ??", ["products"], function(err, res) {
        if (err) throw err;

    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: '\nPlease select an option',
            choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
        }
    ]).then(function(answer) {
        if (answer.selection == 'View Products For Sale') {
            console.log(`\n`);
            for (let i = 0; i < res.length; i++) {
                console.log(`${res[i].item_id} | ${res[i].product_name} | $${res[i].price} | Qty: ${res[i].stock_quantity}`);
            }
            end();
        }
        else if (answer.selection == "View Low Inventory") {
            console.log(`\n`);
            for (let i = 0; i < res.length; i++) {
                if (parseInt(res[i].stock_quantity) < 5) {
                    console.log(`${res[i].item_id} | ${res[i].product_name} | $${res[i].price} | Qty: ${res[i].stock_quantity}`);
                }
            }
            end();
        }
        else if (answer.selection == "Add To Inventory") {
            let itemArray = [];
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'addChoice',
                    message: '\nWhich item would you like to add?',
                    choices: function() {
                        
                        for (let i = 0; i < res.length; i++) {
                            itemArray.push(res[i].product_name);
                        }
                        return itemArray
                    }
                },
                {
                    type: 'input',
                    name: 'addInventory',
                    message: '\nHow many would you like to add?',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            ]).then(function(addRes) {
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: parseInt(res[itemArray.indexOf(addRes.addChoice)].stock_quantity) + parseInt(addRes.addInventory)
                    },
                    {
                        product_name: addRes.addChoice
                    }
                ],
                function(err, ures) {
                    if (err) throw err;
                    console.log("\nProduct updated!\n")
                    end();
                })
            })
        }
        else if (answer.selection == "Add New Product") {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'product',
                    message: '\nWhat product would you like to add?'
                },
                {
                    type: 'input',
                    name: 'department',
                    message: '\nWhat department should it be in?'
                },
                {
                    type: 'input',
                    name: 'price',
                    message: '\nWhat is the price?',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    } 
                },
                {
                    type: 'input',
                    name: 'stock',
                    message: '\nHow many are we recieving?',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    } 
                }
            ]).then(function(newItem) {
                connection.query("INSERT INTO products SET ?",
                {
                   product_name: newItem.product,
                   department_name: newItem.department,
                   price: newItem.price,
                   stock_quantity: newItem.stock
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("\nProduct added!\n")
                    end();
                })
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
            message: '\nWould you like to continue?',
            choices: ["Yes", "No"]
        }
    ]).then(function(answer) {
        if (answer.end == "Yes") {
            start();
        }
        else {
            connection.end();
        }
    })
}