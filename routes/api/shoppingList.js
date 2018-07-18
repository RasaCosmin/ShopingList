const express = require("express");
const router = express.Router();
const passport = require("passport");

//load models
const User = require("../../models/User");
const ShopingList = require("../../models/ShopingList");

//@route GET /api/list/test
//@desc test route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "test" }));

//@route GET /api/list
//@desc add a new shopping list
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ShopingList.find()
      .or([{ user: req.user.id }, { "friends.user": req.user.id }])
      .sort({ date: -1 })
      .then(list => {
        if (list) res.json(list);
        else
          res.status(400).json({ noList: "You don't have any shopping list" });
      });
  }
);

//@route POST /api/list
//@desc add a new shopping list
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const shoppingList = new ShopingList({
      user: req.user.id,
      name: req.body.name
    });

    if (req.body.items) shoppingList.items = req.body.items;

    shoppingList.save().then(list => res.json(list));
  }
);

//@route POST /api/list/:list_id
//@desc add a new item in the shopping list
//@access Private
router.post(
  "/:list_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    checkList(req.params.list_id, req.user.id).then(list => {
      if (list) {
        const newItem = {
          name: req.body.name
        };
        if (req.body.quantity) newItem.quantity = req.body.quantity;
        if (req.body.unit) newItem.unit = req.body.unit;

        if (list.items.filter(item => item.name === newItem.name).length > 0) {
          return res.status(400).json({ itemexist: "Item already exist" });
        }

        list.items.unshift(newItem);

        list.save().then(list => res.json(list));
      } else {
        res.status(400).json({ notfound: "Shopping list not found" });
      }
    });
  }
);

//@route GET /api/list/:list_id/:item_id
//@desc get an item in the shopping list
//@access Private
router.get(
  "/:list_id/:item_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    checkList(req.params.list_id, req.user.id).then(list => {
      if (list) {
        const item = list.items.find(
          item => item._id.toString() === req.params.item_id
        );
        if (item) {
          item.comments.sort((i1, i2) => {
            if (i1.date < i2.date) {
              return 1;
            }
            if (i1.date > i2.date) {
              return -1;
            }
            return 0;
          });
          res.json(item);
        } else {
          res.status(400).json({ notfound: "item not found" });
        }
      } else {
        res.status(400).json({ notfound: "Shopping list not found" });
      }
    });
  }
);

//@route PUT /api/list/:list_id/:item_id
//@desc Update an item in the shopping list
//@access Private
router.put(
  "/:list_id/:item_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    checkList(req.params.list_id, req.user.id).then(list => {
      if (list) {
        const item = list.items.find(
          item => item._id.toString() === req.params.item_id
        );
        if (item) {
          if (req.body.name) {
            item.name = req.body.name;
          }
          if (req.body.quantity) {
            item.quantity = req.body.quantity;
          }
          if (req.body.unit) {
            item.unit = req.body.unit;
          }

          const itemIndex = list.items.map(item => item._id).indexOf(item._id);

          list.items.splice(itemIndex, 1);

          if (list.items.filter(it => it.name === item.name).length > 0) {
            return res
              .status(400)
              .json({ itemexist: "Item with same name already exist" });
          }

          list.items.splice(itemIndex, 0, item);

          list.save().then(list => res.json(list));
        } else {
          res.status(400).json({ notfound: "item not found" });
        }
      } else {
        res.status(400).json({ notfound: "Shopping list not found" });
      }
    });
  }
);

//@route Delete /api/list/:list_id/:item_id
//@desc Delete an item in the shopping list
//@access Private
router.delete(
  "/:list_id/:item_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    checkList(req.params.list_id, req.user.id).then(list => {
      if (list) {
        const item = list.items.find(
          item => item._id.toString() === req.params.item_id
        );
        if (item) {
          const itemIndex = list.items.map(item => item._id).indexOf(item._id);

          list.items.splice(itemIndex, 1);
          list.save().then(list => res.json(list));
        } else {
          res.status(400).json({ notfound: "item not found" });
        }
      } else {
        res.status(400).json({ notfound: "Shopping list not found" });
      }
    });
  }
);

//@route Post /api/list/:list_id/:item_id
//@desc Add comment for an item in the shopping list
//@access Private
router.post(
  "/:list_id/:item_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    checkList(req.params.list_id, req.user.id).then(list => {
      if (list) {
        const item = list.items.find(
          item => item._id.toString() === req.params.item_id
        );
        if (item) {
          const itemIndex = list.items.map(item => item._id).indexOf(item._id);

          list.items.splice(itemIndex, 1);
          list.save().then(list => res.json(list));
        } else {
          res.status(400).json({ notfound: "item not found" });
        }
      } else {
        res.status(400).json({ notfound: "Shopping list not found" });
      }
    });
  }
);

const checkList = (list_id, userId) => {
  return ShopingList.findOne({ _id: list_id })
    .or([{ user: userId }, { "friends.user": userId }])
    .then(list => {
      if (list) return list;
      else return false;
    });
};

module.exports = router;
