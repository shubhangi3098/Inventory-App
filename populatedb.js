

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");
var Brand = require("./models/brand");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var brands = [];
var categories = [];

function itemCreate(
  name,
  description,
  category,
  price,
  brand,
  stock,
  filename,
  cb
) {
  item_detail = {
    name: name,
    description: description,
    price: price,
    category: category,
    brand: brand,
    stock: stock,
  };
  if (filename !== null) {
    item_detail.filename = filename;
  }

  var item = new Item(item_detail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function brandCreate(name, cb) {
  var brand = new Brand({ name: name });

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

    mongoose.connection.close();
