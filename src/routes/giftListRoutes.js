const express = require("express");
const { getGiftList, updateGiftList, deleteGiftList  } = require("../controllers/giftListController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//use the validateToken middleware on these routes
router.use(validateToken);

// GET localhost:3000/api/giftlist/:id
router.get("/giftlist/:id", getGiftList);

// UPDATE localhost:3000/api/giftlist/update/:id
router.patch("/giftlist/update/:id", updateGiftList);

// DELETE localhost:3000/api/giftlist/delete/:id
router.patch("/giftlist/delete/:id", deleteGiftList);

module.exports = router;