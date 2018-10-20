DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL
    ,product_name VARCHAR(50) NOT NULL
    ,department_name VARCHAR(50) NOT NULL
    ,price INT(10) NOT NULL
    ,stock_quantity INT(10) NOT NULL
    ,product_sales INT NOT NULL DEFAULT 0
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

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT NOT NULL
    ,department_name VARCHAR(50) NOT NULL
    ,over_head_costs INT NOT NULL DEFAULT 1000
    ,PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES 
   ("Games", 1000)
   ,("Home Theater", 10000)
   ,("Mobile Phones", 1000)
   ,("Watches", 5000);

CREATE TABLE supervisor AS (
    SELECT 
       T0.department_id
       ,T0.department_name
       ,T0.over_head_costs
       ,T1.product_sales
       ,SUM(T1.product_sales - T0.over_head_costs) as total_profilts 
       
       FROM departments T0 
       LEFT OUTER JOIN products T1 ON T0.department_name = T1.department_name
);

CREATE TABLE total_sales AS (
   SELECT
    department_name
    ,SUM(product_sales) as product_sales
    
    FROM products
    GROUP BY department_name
);

CREATE TABLE supervisor AS (
    SELECT 
       T0.department_id
       ,T0.department_name
       ,T0.over_head_costs
       ,IFNULL(T1.product_sales, 0) as product_sales
       ,SUM(IFNULL(T1.product_sales, 0) - T0.over_head_costs) as total_profilts 

       FROM departments T0 
       LEFT OUTER JOIN total_sales T1 ON T0.department_name = T1.department_name
       GROUP BY T0.department_name
       ORDER BY T0.department_id
);