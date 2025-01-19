const db = require('../util/database');

const cart = require('./cart');

module.exports = class Product {    //will be called both for adding product and updating product
  constructor(id, title, imageUrl, description, price) {
    this.id = id; //will be null for new product and will hold some value for updated product
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)', [this.title, this.imageUrl, this.description, this.price]);
  }

  static deleteById(id)  {
    return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {   //here id is the product id we are trying to find, whereas 'cb' is a callback function
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

};
