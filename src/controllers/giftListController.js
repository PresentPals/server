const { GiftList } = require("../models/GiftListModel");


async function createGiftList(request, response) {
  try {

    const { giftListTitle, accountEmail, listDescription, childUser, privateList,  dateEvent } = request.body;

    // Check if a gift list with the same title already exists
    const existingGiftList = await GiftList.findOne({ giftListTitle });

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

async function getAllEvents(request, response) {
  try {
    const  { accountEmail }  = request.authUserData;

    const events = await GiftList.find({ accountEmail });

    if (!events || events.length === 0) {
      return response.status(404).json({ message: "There were no gift list events found" });
    }

    response.status(200).json({
      message: "Gift lists have been found.",
      events: events
    });

  } catch (error) {
    console.error("Error in getAllUsers", error);
    response.status(500).json({ message: error.message });
  }
}

async function getGiftList(request, response) {
  try {

    const  { id }  = request.params;

    const giftlist = await GiftList.findOne({ _id: id }); 

    if (!giftlist) {
      return response
        .status(404)
        .json({ message: "That gift list does not exist." });
    }

    response.status(200).json({
      message: "The gift list details have been found.",
      giftlist: giftlist,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function getGiftItem(request, response) {
  try {

    const  { id }  = request.params;

    const nestedGift = await GiftList.FindOne({ "childGiftList._id": id }); 

    if (!nestedGift) {
      return response
        .status(404)
        .json({ message: "That gift item does not exist." });
    }

    // Extract the specific gift from childGiftList
    const giftItem = nestedGift.childGiftList.find(gift => gift._id.toString() === id);

    if (!giftItem) {
      return response.status(404).json({ message: "Gift not found." });
    }

    response.status(200).json({
      message: "The gift item details have been found.",
      giftItem: giftItem,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function updateGiftList(request, response) {
  try {
      const { id } = request.params;
      const { newGift } = request.body;
  
      const addGift = await GiftList.findByIdAndUpdate(id,
        { $push: { childGiftList: newGift } }, // Adds newGift to the array
        { new: true, runValidators: true } // Returns updated document & validates schema
      );

      if (!addGift) {
        return response.status(404).json({ message: "Gift list not found." });
      }
  
      response.status(200).json({
        message: "The gift details have been added.",
        addGift: addGift,
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
}

async function updatePurchased(request, response) {
  try {
    const { userName } = request.authUserData;

    const { id }  = request.params;
    
    const { data } = request.body;

    const nestedGift = await GiftList.FindOne({ "childGiftList._id": id }); 

    if (nestedGift.purchased === true) {
      return response
        .status(404)
        .json({ message: "That gift has already been purchased by somebody else." });
    }
  
      const updatedPurchased = await GiftList.findByIdAndUpdate(
        {"childGiftList._id": id},
        { $push: { childGiftList: data } }, // Adds newGift to the array
        { new: true, runValidators: true } // Returns updated document & validates schema
      );
  
      response.status(200).json({
        message: "The gift purchased details have been added.",
        updatedPurchased: updatedPurchased,
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
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
  getAllEvents,
  getGiftList,
  getGiftItem,
  updateGiftList,
  updatePurchased,
  deleteGiftList
};

