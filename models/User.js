const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  firents: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ]
});

module.exports = User = mongoose.model("users", UserSchema);
