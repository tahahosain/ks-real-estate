

const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "کاربر املاک K&S ",
    },
    email: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

const model =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", schema);
export default model;