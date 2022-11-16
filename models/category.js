const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, minLength: 1, required: true },
});

CategorySchema.virtual("url").get(function () {
  return "/category/" + this.name + "/" + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);
