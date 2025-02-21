const mongoose = require("mongoose");

const childGiftSchema = new mongoose.Schema({
    // Schema list for the gifts the child would like.
    childGift: {
        // Gifts added the child would like.
        type: String,
        required: true
      },
      giftDescription: {
        // Description of the gift.
        type: String,
      },
      giftImage: {
        // Image of the gift.
        type: String
      },
      giftWebAddress: {
        // Url of where gift can be purchased.
        type: String
      }
});

const GiftListSchema = new mongoose.Schema({
    giftListTitle: {
        // Title of the gift list.
        type: String,
        required: true
    },
    giftListImage: {
        // If the user creating wants to add a gift list image.
        type: String,
    },
    childUser: {
        // The child user this gift list is for.
        type: String,
        required: true
    },
    childGiftList: {
        // Array of the childs gift objects.
        type: [childGiftSchema],
        required: true
    },
    userCreated: {
        // User that created the list.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateCreated: {
        // Date the list was created.
        type: Date,
        default: Date.now
    },
    dateExpired: {
        // Date the list expires = because of the childUsers birthdate, Christmas day, date of the party etc.
        type: Date,
        required: true
    },
});

const GiftList = mongoose.model("GiftList", GiftListSchema);

module.exports = {
  GiftList
};
