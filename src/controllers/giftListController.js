const { GiftList } = require("../models/GiftListModel");

async function createGiftList(request, response) {
  try {
    const giftlist = await GiftList.create(request.body); // Create the entire body

    response.status(201).json({
      message: "The gift list details created successfully",
      giftlist: giftlist,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function getGiftList(request, response) {
  try {
    const { giftListTitle } = request.body; // Gift list title from the body

    const giftlist = await GiftList.FindOne({
      where: { giftListTitle },
    }); // Find the title of the gift list in the collection.

    if (!giftlist) {
      return response
        .status(404)
        .json({ message: "That gift list title does not exist." });
    }

    response.status(200).json({
      message: "The gift list details have been found.",
      giftlist: giftlist,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function updateGiftList(request, response) {
  try {
    // Extract the updated gifts and other fields from the request body.
    const {
      giftListTitle,
      updatedGifts,
      giftListImage,
      childUser,
      dateExpired,
    } = request.body;

    const giftlist = await GiftList.findOne({
      where: { giftListTitle }, // Find the title of the gift list in the collection
    });

    if (!giftlist) {
      return response
        .status(404)
        .json({ message: "That gift list title does not exist." });
    }

    // Get the current childGiftList from the collection (as it might contain existing gift items)
    let childGiftList = giftlist.childGiftList;

    // Update specific items in the childGiftList array
    updatedGifts.forEach((updatedGift) => {
      const giftIndex = childGiftList.findIndex(
        (gift) => gift._id === updatedGift._id
      );
      if (giftIndex !== -1) {
        // If the gift with the given _id is found, update the gift details
        childGiftList[giftIndex] = {
          ...childGiftList[giftIndex],
          ...updatedGift,
        };
      }
    });

    // Update the giftlist with the new childGiftList and other fields
    await giftlist.update({
      giftListTitle,
      giftListImage,
      childUser,
      childGiftList, // The updated list of gifts
      dateExpired,
    });

    // Repond the updated gift list
    response.status(200).json({
      message: "Gift list updated successfully.",
      giftlist,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function deleteGiftList(request, response) {
  try {
    const { giftListTitle } = request.body; // Gift list title from the body

    const deleteGiftList = await GiftList.destroy({
      where: { giftListTitle },
    }); // Delete the gift list from the gift list collection.

    // If nothing was deleted, return a response
    if (deleteGiftList === 0) {
      return response
        .status(404)
        .json({ message: "That gift list title does not exist." });
    }
    // The response when deleted
    response.status(200).json({
      message: "The gift list details have been deleted.",
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

module.exports = {
  createGiftList,
  getGiftList,
  updateGiftList,
  deleteGiftList
};

