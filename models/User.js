const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "کاربر املاک K&S ",
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "USER",
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  },
);

const model = mongoose.models.User || mongoose.model("User", schema);
export default model;