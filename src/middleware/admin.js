
const verifyAdmin = (req, res, next) => {
    if (!req.session || !req.session.adminId) {
        req.flash("error", "You need to login to view that page");
        return res.redirect("/admin/login")
    }
    next();
}

module.exports = verifyAdmin;