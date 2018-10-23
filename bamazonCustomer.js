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
    listProducts();
    whatToDo();
});

function listProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n")
        console.table(res);
    });
}

function whatToDo() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([{
                name: "choice",
                type: "input",
                message: "What is the product ID of the item you'd like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {

            var userChoice = Number(answer.choice)
            var userQuantity = Number(answer.quantity)
            var productReturn;

            function checkStock() {
                if (userChoice > results.length) {
                    console.log("This is not a valid product!")
                    return false
                }
                for (i = 0; i < results.length; i++) {
                    if (userChoice === results[i].item_id) {
                        console.log("You chose: " + results[i].product_name + "\n")
                        productReturn = results[i]
                        return true;
                    }
                }
            }
            checkStock()

            function fulfillOrder(productReturn, userQuantity) {
                if (userQuantity <= results[i].stock_quantity) {
                    var newStock = productReturn.stock_quantity - userQuantity
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: newStock
                            },
                            {
                                item_id: productReturn.item_id
                            }
                        ],
                        function (err) {
                            if (err) throw err
                            var totalPrice = userQuantity * productReturn.price
                            totalPrice = Math.round(totalPrice * 100) / 100
                            console.log("Congratulations! You just ordered " + userQuantity + " " + productReturn.product_name + "(s)" + "\n" + "You spent a total of " + totalPrice + "\n")
                            connection.end()
                        })
                    return true;
                } else {
                    console.log("Insufficient quantity! We only have " + productReturn.stock_quantity + " " + productReturn.product_name + "(s)" + "\n")
                    return false
                }
            }
            fulfillOrder(productReturn, userQuantity)
        });
    });
}