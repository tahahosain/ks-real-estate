const mongoose = require("mongoose");


const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    estate: {
      type: mongoose.Types.ObjectId,
      ref: "Estate",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
schema.index({ user: 1, estate: 1 }, { unique: true });
const model = mongoose.models.Wishlist || mongoose.model('Wishlist', schema);

export default model;