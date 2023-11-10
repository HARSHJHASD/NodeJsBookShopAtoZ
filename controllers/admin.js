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
  const id = (Math.random() * 10).toString();
  const payload = {
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
  };
  console.log("Product to add : ", payload);
  Product.create(payload)
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
      // Update the existing product with the new data
      product.title = Updatedproduct.title;
      product.imageUrl = Updatedproduct.imageUrl;
      product.price = Updatedproduct.price;
      product.description = Updatedproduct.description;
      return product.save();
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
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
    product: product,
  });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        prods: rows,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => {
      console.log("error in getProducts ..", error);
    });
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
