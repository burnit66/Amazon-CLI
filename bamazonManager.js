var mysql = require("mysql");
var cTable = require("console.table");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",

    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Server is listening and connected" + "\n");
    showCommands();
});

function showCommands() {
    inquirer.prompt([{
        name: "selection",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "What would you like to do?"
    }]).then(function (answer) {
        switch (answer.selection) {
            case "View Products for Sale":
                listProducts();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addInv();
                break;
            case "Add New Product":
                addProd();
                break;
            default:
                break;
        }
    });
}

function listProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log("\n")
        console.table(results);
        showCommands()
    });
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 3", function (err, results) {
        if (err) throw err;
        console.log("\n")
        console.table(results)
        showCommands()
    });
}

function addInv() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([{
                name: "products",
                type: "list",
                choices: function () {
                    var choiceArray = []
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name)
                    }
                    return choiceArray;
                },
                message: "Which product do you need to add inventory to?"
            },
            {
                name: "quantity",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                },
                message: "How many do you want to add?"
            }
        ]).then(function (answer) {
            connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?", [answer.quantity, answer.products], function (err) {
                if (err) throw err
                console.log("Successfully added " + answer.quantity + " " + answer.products + "(s)")
                showCommands()
            })
        })
    })
}

function addProd() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 3", function (err, results) {
        if (err) throw err;
        inquirer.prompt([{
                name: "product",
                type: "input",
                message: "What is the product?"
            },
            {
                name: "dept",
                type: "list",
                choices: ["Bathroom", "Kitchen", "Home", "ETC"],
                message: "Which department does this product belong in?"
            },
            {
                name: "price",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                },
                message: "Price this item - make sure to format it correctly - e.g 2.00"
            },
            {
                name: "stock",
                type: "input",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                },
                message: "How many are in stock?"
            }
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.product,
                    department_name: answer.dept,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("\n" + answer.product + " successfully added into inventory log! \n");
                    showCommands()
                }
            );
        })
    });
}