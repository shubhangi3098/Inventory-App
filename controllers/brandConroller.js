const { body, validationResult } = require("express-validator");
const Brand = require("../models/brand");
const Item = require("../models/item");
const async = require("async");

exports.brand_list = function (req, res, next) {
  Brand.find({}).exec(function (err, results) {
    if (err) {
      return next(err);
    }

    res.render("brand_list", { title: "Brands", brands: results });
  });
};

exports.brand_items = function (req, res, next) {
  async.parallel( //async. parallel() is used to run multiple asynchronous operations in parallel.
    {
      items: function (callback) {
        Item.find({ brand: req.params.id })
          .populate("brand category")
          .exec(callback);
      },
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);

      res.render("brand_items", {
        title: req.params.name,
        items: results.items,
        brand: results.brand,
      });
      return;
    }
  );
};

exports.brand_create_get = function (req, res, next) {
  res.render("category_brand_form", { title: "New Brand" });
};

exports.brand_create_post = [
  body("name", "Name should not be empty").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("category_brand_form", {
        title: "New Brand",
        errors: errors.array(),
      });
      return;
    } else {
      brand.save(function (err) {
        if (err) return next(err);

        res.redirect("/brands");
      });
    }
  },
];

exports.brand_update_get = function (req, res, next) {
  Brand.findById(req.params.id).exec(function (err, results) {
    if (err) return next(err);

    if (results == null) {
      let error = new Error("Category not found");
      error.status = 404;
      return next(err);
    }

    res.render("category_brand_form", { title: "Edit Brand", arg: results });
  });
};

exports.brand_update_post = [
  body("name", "Name should not be empty").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render("category_brand_form", {
        title: "Edit Brand",
        errors: errors.array(),
      });
      return;
    } else {
      Brand.findByIdAndUpdate(
        req.params.id,
        brand,
        {},
        function (err, brandResult) {
          if (err) return next(err);

          res.redirect(brandResult.url);
        }
      );
    }
  },
];

exports.brand_delete_get = function (req, res, next) {
  Brand.findById(req.params.id).exec(function (err, result) {
    if (err) return next(err);

    res.render("brand_delete", { brand: result });
  });
};

exports.brand_delete_post = function (req, res, next) {
  Brand.findById(req.params.id).exec(function (err, result) {
    if (err) return next(err);

    if (req.body.name === result.name) {
      Brand.findByIdAndDelete(req.params.id, function (err) {
        if (err) return next(err);

        res.redirect("/brands");
      });
      return;
    }

    res.render("brand_delete", {
      brand: result,
      error: "Name does not match",
    });
  });
};
