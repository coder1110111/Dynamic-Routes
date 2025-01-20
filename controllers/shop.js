const Product = require('../models/product');
const Cart = require('../models/cart');
const { Where } = require('sequelize/lib/utils');
const { where } = require('sequelize');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err);
  });

};

exports.getProduct = (req,res,next) =>{
  const prodId = req.params.productID;
 //Product.findAll({where: {id: prodId}}).then().catch();  //This will work the same as below, just that it returns an array, instead of object
  Product.findByPk(prodId)
  .then(product => {
    res.render('shop/product-detail',{
      product: product,     // Here only a single object is returned 
      pageTitle: product.title, 
      path: '/products'
    });
  }).catch(err => console.log(err));
  
  /*Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail',{
        product: product[0], 
        pageTitle: product.title,     /* product.title */
  /*      path: '/products'
      });
    })
    .catch(err => console.log(err)); */ //The above code is for without sequelize
    //First product is the argument name, Second 'product' is the product object we receive in line 15.
}

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err);
  });
};



exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) =>{
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
