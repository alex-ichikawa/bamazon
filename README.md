# bamazon

bamazon is a node program that lets you shop, manage, and supervise a store.

See screen shots for examples

# Shop

To begin shoping type 'node bamazonCustomer.js'. This will bring up a list of items available for sale and their price.

Select the item you wish to purchase by typing the number of the item you want.
    *The only inputs accepted are numbers included in the list
Next enter the number you desire to purchase
    *The only inputs accepted are positive numbers
    *If you want to purchase more than the current stock you will get an error message
    *If your purchase is allowed you will receive your order total


 # Manage

 To enter the manager view type 'node bamazonManager.js'. This is will bring up your options as a manager

View Products for sale - Shows all products for sale including their price and qty
View Low Inventory - Shows all products with a quantity of less than 5
Add to Inventory - Lets you add to the quantity of an item
Add New Product - Lets you create a new product for sale. 
    *If the department for the new product does NOT exist you will need to have a supervisor log in and create the department before you can add the new product

# Supervise

To enter the supervisor view type 'node bamazonSupervisor.js'. This will bring up the supervisor options

View Product Sales by Department - Displays a table with headers that shows department id, name, overhead costs, product sales, and total profits
Create New Department - Creates a new department, required is the name and overhead cost, the id is automatically incremented



