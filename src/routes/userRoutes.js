// Import express and user controllers

const express = require("express");
const { createUser, getUser, updateUser, deleteUser  } = require("../controllers/userController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//use the validateToken middleware on these routes
router.use(validateToken);

// POST localhost:3000/api/user/
router.post("/", createUser);

// GET localhost:3000/api/user/:id
router.get("/:id", getUser);

// UPDATE localhost:3000/api/user/update/:id
router.patch("/update/:id", updateUser);

// DELETE localhost:3000/api/user/delete/:id
router.delete("/delete/:id", deleteUser);

module.exports = router;