const { Schema, Types, model, default: mongoose } = require("mongoose");

const cryptoSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  age: { type: Number, required: true }, //ADJUST PROPERTIES ACCORDING TO THE TASK
  description: { type: String, required: true },
  location: {
    type: String,
    required: true,
  },
  comments: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
        required : [true,'User is required']
      },

      comment: {
        type: String,
        required: [true,'Comment is required']
      },
    },
  ],
  owner: { type: Types.ObjectId, ref: "User" },
});
//DONT FORGER TO CHANGE NAMES ACCORDING TO TASK

const Photo = model("Photo", cryptoSchema);
module.exports = Photo;
