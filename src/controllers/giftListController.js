const { GiftList } = require("../models/GiftListModel");
const multer = require("multer");
const path = require("path");

// this function creates a new gift list event in the giftlist db
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
    // Create the giftlist from the request entire body
    const giftlist = await GiftList.create(request.body); 
    // if added respond back to the frontend 
    response.status(201).json({
      message: "The gift list details created successfully",
      giftlist: giftlist,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}
// this function gets all giftlist events from the db, based on accountEmail.
async function getAllEvents(request, response) {
  try {
    const  { accountEmail }  = request.authUserData;
    // using the accoutEmail from the token of logged in user , find all event giftlists with the same accoutEmail
    const events = await GiftList.find({ accountEmail });

    if (!events || events.length === 0) {
      return response.status(404).json({ message: "There were no gift list events found" });
    }
    // respond back to frontend with the data found
    response.status(200).json({
      message: "Gift lists have been found.",
      events: events
    });

  } catch (error) {
    console.error("Error in getAllUsers", error);
    response.status(500).json({ message: error.message });
  }
}
// this function will get a single giftlist from the db based on id
async function getGiftList(request, response) {
  try {
    // giftlist id from the url params
    const  { id }  = request.params;
    // find the document from db by id
    const giftlist = await GiftList.findOne({ _id: id }); 

    if (!giftlist) {
      return response
        .status(404)
        .json({ message: "That gift list does not exist." });
    }
// respond to frontend with the data
    response.status(200).json({
      message: "The gift list details have been found.",
      giftlist: giftlist,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}
// this function will get a gift nested object from the specific giftlist both based on their id's
async function getGiftItem(request, response) {
  try {
    // both the giftlist id & specfiic gift id from the url params
    const  { id, giftId }  = request.params;
    // find the based on both id params from the db
    const nestedGift = await GiftList.findOne({ _id: id,
      "childGiftList._id": giftId }); 

    if (!nestedGift) {
      return response
        .status(404)
        .json({ message: "That gift item does not exist." });
    }

    // Extract the specific gift object from childGiftList array
    const giftItem = nestedGift.childGiftList.find(gift => gift._id.toString() === giftId);

    if (!giftItem) {
      return response.status(404).json({ message: "Gift not found." });
    }
    // respond to the frontend with the data
    response.status(200).json({
      message: "The gift item details have been found.",
      giftItem: giftItem,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

// Set up multer for image file storage
const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads' folder
  },
  filename: (request, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the image file
  },
});
// the multer variable to be exported to the specific gift route 
const upload = multer({ storage });
// this function updates a specific giiftlist with a new nested gift based on id
async function updateGiftList(request, response) {
  try {
    // giftlist id from the url params
      const { id } = request.params;
      const { giftName, giftDescription, giftWebAddress, } = request.body;
      // the gift image added from frontend 
      const imagePath = request.file ? `/uploads/${request.file.filename}` : "";
    // set all the variables and asign to an object 
      newGift = {
        giftName,
        giftDescription,
        giftWebAddress,
        giftImage: imagePath
      }
      // console.log("newGift", newGift)
      // add the new gift object to the nested childGiftList array
      const addGift = await GiftList.findByIdAndUpdate(id,
        { $push: { childGiftList: newGift } }, 
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
// this function updates the purchased / purchasedBy fields in each nested gift by id
async function updatePurchased(request, response) {
  try {
    // get the userName logged in from token
    const { userName } = request.authUserData;
    // get the giftlist id & the nested gift id from the url params
    const  { id, giftId }  = request.params;
    // user input fields from the frontend
    const   data   = request.body;
    // find the giftlist event from id params
    const nestedGift = await GiftList.findOne({ _id: id,
      "childGiftList._id": giftId }); 
      

    // If the gift list doesn't exist, return an error
    if (!nestedGift) {
      return response.status(404).json({ message: "That Gift list not found."});
    }

    // find the nested gift object from the gift id
     const gift = nestedGift.childGiftList.find(gift => gift._id.toString() === giftId);

     if (!gift) {
       return response
         .status(404)
         .json({ message: "Gift not found." });
     }
      // Check if the gift has already been purchased
     if (gift.purchased === true) {
      return response
        .status(404)
        .json({ message: "That gift has already been purchased by somebody else." });
    }
 
     // Update the `purchased` field and `purchasedBy` for the specific gift in the `childGiftList' array:
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
  // respond to the frontend
      response.status(201).json({
        message: "The gift purchased details have been added.",
        updatedPurchased: updatedPurchased,
      });
    } catch (error) {
      console.error("Error in updatePurchased:", error);
      response.status(500).json({ error: error.message });
    }
}
// this function adds a shared user (adult userName , first & last names) ) to a particular gift list based on id:
async function createSharedUser (request, response) {
  try {
      const { id } = request.params;
      const { data } = request.body;
  
      const addSharedUser = await GiftList.findByIdAndUpdate(id,
        { $push: { userShared: data } }, // finds and Adds newGift to the array by id
        { new: true, runValidators: true } // Returns updated document & validates schema
      );

      if (!addSharedUser) {
        return response.status(404).json({ message: "Shared user list not found." });
      }
      // reespond back to the frontend
      response.status(201).json({
        message: "The shared user details have been added.",
        addSharedUser: addSharedUser,
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
}

// this function will delete a specific gift list object from the db based on id:
async function deleteGiftList(request, response) {
  try {
    const { giftListTitle } = request.body; 
    // gift list id from the url params
    const id = request.params.id;
    // Delete the gift list from the gift list collection using the gift list id.
    const deleteGiftList = await GiftList.deleteOne({ _id: id  });
    

    // If nothing was deleted, return a response
    if (deleteGiftList === 0) {
      return response
        .status(404)
        .json({ message: "That gift list does not exist, so cannot be deleted." });
    }
    // The response to the frontend when deleted
    response.status(200).json({
      message: "The gift list details have been deleted.",
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}
// this function will delete a individual gift object from the nested child gift array based on gift list id & gift id:
async function deleteGiftItem(request, response) {
  try {
    // gift list id & gift id from the url params
    const { id, giftId } = request.params;
    
   // Use the $pull operator to remove the object with the matching id from the childGiftList array
   const updatedGiftList = await GiftList.findOneAndUpdate(
    { _id: id },
    { $pull: { childGiftList: { _id: giftId } } }, // Delete the child gift list by its gift id
    { new: true } 
  );

  if (!updatedGiftList) {
    return response.status(404).json({ message: 'Gift list not found' });
  }
  // response back to the frontend
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

