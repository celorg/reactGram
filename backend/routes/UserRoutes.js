const express = require("express");
const router = express.Router();

//Controller
const {
    register,
    login, 
    getCurrentUser,
    update,
    getUserById,
    getAllUser
} = require("../controllers/UserController");

//middlewares
const validate = require("../middlewares/handleValidation");
const {userCreateValidation, loginValidation ,userUpdateValidation} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGurad");
const {imageUpload} = require("../middlewares/imageUpload");

//Routes
router.post("/register", userCreateValidation() ,validate, register);

router.post("/login", loginValidation(), validate, login);

router.get("/profile", authGuard, getCurrentUser);

router.patch("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update);

router.get("/", getAllUser);
router.get("/:id", getUserById);


module.exports = router;