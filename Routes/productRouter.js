
const router= require("express").Router()
const productCtrl = require("../Controllers/productController");
const authAdmin = require("../Middlewares/authAdmin");
const auth = require("../Middlewares/auth");

router.route("/products")
  .get(auth,authAdmin,productCtrl.getProducts)
  .post(auth,authAdmin,productCtrl.createProducts)

router.route("/products/:id")
   .delete(auth,authAdmin,productCtrl.deleteProducts)
   .put(auth,authAdmin,productCtrl.updateProducts)


module.exports = router;

