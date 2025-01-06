const fs = require("fs");

const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
    static addProduct(id) {
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent => {
            if
        })
        //analyze the cart => Find if their are any existing products in it
        //Add new Product/ increase Quantity
    }


}