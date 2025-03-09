const express = require("express");
const { createGiftList, getGiftList, updateGiftList, deleteGiftList, getAllEvents, getGiftItem, updatePurchased  } = require("../controllers/giftListController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//use the validateToken middleware on these routes
router.use(validateToken);

// POST localhost:5001/api/giftlist/
router.post("/event", createGiftList)

// GET localhost:5001/api/giftlist/item/:id
router.get("/:id/:giftId", getGiftItem);

// GET localhost:5001/api/giftlist/:id/item
router.patch("/:id/:giftId", updatePurchased);

// UPDATE localhost:5001/api/giftlist/:id/add
router.post("/:id/add", updateGiftList);

// GET localhost:5001/api/giftlist/:id
router.get("/:id", getGiftList);

// GET localhost:5001/api/giftlist/
router.get("/", getAllEvents);

// DELETE localhost:5001/api/giftlist/delete/:id
router.delete("/giftlist/delete/:id", deleteGiftList);

module.exports = router;
