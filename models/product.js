const fs = require('fs');
const path = require('path');
const db=require('../util/database');
let products = [];

//for adding product....
async function save(product) {
  //we updated the array with product
  products.push(product);
  const p = path.join(__dirname, '../', 'data', 'products.json');
  // console.log("file path:", p);

  // Check if the file exists before reading it
  if (fs.existsSync(p)) {
    try {
      //we read existing data in the file ...
      const fileContent = fs.readFileSync(p);
      //after parsing the data....
      let parsedData = JSON.parse(fileContent);
      //  console.log("parsed data from file: ", parsedData);
      if (parsedData) {
        //we fed that existing fikle data to our array 
        products.push(...parsedData);
      }
      //console.log("products are here:", products);
    } catch (jsonError) {
      // console.log('Error parsing JSON:', jsonError);
    }
  }

  //now as we are ready with the product array which contains existing as well as new data
  // Write the updated JSON data back to the file.
  try {
    fs.writeFileSync(p, JSON.stringify(products));
  } catch (writeErr) {
    // console.log('Error writing the file:', writeErr);
  }
}


// for fetching all products.
async function fetchAll() {
  const products =await db.execute('SELECT * from products');
  console.log("products in fetch all from database:",products[0]);
  // console.log("products in fetchAll: ", products[0]);
  return products[0];
}

//for updating the product by editing....
async function editProduct({ product }) {
  const p = path.join(__dirname, '../', 'data', 'products.json');
  console.log("product for editing :", product);
  // Fetch existing products
  const products = await fetchAll();
  // Find the index of the product with the same ID as the received product
  const index = products.findIndex(existingProduct => existingProduct && existingProduct.productId === product.productId);
  console.log("index found : ", index);
  // If the product with the same ID is found, replace it with the new product data
  if (index !== -1) {
    products[index] = product;
    // Now, read the file and update the products array with the file data
    if (fs.existsSync(p)) {
      try {
        // Read existing data from the file
        const fileContent = fs.readFileSync(p);

        // Parse the data from the file
        let parsedData = JSON.parse(fileContent);

        if (parsedData) {
          // Add the existing file data to the products array
          products.push(...parsedData);
        }

        // Log the updated products array with the new product data
        console.log('Updated array data:', products);
      } catch (jsonError) {
        console.log('Error parsing JSON:', jsonError);
      }
    }
    try {
      fs.writeFileSync(p, JSON.stringify(products));
      return true;
    } catch (writeErr) {
      return false;
    }
  }
  else {
    return false;
  }
}

//fetching a product by id..
async function findById(id) {
  const p = path.join(__dirname, '../', 'data', 'products.json');
  const products = await fetchAll();
  const foundElement = products.filter(item => item && item?.productId === id);
  console.log("found element  : ", typeof id, foundElement);
  // console.log("products are: ", id, products.find(p => p?.productId === id));
  // return (products?.find((p) => p?.id === id));\
  // const product = {
  //   title: 'Nesciunt sed provid',
  //   imageUrl: 'Nulla error consequa',
  //   description: 'Perferendis aut tene',
  //   price: '462',
  //   productId: 9.24274497854152
  // }
  return foundElement.slice(0, 1)?.[0];
}

//delete product by id...
async function deleteById(id) {
  const p = path.join(__dirname, '../', 'data', 'products.json');
  const cart = path.join(__dirname, '../', 'data', 'cart.json');
  const product = await findById(id);
  console.log("single ...", product);
  let price = product?.price;
  // console.log("products array udpated  is : ", newUpdatedArray);
  if (fs.existsSync(p)) {
    try {
      // Read existing data from the file
      const fileContent = fs.readFileSync(p, 'utf-8');
      // Parse the data from the file
      let parsedData = JSON.parse(fileContent);
      const newUpdatedArray = parsedData.filter(product => product?.productId !== id);
      fs.writeFileSync(p, JSON.stringify(newUpdatedArray, null, 2));
      deleteFromCart({ id, price });
      return true;
    } catch (jsonError) {
      console.log('Error parsing JSON:', jsonError);
      return false;
    }
  }
  try {
    fs.writeFileSync(p, JSON.stringify(newUpdatedArray));
    return true;
  } catch (writeErr) {
    return false;
  }
}
async function deleteFromCart(props) {
  console.log("delete from cart has :", props);
  const cart = path.join(__dirname, '../', 'data', 'cart.json');
  if (fs.existsSync(cart)) {
    const data = fs.readFileSync(cart, 'utf-8');
    const parseData = JSON.parse(data);
    // console.log("parsed data from cart is :", parseData);
  }
}
module.exports = {
  save,
  fetchAll,
  findById,
  editProduct,
  deleteById
};


