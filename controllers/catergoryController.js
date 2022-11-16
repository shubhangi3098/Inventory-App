const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.category_list = function (req, res, next) {
  Category.find({}).exec(function (err, results) {
    if (err) {
      return next(err);
    }

    res.render("category_list", { title: "Categories", categories: results });
  });
};

exports.category_items = function (req, res, next) {
  async.parallel(
    {
      items: function (callback) {
        Item.find({ category: req.params.id })
          .populate("brand category")
          .exec(callback);
      },
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      res.render("category_items", {
        title: req.params.name,
        items: results.items,
        category: results.category,
      });
      return;
    }
  );
};

exports.category_create_get = function (req, res, next) {
  res.render("category_brand_form", { title: "New Category" });
};

exports.category_create_post = [
  body("name", "Name should not be empty").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("category_brand_form", {
        title: "New Category",
        errors: errors.array(),
      });
      return;
    } else {
      category.save(function (err) {
        if (err) return next(err);

        res.redirect("/categories");
      });
    }
  },
];

exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id).exec(function (err, results) {
    if (err) return next(err);

    if (results == null) {
      let error = new Error("Category not found");
      error.status = 404;
      return next(err);
    }

    res.render("category_brand_form", { title: "Edit Category", arg: results });
  });
};

exports.category_update_post = [
  body("name", "Name should not be empty").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render("category_brand_form", {
        title: "Edit Category",
        errors: errors.array(),
      });
      return;
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, categoryResult) {
          if (err) return next(err);

          res.redirect(categoryResult.url);
        }
      );
    }
  },
];

exports.category_delete_get = function (req, res, next) {
  Category.findById(req.params.id).exec(function (err, result) {
    if (err) return next(err);

    res.render("category_delete", { category: result });
  });
};

exports.category_delete_post = function (req, res, next) {
  Category.findById(req.params.id).exec(function (err, result) {
    if (err) return next(err);

    if (req.body.name === result.name) {
      Category.findByIdAndDelete(req.params.id, function (err) {
        if (err) return next(err);

        res.redirect("/categories");
      });
      return;
    }

    res.render("category_delete", {
      category: result,
      error: "Name does not match",
    });
  });
};
