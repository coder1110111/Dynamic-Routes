const fs = require('fs');
const path = require('path');

const cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {    //will be called both for adding product and updating product
  constructor(id, title, imageUrl, description, price) {
    this.id = id; //will be null for new product and will hold some value for updated product
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {   //writeFile always rewrite upon the old content
          console.log(err);
        });  
      } else  {
        this.id = Math.random().toString();  //Will assign a random number, high chance to be unique for small examples
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id)  {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);  //In here we create a new array which contains all the product except for whre prod.id===id.
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if(!err) {
          cart.deleteProduct(id, product.price);
        }
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {   //here id is the product id we are trying to find, whereas 'cb' is a callback function
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);    //find is a default function which is used to search through an array for a particular thing
      cb(product);
    })
  }

};
