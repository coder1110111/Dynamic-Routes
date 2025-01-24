const Product = require('../models/product');
/* const Cart = require('../models/cart');
const Order = require('../models/order'); */  //Dont need both imports as they are connected to user
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
  req.user      //console.log(req.user.cart) will return undefined as cart is not sent as a property
  .getCart()
    .then(cart => {
      //console.log(cart);    //Test to see if we get any output
      return cart.getProducts();
    })
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err))
  
  /* Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if(cartProductData) {
          cartProducts.push( { productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  }); */
};

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
      .then(cart => {
        fetchedCart = cart; //so that cart becomes available to the whole function
        return cart.getProducts( { where: { id: prodId } } );
      })
      .then(products => {   //will return an array that may have 1 or 0 elements
        let product;
        if(products.length > 0) {
          product = products[0];
        }
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId)       
      })
      .then(product => {
        return fetchedCart.addProduct( product, { 
        through: { quantity: newQuantity } })
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .getCart()
    .then(cart => {
      return cart.getProducts( { where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req,res,next) => {
  let fetchedCart;
  req.user
  .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
      .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }))
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
};

