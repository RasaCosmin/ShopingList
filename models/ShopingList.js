const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  items: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      unit: {
        type: String,
        default: "kg"
      },
      comments: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "users"
          },
          text: {
            type: String,
            required: true
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ],
  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ShopingList = mongoose.model("shopingList", ListSchema);
