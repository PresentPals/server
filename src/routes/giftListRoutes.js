const express = require("express");
const { createGiftList, getGiftList, updateGiftList, deleteGiftList, getAllEvents, getGiftItem, updatePurchased, createSharedUser, deleteGiftItem, upload  } = require("../controllers/giftListController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

//use the validateToken middleware on these routes
router.use(validateToken);

// POST localhost:5001/api/giftlist/event
router.post("/event", createGiftList)

// GET localhost:5001/api/giftlist/:id/:giftId
router.get("/:id/:giftId", getGiftItem);

// PATCH localhost:5001/api/giftlist/:id/:giftId
router.patch("/:id/:giftId", updatePurchased);

// DELETE localhost:5001/api/giftlist/:id/:giftId
router.delete("/:id/:giftId", deleteGiftItem);

// POST localhost:5001/api/giftlist/:id/add & allow single images to be uploaded
router.post("/:id/add", upload.single("image"), updateGiftList);

// POST localhost:5001/api/giftlist/:id
router.post("/:id", createSharedUser);

// GET localhost:5001/api/giftlist/:id
router.get("/:id", getGiftList);

// GET localhost:5001/api/giftlist/
router.get("/", getAllEvents);

// DELETE localhost:5001/api/giftlist/:id
router.delete("/:id", deleteGiftList);

module.exports = router;
