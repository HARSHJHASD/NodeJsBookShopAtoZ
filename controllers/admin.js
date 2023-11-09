const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = (Math.random() * 10).toString();
  Product.save({ title: title, imageUrl: imageUrl, description: description, price: price, productId: id });
  res.redirect('/');
};

exports.postEditProduct = async (req, res, next) => {
  const product = req.body;
  const response = await Product.editProduct({ product: product });
  if (response) {
    res.redirect('/products');
  } else {
    res.status(400).send(product);
  }
}

exports.getEditProduct = async (req, res, next) => {
  // console.log("individual product is 0000000000000000000000: ");
  // res.send("hellooooo");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  console.log("individual product is 000000000000000000000000000000000000000000000000000000000000000000: ", product);
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    // console.log("inside page of products : ",products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};


exports.deleteEditProduct = async (req, res, next) => {
  // res.status(200).send("Product Deleted with id : ",req.params);
  const id = req.params.productId;
  const response = await Product.deleteById(id);
  if (response) {
    // res.status(200).send("Successfully deleted");
    res.redirect('/products');
  }
  else {
    // res.status(400).send("Can not delete this product...");
    res.redirect('/products');
  }
}


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};

