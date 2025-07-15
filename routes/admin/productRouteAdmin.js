const express = require('express');
const router = express.Router();

const productController = require('../../controllers/admin/productmanagement'); // Your product controller
const upload = require('../../middlewares/fileuplaod'); // Reuse the same upload middleware

// Create a new product
router.post(
  '/',
  upload.single('image'), // form field name must be "image"
  productController.createProduct
);

// Get all products
router.get('/', productController.getAllProducts);

// Get single product by ID
router.get('/:id', productController.getProductById);

// Update a product
router.put(
  '/:id',
  upload.single('image'),
  productController.updateProduct
);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;


// Connect to DB and start server...

// const express = require("express"); aaryas code
// const router = express.Router();
// const productController = require("../../controllers/admin/productmanagement");
// const upload = require('../../middlewares/fileuplaod');

// // Create a new product
// router.post("/",  upload.single('image'), productController.createProduct);

// // Get all products (with pagination + search)
// router.get("/", productController.getProducts);
// // router.delete('/:id', productController.deleteProduct);
// module.exports = router;

// const express = require("express") //mycode
// const router = express.Router()

// const upload = require('../../middlewares/fileuplaod');

// const productController = require("../../controllers/admin/productmanagement")
// // can be imported as singular
// // perviously
// // const {createProduct} = require("../../controllers/admin/productmanagement")
// // per function
// // router.put("/", upload.single("productImage"), productController.createProduct);

// router.post(
//     "/",
//         upload.single("productImage"),
//     productController.createProduct // using dot, get function
// )
// router.get(
//     "/",
//     productController.getProducts
// )
// // router.post(
// //     '/', 
// //     upload.single("productImage"),
// //     // req.file, req.files from next function
// //     // get image, file metadata
// //     productController.createProduct
// // );
// module.exports = router