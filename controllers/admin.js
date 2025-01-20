const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({      //This is the more elegant way. for more detail: Association sequelize MDN
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
  /*Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    //userId: req.user.id   //can add userid like this as well. But above is the more elegant way
  })*/  .then(result => {
    console.log('Product Created!');
    res.redirect('/admin/products');
  })
    .catch(err => {
        console.log(err)
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where: {id: prodId}})
  //Product.findByPk(prodId)
  .then(products => {
    const product = products[0];
    if(!product)  {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err => console.log(err));
  /*Product.findById(prodId, product => {
    if(!product)  {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });*/
};

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.imageUrl = updatedUrl;
    product.price = updatedPrice;
    product.description = updatedDesc;    //Till this point product will only be locally updated

    return product.save()    //method of sequelize to save locally updated product on sql
  })
  .then()   //this is for save()
  .catch(err => console.log(err));  // this catches errors of both nested promises
  
  /*const updatedProduct = new Product(
    prodId, 
    updatedTitle, 
    updatedUrl, 
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();*/
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
  
  
  /*Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/products', {
        prods: rows,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));*/
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("Product Deleted");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}
