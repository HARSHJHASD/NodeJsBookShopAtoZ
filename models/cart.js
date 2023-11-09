const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

function addProduct(props) {
  console.log("data recieved to add to cart : ", props?.id, props?.price);
  // let cart = { products: [], totalPrice: 0 };
  // Fetch the previous cart
  if (fs.existsSync(p)) {
    let cart = { products: [], totalPrice: 0 };
    const fileContent = fs.readFileSync(p, 'utf-8');
    console.log("fileContentfileContent", fileContent);
    if (fileContent) {
      try {
        cart = JSON.parse(fileContent);
        console.log("cart is  : ", cart);
        const existingProductIndex = cart?.products?.findIndex(
          prod => prod.id === props?.id
        );
        const existingProduct = cart?.products?.[existingProductIndex];
        console.log("existing product is :", existingProduct);
        let updatedProduct;
        // Add new product/ increase quantity
        if (existingProduct) {
          console.log("existing product is:", existingProduct);
          updatedProduct = { ...existingProduct };
          updatedProduct.qty = updatedProduct?.qty + 1;
          cart.products = [...cart?.products];
          cart.products[existingProductIndex] = updatedProduct;
          cart.totalPrice = cart?.totalPrice + +props?.price;
          fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
            res.redirect('/cart');
          });
        } else {
          updatedProduct = { id: props?.id, qty: 1 };
          console.log("Updated product is : ", updatedProduct);
          cart.products = [...cart?.products, updatedProduct];
          console.log("final cart is : ", cart);
          fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
            res.redirect('/cart');
          });
        }
      }
      catch (error) {
        console.error('Error parsing JSON:', error);
      }

    }
    // Analyze the cart => Find existing product
  }

};

function fetchAll() {
  if (fs.existsSync(p)) {
    try {
      const cartArrayContent = fs.readFileSync(p, 'utf-8');
      const cartArray = JSON.parse(cartArrayContent);
      console.log("cart array is:", cartArray);
      return cartArray;
    } catch (error) {
      console.log("Error in reading file:", error);
    }
  } else {
    console.log("File does not exist.");
    return []; // Return an empty array or an appropriate value for when the file doesn't exist.
  }
}


module.exports = {
  addProduct,
  fetchAll
};
