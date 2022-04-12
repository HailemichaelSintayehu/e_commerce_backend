
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

router.get("/infor",auth,useCtrl.getUser)

router.post("/forgotpassword",useCtrl.forgotPassword)

router.post("/reset",auth,useCtrl.resetPassword)


router.get("/all_info",auth,authAdmin,useCtrl.getUsersAllInfo)

router.patch("/update",auth,useCtrl.updateUser)

router.delete("/delete",auth,useCtrl.deleteUser)

module.exports = router;
 