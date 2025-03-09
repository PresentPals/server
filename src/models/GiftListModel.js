const mongoose = require("mongoose");

const childGiftSchema = new mongoose.Schema({
  // Schema list for the gifts the child would like.
  giftName: {
    // Gifts added the child would like.
    type: String,
    default: ""
  },
  giftDescription: {
    // Description of the gift.
    type: String,
    default: ""
  },
  giftImage: {
    // Image of the gift.
    type: String,
    default: ""
  },
  giftWebAddress: {
    // Url of where gift can be purchased.
    type: String,
    default: ""
  },
  purchased: {
    type: Boolean,
    default: false
  },
  purchasedBy: {
    type: String,
    default: ""
  }
});

const GiftListSchema = new mongoose.Schema({
  giftListTitle: {
    // Title of the gift list.
    type: String,
    required: true
  },
  accountEmail: {
    // accountEmail to group the gift lists to only the account of the user that created it.
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    // match: [/.+@.+\..+/i]
  },
  giftListImage: {
    // If the user creating wants to add a gift list image.
    type: String
  },
  listDescription: {
    type: String
  },
  childUser: {
    // The child user this gift list is for.
    type: String,
    required: true
  },
  childGiftList: {
    // Array of each of the childs gift objects.
    type: [childGiftSchema],
    default: [
      {
        giftName: "",
        giftDescription: "",
        giftImage: "",
        giftWebAddress: "",
        purchased: false,
        purchasedBy: ""
      }
    ]
  },
  // userCreated: {
  //   // User that created the list.
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true
  // },
  privateList: {
    // true = private, false = public
    type: Boolean,
    default: false
  },
  dateCreated: {
    // Date the list was created.
    type: Date,
    default: Date.now
  },
  dateEvent: {
    // Date the event this list is required = because of the childUsers birthdate, Christmas day, date of the party etc.
    type: Date,
    required: true
  },
});

const GiftList = mongoose.model("GiftList", GiftListSchema);

module.exports = {
  GiftList
};
