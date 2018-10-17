DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL
    ,product_name VARCHAR(50) NOT NULL
    ,department_name VARCHAR(50) NOT NULL
    ,price INT(10) NOT NULL
    ,stock_quantity INT(10) NOT NULL
    ,PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES 
    ("Sony PS4 Pro", "Games", "350", "10")
    ,("Sony XBR75X940E", "Home Theater", "2800", "5")
    ,("Sony STRDN 1080", "Home Theater", "550", "7")
    ,("Sony UBP-X800", "Home Theater", "350", "3")
    ,("Sony XZ2 Premium", "Mobile Phones", "999", "4")
    ,("Grand Seiko 'Snow Flake' SBGA211", "Watches", "5800", "1")
    ,("Grand Seiko SBGE211G", "Watches", "5400", "3")
    ,("Grand Seiko 'Peacock' SBGJ227", "Watches", "5000", "2")
    ,("Grand Seiko GMT SBGJ231", "Watches", "7400", "0")
    ,("IWC Portugieser IW371445", "Watches", "7300", "3");
