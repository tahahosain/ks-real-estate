import mongoose from "mongoose";

const EstateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["apartment", "villa", "house", "land", "commercial"],
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "sold", "rented"],
      default: "available",
    },

    location: {
      province: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      neighborhood: {
        type: String,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      coordinates: {
        lat: {
          type: Number,
        },

        lng: {
          type: Number,
        },
      },
    },

    price: {
      type: Number,
      min: 0,
    },

    deposit: {
      type: Number,
      min: 0,
    },

    rent: {
      type: Number,
      min: 0,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },

    parking: {
      type: Boolean,
      default: false,
    },

    floor: {
      type: Number,
      min: 0,
    },

    totalFloors: {
      type: Number,
      min: 0,
    },

    yearBuilt: {
      type: Number,
      min: 1300,
    },

    amenities: {
      elevator: {
        type: Boolean,
        default: false,
      },

      balcony: {
        type: Boolean,
        default: false,
      },

      storage: {
        type: Boolean,
        default: false,
      },

      furnished: {
        type: Boolean,
        default: false,
      },

      centralHeating: {
        type: Boolean,
        default: false,
      },

      airConditioning: {
        type: Boolean,
        default: false,
      },
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
        },

        alt: {
          type: String,
        },
      },
    ],

    thumbnail: {
      type: String,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    views: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const EstateModel =
  mongoose.models.Estate || mongoose.model("Estate", EstateSchema);

export default EstateModel;
