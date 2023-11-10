const path = require("path");
const express = require("express");
const User = require("./models/user");
const Product = require("./models/product");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const app = express();
const sequalise = require("./util/database");
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// Define the association with onDelete: 'CASCADE'
//we are telling db that ondelete cascade should be true....interrelated
User.hasMany(Product, { onDelete: "CASCADE" });
Product.belongsTo(User);
// this is for making sure that the modal is going to create a table in DB if it doesnt exists and will not overwrite existing table if it doesn exist
sequalise
  //force as true for forcing the database(Overriding) again incase of any new relarion etc is created  just like we have done above..this will drop everything....
  .sync({ force: true })
  .then((result) => {
    console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
// app.listen(3000);
