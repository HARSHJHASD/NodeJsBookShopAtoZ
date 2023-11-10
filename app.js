const path = require("path");
const express = require("express");
const User = require("./models/user");
const Product = require("./models/product");
const Cart = require("./models/cart");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const app = express();
const sequalise = require("./util/database");
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const CartItem = require("./models/cart-item");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
      console.log("our request is : ", req.user?.dataValues);
    })
    .catch((error) => {
      console.log("Error in middleware User not found", error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// Define the association with onDelete: 'CASCADE'
//we are telling db that ondelete cascade should be true....interrelated
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// this is for making sure that the modal is going to create a table in DB if it doesnt exists and will not overwrite existing table if it doesn exist
sequalise
  //force as true for forcing the database(Overriding) again incase of any new relarion etc is created  just like we have done above..this will drop everything....
  .sync({ force: true })
  .then((result) => {
    console.log(result);
    return User.findByPk(1);
    // app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "max", email: "Harshjha19101997@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    console.log("UserExists:", user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
// app.listen(3000);
