const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => {
      console.log("Error in DB:", error);
    });
  console.log("for rendering : ".products);
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.id;
  res.status(200).send("To be deleted : ", prodId);
  const product = await Product.findById(prodId);
  console.log("for deleting product cart items : ", product, prodId);

  // product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // };
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.id;
  const [rows, fieldData] = await Product.findById(prodId);
  console.log("PRODUCT PRODUCT :", rows[0]);
  res.render("shop/product-detail", {
    product: rows[0],
    pageTitle: rows?.title,
    path: "/products",
  });
  // .then((rows) => {
  //   console.log("get product fetch is  : ", rows);
  // })
  // .catch((error) => {
  //   console.log("error in get product :", error);
  // });
  // console.log("single product found is  :", product);
};

exports.getIndex = async (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => {
      console.log("Error :", error);
    });
};

exports.getCart = async (req, res, next) => {
  // res.status(200).send("Cart Fetched....");
  let products = await Product.findAll();
  let cartProducts = await Cart.fetchAll();
  console.log(
    "products array :",
    products.filter((pro) => pro)
  );
  console.log("cartProducts are : ", cartProducts?.products);
  let finalCartTorender = [];
  for (const product of products) {
    // const id = product?.id;
    const finalCart = cartProducts?.products?.find(
      (pro) => pro?.id === product?.id
    );
    if (finalCart) {
      finalCartTorender.push({ productData: product, qty: finalCart.qty });
      // console.log("final cart for product with id", finalCartTorender);
    }
  }
  // console.log("content in cart is : ", cartProducts);
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: finalCartTorender,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.id;
  // console.log("to add to cartt:", req.body);
  const product = await Product.findById(prodId);
  console.log("fetched product for cart :", product);
  if (product) {
    Cart.addProduct({ id: prodId, price: product?.price });
    res.redirect("/cart");
  } else {
    res.redirect("/cart");
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
