
const Product = require("../models/product.model");

const homePage = (req, res) => {
    res.render("index");
}

const productsPage = (req, res) => {
    Product.find()
    .then((products) => {
        res.render("products", {products});
    })
    .catch((error) => {
        res.redirect("/");
    })
}

const createProductPage = (req, res) => {
    res.render("create_product", {error: req.flash("errorMsg"), form: req.flash("form")});
}

const productDetailsPage = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then((product) => {
        res.render("single_product", {product});
    })
    .catch(error => {
        console.log(error);
        res.redirect("/");
    })
}

const editProductPage = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then((product) => {
        res.render("edit_product", {product, error: req.flash("error")});
    })
    .catch(error => {
        res.redirect("/");
    })
}

const createProduct = (req, res) => {
    //capture form data
    const data = {
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.body.image,
        category: req.body.category,
        description: req.body.description,
        admin: req.session.adminId
    }
    //Insert Data to Database
    Product.create(data)
    .then((product) => {
        //Redirect to product view
        res.redirect("/products/" + product._id);
    })
    .catch((error) => {
        req.flash("errorMsg", error._message);
        req.flash("form", req.body);
        res.redirect("/products/new");
    })
}

const updateProduct = (req, res) => {
    const productId = req.params.id;
    const data = {
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.body.image,
        category: req.body.category,
        description: req.body.description
    }
    Product.updateOne({_id: productId}, data)
    .then(() => {
        res.redirect("/products/" + productId);
    })
    .catch((error) => {
        req.flash("error", error._message);
        res.redirect(`/products/${productId}/edit`);
    })
}

const deleteProduct = (req, res) => {
    const productId = req.params.id;
    Product.findByIdAndDelete(productId)
    .then(() => {
        res.redirect("/products");
    })
    .catch((error) => {
        req.flash("error", error._message);
        res.redirect("/products");
    })
}

module.exports = {
    homePage,
    productsPage,
    createProductPage,
    productDetailsPage,
    editProductPage,
    createProduct,
    updateProduct,
    deleteProduct
}