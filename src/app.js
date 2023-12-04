const express = require("express");
const app = express();
const products = require("./products.json");
const mongoose = require("mongoose");
const Product = require("./models/product.model");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

dotenv.config();
mongoose.connect(process.env.DB_STRING)
.then(() => {
    console.log("Database connected succesfully!");
})
.catch((err) => {
    console.log("Error connecting to DB:", err.message);
});

app.use(session({
    secret: "Geegstack101",
    resave: true,
    saveUninitialized: false
}));

app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.admin = req.session.adminId;
    next();
})

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const {homePage, productsPage, createProductPage, productDetailsPage, editProductPage, createProduct, updateProduct, deleteProduct} = require("./controllers/product.controller");

const {signupPage, loginPage, createAccount, login, logout, profilePage}  = require("./controllers/admin.controller");

const verifyAdmin = require("./middleware/admin");

app.get("/", homePage);
app.get("/products", productsPage);
app.get("/products/new", verifyAdmin, createProductPage);
app.get("/products/:productId", productDetailsPage);
app.get("/products/:productId/edit", verifyAdmin, editProductPage);
app.post("/products", verifyAdmin, createProduct);
app.put("/products/:id", verifyAdmin, updateProduct);
app.delete("/products/:id", verifyAdmin, deleteProduct);

app.get("/admin/signup", signupPage)
app.get("/admin/login", loginPage)
app.post("/admin/signup", createAccount)
app.post("/admin/login", login)
app.post("/admin/logout", logout)
app.get("/admin/profile", verifyAdmin, profilePage)

app.listen(4000, () => {
    console.log("App is now running!");
});