const Admin = require("../models/admin.model");
const Product = require("../models/product.model");
const bcrypt = require("bcrypt");

const signupPage = (req, res) => {
    res.render("admin_signup.ejs", {form: req.flash("formData")});
}

const loginPage = (req, res) => {
    res.render("admin_login.ejs", {form: req.flash("formData")});
}

const createAccount = (req, res) => {
    const adminData = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }

    Admin.create(adminData)
    .then(() =>{
        res.redirect("/admin/login");
    })
    .catch((error) => {
        req.flash("error", error._message);
        req.flash("formData", req.body);
        res.redirect("/admin/signup");
    })
}

const login = (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        req.flash("error", "Email and Password are required.");
        req.flash("formData", req.body);
        return res.redirect("/admin/login");
    }

    Admin.findOne({email})
    .then(admin => {
        if (!admin) {
            req.flash("error", "Account with given email not found.");
            req.flash("formData", req.body);
            return res.redirect("/admin/login");
        } else if (!bcrypt.compareSync(password, admin.password)) {
            req.flash("error", "Given password is not correct.");
            req.flash("formData", req.body);
            return res.redirect("/admin/login");
        }
        req.session.adminId = admin._id;
        res.redirect("/admin/profile");
    })
    .catch(err => {
        req.flash("error", err._message);
        req.flash("formData", req.body);
        res.redirect("/admin/login");
        return;
    })

}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    })
}

const profilePage = (req, res) => {
    Admin.findById(req.session.adminId)
    .then(admin => {
        Product.find({admin: req.session.adminId})
        .populate("admin")
        .then(products => {
            console.log(products);
            res.render("admin_profile", { profile: admin, products });
        })
        .catch((err) => {
            res.redirect("/");
        })
    })
    .catch(err => {
        res.redirect("/");
    })
}

module.exports = {
    signupPage,
    loginPage,
    createAccount,
    login,
    logout,
    profilePage
}