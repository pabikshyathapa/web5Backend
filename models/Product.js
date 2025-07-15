
const mongoose = require("mongoose") //my code
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        categoryId: {
            type: mongoose.Schema.ObjectId, // foreign key/referencing
            ref: 'Category',
            required: true
        },
        sellerId: {
            type: mongoose.Schema.ObjectId, // foreign key/referencing
            ref: 'User',
            required: true
        },
          filepath: { type: String },
          description: {
      type: String,
      default: '', // optional but available
    },
    stock: {
      type: Number,
      default: 0, // optional, good for tracking inventory
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
)
module.exports = mongoose.model(
    'Product', productSchema
)

// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     categoryId: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Category',
//       required: true,
//     },
//     sellerId: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     image: {
//       type: String, // image file name or URL
//       default: '',
//     },
//     description: {
//       type: String,
//       default: '',
//     },
//     stock: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true, // adds createdAt and updatedAt
//   }
// );

// module.exports = mongoose.model('Product', ProductSchema);