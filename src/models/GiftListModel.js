const mongoose =require("mongoose");

const GiftListSchema = new mongoose.Schema({
    giftListTitle: {
        type: String,
        required: true
    },
    giftListImage: {
        type: String
    },
    childUser: {
        type: String,
        required: true
    },
    childItem: {
        type: String,
        required: true
    },
    itemDescription: {
        type: String
    },
    itemWebAddress: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateExpired: {
        type: Date
    },
});

const GiftList = mongoose.model("GiftList", GiftListSchema);

module.exports = {
    GiftList
};