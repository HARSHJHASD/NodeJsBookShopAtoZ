const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  console.log("for rendering : ".products);
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Products',
    path: '/products'
  });
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  res.status(200).send("To be deleted : ", prodId);
  const product = await Product.findById(prodId);
  console.log("for deleting product cart items : ", product, prodId);

  // product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // };
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  // res.status(200).send(prodId);
  const product = await Product.findById(prodId);
  console.log("single product found is  :", product);
  res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products'
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  });
};

exports.getCart = async (req, res, next) => {
  // res.status(200).send("Cart Fetched....");
  let products = await Product.fetchAll();
  let cartProducts = await Cart.fetchAll();
  console.log("products array :", products.filter(pro => pro));
  console.log("cartProducts are : ", cartProducts?.products);
  let finalCartTorender = [];
  for (const product of products) {
    // const productId = product?.productId;
    const finalCart = cartProducts?.products?.find(pro => pro?.id === product?.productId);
    if (finalCart) {
      finalCartTorender.push({ productData: product, qty: finalCart.qty });
      // console.log("final cart for product with productId", finalCartTorender);
    }
  }
  // console.log("content in cart is : ", cartProducts);
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: finalCartTorender
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  // console.log("to add to cartt:", req.body);
  const product = await Product.findById(prodId);
  console.log("fetched product for cart :", product);
  if (product) {
    Cart.addProduct({ id: prodId, price: product?.price });
    res.redirect('/cart');
  }
  else {
    res.redirect('/cart');
  }
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
