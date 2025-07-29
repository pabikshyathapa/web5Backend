const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRouter = require('../routes/admin/productRouteAdmin');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User'); 

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Product API ', () => {
  let testProductId;
  let testCategoryId;
  let testSellerId;

  const testImagePath = path.resolve(__dirname, 'test-image.jpg');
  const updatedImagePath = path.resolve(__dirname, 'test-image-2.jpg');

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');

    // Seed category and user
    const category = await Category.create({ name: 'Electronics' });
    const seller = await User.create({ name: 'John Doe', email: 'john@example.com', password: '123456',  phone: "9876543210" });

    testCategoryId = category._id;
    testSellerId = seller._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new product with image upload', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('name', 'iPhone 15')
      .field('price', 999)
      .field('categoryId', testCategoryId.toString())
      .field('sellerId', testSellerId.toString())
      .field('description', 'Latest Apple iPhone')
      .field('stock', 100)
      .attach('image', testImagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe('iPhone 15');

    testProductId = res.body.data._id;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get product by ID', async () => {
    const res = await request(app).get(`/api/products/${testProductId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(testProductId);
  });

  it('should return 404 for non-existing product', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Product not found');
  });

  it('should update a product name and image', async () => {
    const res = await request(app)
      .put(`/api/products/${testProductId}`)
      .field('name', 'Updated iPhone')
      .field('price', 1099)
      .field('categoryId', testCategoryId.toString())
      .field('sellerId', testSellerId.toString())
      .field('stock', 80)
      .attach('image', updatedImagePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated iPhone');
    expect(res.body.data.filepath).toBeDefined();
  });

  it('should return 404 for updating non-existing product', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/products/${fakeId}`)
      .field('name', 'NoProduct');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Product not found');
  });
});
