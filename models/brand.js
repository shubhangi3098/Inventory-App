const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, minLength: 1, required: true },
});

BrandSchema.virtual("url").get(function () {
  return "/brand/" + this.name + "/" + this._id;
});

module.exports = mongoose.model("Brand", BrandSchema);
