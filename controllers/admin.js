const Product = require("../models/product.js");
const db = require("../util/database");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = "https://picsum.photos/200/300";
  const price = req.body.price;
  const description = req.body.description;
  // const id = (Math.random() * 10).toString();
  req.user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    })
    .then((response) => {
      console.log("Product Added.", response);
    })
    .catch((error) => {
      console.log("Error is : ", error, payload);
    });
  res.redirect("/");
};

exports.postEditProduct = async (req, res, next) => {
  const Updatedproduct = req.body;
  Product.findByPk(Updatedproduct?.id)
    .then((product) => {
      if (product.userId === req.user.id) {
        // Update the existing product with the new data
        product.title = Updatedproduct.title;
        product.imageUrl = Updatedproduct.imageUrl;
        product.price = Updatedproduct.price;
        product.description = Updatedproduct.description;
        return product.save();
      } else {
        res.status(400).send("You are not allowed to edit this");
      }
    })
    .then(() => {
      console.log("Updated Product !");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log("Error editing we have : ", error);
    });

  // const response = await Product.editProduct({ product: product });
  // if (response) {
  //   res.redirect("/products");
  // } else {
  //   res.status(400).send(product);
  // }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.id;
  const product = await Product.findByPk(prodId);
  console.log(
    "individual product is 000000000000000000000000000000000000000000000000000000000000000000: ",
    product
  );

  if (req.user.id !== product?.userId) {
    return res.status(403).render("error", {
      pageTitle: "Unauthorized",
      path: "/error",
      errorMessage: "You are not authorized to edit this product.",
    });
  }
  if (req.user.id === product?.userId) {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    // Assuming you have the user available in req.user
    const user = req.user;
    if (!user) {
      return res.redirect("/");
    }
    // Use the association method to get the products associated with the user
    const products = await user.getProducts();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log("Error in getProducts:", error);
    res.status(500).render("error", {
      pageTitle: "Internal Server Error",
      path: "/error",
      errorMessage: "An error occurred while fetching products.",
    });
  }
};

exports.deleteEditProduct = async (req, res, next) => {
  // res.status(200).send("Product Deleted with id : ",req.params);
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      // res.status(200).send("Successfully deleted");
      res.status(400).json({ error: "Product Not Found" });
    } else {
      // res.status(400).send("Can not delete this product...");
      await product.destroy();
      res.redirect("/products");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
