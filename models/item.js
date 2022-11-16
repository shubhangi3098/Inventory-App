const mongoose = require("mongoose");
const category = require("./category");
const brand = require("./brand");

var Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, minLength: 1, required: true },
  description: { type: String, minLength: 1, required: true },
  category: { type: Schema.Types.ObjectId, ref: category, required: true },
  price: { type: Number, required: true, min: 0 },
  brand: { type: Schema.Types.ObjectId, ref: brand, required: true },
  stock: { type: Number, required: true, min: 0 },
  filename: String,
});

ItemSchema.virtual("url").get(function () {
  return `/items/${this.name.split(" ").join("-").toLowerCase()}/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
