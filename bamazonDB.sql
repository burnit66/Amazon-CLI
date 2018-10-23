-- RUN ONE
CREATE DATABASE bamazonDB;


-- RUN TWO
USE bamazonDB;
DROP TABLE products;
CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(5) NOT NULL,
    PRIMARY KEY (item_id)
);


-- RUN THREE
USE bamazonDB;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Towels", "Bathroom", 21.40, 4), ("Soap", "Bathroom", 4.99, 12), ("Bowls", "Kitchen", 4.20, 5), ("Oven Mitts", "Kitchen", 12.85, 2), ("Mixer", "Kitchen", 199.90, 3), ("Silverware set", "Kitchen", 25.99, 3), ("Bath Matt", "Bathroom", 14.99, 9), ("Shower Curtain", "Bathroom", 21.15, 2), ("Kitchen Table", "Kitchen", 220.00, 2), ("Rug", "Home", 64.99, 10), ("Egg Chair", "Home", 89.99, 5), ("Pot and pan set", "Kitchen", 249.99, 3), ("Keychains", "ETC", 0.99, 11), ("Gum", "ETC", 0.79, 13);


--RUN FOUR
USE bamazonDB;
SELECT * FROM products;