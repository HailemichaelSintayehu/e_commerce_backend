
const express = require("express");

const { UserRefreshClient } = require("google-auth-library");

const router = express.Router();

const useCtrl = require('../Controllers/Authcontrollers.js')

const auth = require("../Middlewares/auth")

const authAdmin = require("../Middlewares/authAdmin")

router.post("/register",useCtrl.register)

// router.post("/activation",useCtrl.activateEmail)

router.post("/login",useCtrl.login)

router.get("/logout",useCtrl.logout)

router.get("/refresh_token",useCtrl.refreshToken)

router.get("/infor" ,auth,useCtrl.getUser)

router.patch("/addcart",auth,useCtrl.addCart)

router.post("/forgotpassword",useCtrl.forgotPassword)

router.post("/reset",auth,useCtrl.resetPassword)

router.get("/history",auth,useCtrl.history)

router.get("/all_info",auth,authAdmin,useCtrl.getUsersAllInfo)

router.patch("/update",auth,authAdmin,useCtrl.updateUser)

router.delete("/delete",auth,authAdmin,useCtrl.deleteUser)

module.exports = router;
 