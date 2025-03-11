const { GiftList } = require("../models/GiftListModel");
const multer = require("multer");
const path = require("path");


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

    const  { id, giftId }  = request.params;

    const nestedGift = await GiftList.findOne({ _id: id,
      "childGiftList._id": giftId }); 

    if (!nestedGift) {
      return response
        .status(404)
        .json({ message: "That gift item does not exist." });
    }

    // Extract the specific gift from childGiftList
    const giftItem = nestedGift.childGiftList.find(gift => gift._id.toString() === giftId);

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

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads' folder
  },
  filename: (request, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

const upload = multer({ storage });

async function updateGiftList(request, response) {
  try {
      const { id } = request.params;
      const { giftName, giftDescription, giftWebAddress, } = request.body;
      const imagePath = request.file ? `/uploads/${request.file.filename}` : "";

      newGift = {
        giftName,
        giftDescription,
        giftWebAddress,
        giftImage: imagePath
      }
      console.log("newGift", newGift)
  
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

    const  { id, giftId }  = request.params;

    const   data   = request.body;
    
    const nestedGift = await GiftList.findOne({ _id: id,
      "childGiftList._id": giftId }); 
      

    // If the gift list doesn't exist, return an error
    if (!nestedGift) {
      return response.status(404).json({ message: "That Gift list not found."});
    }

     // Check if the gift has already been purchased
     const gift = nestedGift.childGiftList.find(gift => gift._id.toString() === giftId);

     if (!gift) {
       return response
         .status(404)
         .json({ message: "Gift not found." });
     }

     if (gift.purchased === true) {
      return response
        .status(404)
        .json({ message: "That gift has already been purchased by somebody else." });
    }
 
     // Update the `purchased` field and `purchasedBy` for the specific gift in the `childGiftList`
     const updatedPurchased = await GiftList.findOneAndUpdate(
       { _id: id, "childGiftList._id": giftId },
       { 
         $set: {
           "childGiftList.$.purchased": data.purchased,
           "childGiftList.$.purchasedBy": data.purchasedBy,
         } 
       },
       { new: true, runValidators: true }
     );
 
     if (!updatedPurchased) {
       return response.status(404).json({ message: "Gift not found for updating." });
     }
  
      response.status(201).json({
        message: "The gift purchased details have been added.",
        updatedPurchased: updatedPurchased,
      });
    } catch (error) {
      console.error("Error in updatePurchased:", error);
      response.status(500).json({ error: error.message });
    }
}

async function createSharedUser (request, response) {
  try {
      const { id } = request.params;
      const { data } = request.body;
  
      const addSharedUser = await GiftList.findByIdAndUpdate(id,
        { $push: { userShared: data } }, // Adds newGift to the array
        { new: true, runValidators: true } // Returns updated document & validates schema
      );

      if (!addSharedUser) {
        return response.status(404).json({ message: "Shared user list not found." });
      }
  
      response.status(201).json({
        message: "The shared user details have been added.",
        addSharedUser: addSharedUser,
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
}


async function deleteGiftList(request, response) {
  try {
    const { giftListTitle } = request.body; 

    const id = request.params.id;
    
    const deleteGiftList = await GiftList.deleteOne({ _id: id  });
    // Delete the gift list from the gift list collection.

    // If nothing was deleted, return a response
    if (deleteGiftList === 0) {
      return response
        .status(404)
        .json({ message: "That gift list does not exist, so cannot be deleted." });
    }
    // The response when deleted
    response.status(200).json({
      message: "The gift list details have been deleted.",
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

async function deleteGiftItem(request, response) {
  try {

    const { id, giftId } = request.params;
    
   // Use the $pull operator to remove the object with the matching id from the childGiftList array
   const updatedGiftList = await GiftList.findOneAndUpdate(
    { _id: id },
    { $pull: { childGiftList: { _id: giftId } } }, // Delete the child gift list by its _id
    { new: true } // Return the updated document
  );

  if (!updatedGiftList) {
    return response.status(404).json({ message: 'Gift list not found' });
  }

  response.status(200).json({ message: 'Child gift item deleted successfully', updatedGiftList });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

module.exports = {
  createGiftList,
  getAllEvents,
  getGiftList,
  getGiftItem,
  upload,
  updateGiftList,
  updatePurchased,
  createSharedUser,
  deleteGiftList,
  deleteGiftItem
};

