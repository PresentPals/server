const express = require("express");
const { createUser, getAllUsers, getUser, updateUser, deleteUser  } = require("../controllers/userController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//use the validateToken middleware on these routes
router.use(validateToken);

// GET localhost:5173/api/user/
router.get("/", getAllUsers);

// GET localhost:3000/api/user/add
router.post("/add", createUser);

// GET localhost:3000/api/user/:id
router.get("/:id", getUser);

// UPDATE localhost:3000/api/user/update/:id
router.patch("/:id", updateUser);

// DELETE localhost:3000/api/user/delete/:id
router.delete("/:id", deleteUser);

module.exports = router;