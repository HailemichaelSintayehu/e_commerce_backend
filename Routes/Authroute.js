
const express = require("express");
const { UserRefreshClient } = require("google-auth-library");

const router = express.Router();

const useCtrl = require('../Controllers/Authcontrollers.js')

const auth = require("../Middlewares/auth")

router.post("/register",useCtrl.register)

router.post("/activation",useCtrl.activateEmail)

router.post("/login",useCtrl.login)

router.post("/refresh_token",useCtrl.getAccessToken)

router.post("/forgotpassword",useCtrl.forgotPassword)

router.post("/reset",auth,useCtrl.resetPassword)

router.get("/infor",auth,useCtrl.getUserInfo)

module.exports = router;