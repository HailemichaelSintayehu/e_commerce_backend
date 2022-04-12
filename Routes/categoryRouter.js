const express = require("express")
const router = express.Router()

const categoryCtrl = require("../Controllers/categoryController");
const authAdmin = require("../Middlewares/authAdmin");
const auth = require("../Middlewares/auth")

router.route('/category')
     .get(categoryCtrl.getCategories)

     .post(auth,authAdmin,categoryCtrl.createCategory)
     
router.route("/category/:id")
    .delete(auth,authAdmin,categoryCtrl.deleteCategory)

router.route("/category/:id")
    .put(auth,authAdmin,categoryCtrl.updateCategory)

module.exports = router;
