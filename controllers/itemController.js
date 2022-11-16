const Item = require("../models/item");
const Brand = require("../models/brand");
const Category = require("../models/category");
const async = require("async");
const multer = require("multer");
const { body, validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: { fileSize: 1000000 },
});

exports.index = function (req, res, next) {
  Item.find({})
    .populate("category")
    .populate("brand")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }

      res.render("index", { title: "All items", items: results });
    });
};

exports.show = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("category brand")
    .exec(function (err, results) {
      if (err) return next(err);

      if (results == null) {
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }

      res.render("show_item", { item: results });
    });
};

exports.item_create_get = function (req, res, next) {
  async.parallel(
    {
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      res.render("item_form", {
        title: "New Item",
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

exports.item_create_post = [
  upload.single("avatar"),

  body("name", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (req.file) {
      item.filename = req.file.filename;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);

          res.render("item_form", {
            title: "New Item",
            brands: results.brands,
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      item.save(function (err) {
        if (err) return next(err);

        res.redirect("/items");
      });
    }
  },
];

exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).populate("category brand").exec(callback);
      },
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.item == null) {
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }

      res.render("item_form", {
        title: "Edit Form",
        item: results.item,
        brands: results.brands,
        categories: results.categories,
      });
      return;
    }
  );
};

exports.item_update_post = [
  upload.single('avatar'),

  body("name", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      _id: req.params.id,
    });

    if (req.file) {
      item.filename = req.file.filename;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);

          res.render("item_form", {
            title: "Edit Item",
            item: item,
            brands: results.brands,
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Item.findByIdAndUpdate(
        req.params.id,
        item,
        {},
        function (err, itemResult) {
          if (err) return next(err);

          res.redirect(itemResult.url);
        }
      );
    }
  },
];

exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("brand category")
    .exec(function (err, result) {
      if (err) return next(err);

      if (result == null) {
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }

      res.render("item_delete", { item: result });
    });
};

exports.item_delete_post = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("brand category")
    .exec(function (err, result) {
      if (err) return next(err);

      if (req.body.name === result.name) {
        Item.findByIdAndDelete(req.params.id, function (err) {
          if (err) return next(err);

          res.redirect("/items");
        });
        return;
      }

      res.render("item_delete", { item: result, error: "Name does not match" });
    });
};
