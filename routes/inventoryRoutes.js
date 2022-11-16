const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemController");
const brandsController = require("../controllers/brandConroller");
const categoryController = require("../controllers/catergoryController");

router.get("/", itemsController.index);
router.get("/items/:name/:id/update", itemsController.item_update_get);
router.post("/items/:name/:id/update", itemsController.item_update_post);
router.get("/items/:name/:id/delete", itemsController.item_delete_get);
router.post("/items/:name/:id/delete", itemsController.item_delete_post);
router.get("/items/create", itemsController.item_create_get);
router.post("/items/create", itemsController.item_create_post);
router.get("/items/:name/:id", itemsController.show);
router.get("/items", itemsController.index);

router.get("/brand/:name/:id/update", brandsController.brand_update_get);
router.post("/brand/:name/:id/update", brandsController.brand_update_post);
router.get("/brand/:name/:id/delete", brandsController.brand_delete_get);
router.post("/brand/:name/:id/delete", brandsController.brand_delete_post);
router.get("/brands/create", brandsController.brand_create_get);
router.post("/brands/create", brandsController.brand_create_post);
router.get("/brand/:name/:id", brandsController.brand_items);
router.get("/brands", brandsController.brand_list);

router.get(
  "/category/:name/:id/update",
  categoryController.category_update_get
);
router.post(
  "/category/:name/:id/update",
  categoryController.category_update_post
);
router.get(
  "/category/:name/:id/delete",
  categoryController.category_delete_get
);
router.post(
  "/category/:name/:id/delete",
  categoryController.category_delete_post
);
router.get("/category/create", categoryController.category_create_get);
router.post("/category/create", categoryController.category_create_post);
router.get("/category/:name/:id", categoryController.category_items);
router.get("/categories", categoryController.category_list);

module.exports = router;
