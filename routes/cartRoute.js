const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCartByUser);
router.put("/update", cartController.updateCartItem);
router.delete("/remove", cartController.removeCartItem);
router.delete("/clear/:userId", cartController.clearCart);
router.get("/all", cartController.getAllCartItems);


module.exports = router;
