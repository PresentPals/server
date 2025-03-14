const mongoose = require("mongoose");

const childGiftSchema = new mongoose.Schema({
  // Schema list for the gifts the child would like. A nested object for each gift.
  giftName: {
    // Gift name entered.
    type: String,
    default: "",
  },
  giftDescription: {
    // Description of the gift.
    type: String,
    default: "",
  },
  giftImage: {
    // Image of the gift.
    type: String,
    default: "",
  },
  giftWebAddress: {
    // Url of where gift can be purchased.
    type: String,
    default: "",
  },
  purchased: {
    // if an adult has marked this gift as being purchased === true
    type: Boolean,
    default: false,
  },
  purchasedBy: {
    // the adult username that has marked purchased  === true.
    type: String,
    default: "",
  },
});

const sharedSchema = new mongoose.Schema({
  // Schema list for the shared adult users of this gift list. A nested object for multiple adults.
  sharedUserName: {
    // adult username added.
    type: String,
  },
  sharedFirstName: {
    // adult firstname added
    type: String,
  },
  sharedLastName: {
    // adult lastname added.
    type: String,
  },
});

// this is the main gift list object schema:
const GiftListSchema = new mongoose.Schema({
  giftListTitle: {
    // Title of the gift list.
    type: String,
    required: true,
  },
  accountEmail: {
    // accountEmail to group the gift lists to only the account of the user that created it.
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  giftListImage: {
    // If the user creating wants to add a gift list image.
    type: String,
  },
  listDescription: {
    type: String,
  },
  childUser: {
    // The child user this gift list is for.
    type: String,
    required: true,
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
        purchasedBy: "",
      },
    ],
  },
  userShared: {
    // Adult users having this list shared with them.
    type: [sharedSchema],
    default: [
      {
        sharedUserName: "",
        sharedFirstName: "",
        sharedLastName: "",
      },
    ],
  },
  privateList: {
    // true = private, false = public
    type: Boolean,
    default: false,
  },
  dateCreated: {
    // Date the list was created.
    type: Date,
    default: Date.now,
  },
  dateEvent: {
    // Date the event this list is required for = because of the childUsers birthdate, Christmas day, date of the party etc.
    type: Date,
    required: true,
  },
});

const GiftList = mongoose.model("GiftList", GiftListSchema);

module.exports = {
  GiftList,
};
