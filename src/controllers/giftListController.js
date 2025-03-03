const { GiftList } = require("../models/GiftListModel");


async function createGiftList(request, response) {
  try {

    const { giftListTitle, accountEmail,  giftListImage, childUser, childGiftList, userCreated, privateList,  dateEvent } = request.body;

    // Check if a gift list with the same title already exists
    const existingGiftList = await GiftList.findOne({
      where: { giftListTitle }
    });

    if (existingGiftList) {
      return response
        .status(400)
        .json({ message: "A gift list with this title already exists. Please re enter a new title." });
    }

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
      where: { giftListTitle }
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

  const { giftListTitle, accountEmail,  giftListImage, childUser, childGiftList, userCreated, privateList,  dateEvent } = request.body;
try {
    // Check if the gift list already exists for the user (based on childUser or other identifiers)
    const existingGiftList = await GiftList.findOne({
      where: { giftListTitle }
    });

    if (existingGiftList) {
        // Update the existing gift list (if any)
        existingGiftList.giftListTitle = giftListTitle;
        existingGiftList.accountEmail = accountEmail;
        existingGiftList.giftListImage = giftListImage;
        existingGiftList.childUser = childUser;
        existingGiftList.userCreated = userCreated;
        existingGiftList.privateList = privateList;
        existingGiftList.giftListTitle = giftListTitle;
        existingGiftList.dateEvent= dateEvent;

        // Update the gifts (replace the old ones with the new ones from childGiftList)
        existingGiftList.childGiftList = childGiftList;

        // Save the updated gift list
        await existingGiftList.save();

        response.status(200).json({
            message: "Gift list updated successfully",
            giftList: existingGiftList
        });
    } else {
        return response
          .status(404)
          .json({ message: "That gift list title does not exist." });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({
        message: "Error saving the gift list. Please try again.",
        error: error.message
    });
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

