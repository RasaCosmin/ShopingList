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
      comments: [
        {
          text: {
            type: String,
            required: true
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
  ]
});

module.exports = ShopingList = mongoose.model("shopingList", ListSchema);
