const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const cartController = require('../controllers/cartController'); // adjust path as needed

const app = express();
app.use(express.json());

// Setup routes exactly as per your controller expectations
app.post('/api/cart', cartController.addToCart);
app.get('/api/cart/:userId', cartController.getCartByUser);
app.put('/api/cart', cartController.updateCartItem);
app.delete('/api/cart', cartController.removeCartItem);
app.delete('/api/cart/:userId', cartController.clearCart);
app.get('/api/cart', cartController.getAllCartItems);

describe('Cart API', () => {
  const userId = new mongoose.Types.ObjectId();
  const productId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb-cart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Cart.deleteMany({ userId });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({
        userId,
        productId,
        name: 'Gold Ring',
        price: 100,
        quantity: 2,
        filepath: 'image.jpg',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Product added to cart');
    expect(res.body.data.userId).toBe(String(userId));
    expect(res.body.data.products.length).toBe(1);
    expect(res.body.data.products[0].name).toBe('Gold Ring');
  });

  it('should get the cart by userId', async () => {
    // Pre-create cart
    await Cart.create({
      userId,
      products: [{ productId, name: 'Gold Ring', price: 100, quantity: 2, filepath: 'image.jpg' }]
    });

    const res = await request(app).get(`/api/cart/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Cart fetched');
    expect(res.body.data.userId).toBe(String(userId));
    expect(res.body.data.products.length).toBeGreaterThan(0);
  });

  it('should update cart item quantity', async () => {
    await Cart.create({
      userId,
      products: [{ productId, name: 'Gold Ring', price: 100, quantity: 2, filepath: 'image.jpg' }]
    });

    const res = await request(app)
      .put('/api/cart')
      .send({
        userId,
        productId,
        quantity: 5,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Quantity updated');
    const product = res.body.data.products.find(p => p.productId === String(productId));
    expect(product.quantity).toBe(5);
  });

  it('should remove a product from the cart', async () => {
    await Cart.create({
      userId,
      products: [{ productId, name: 'Gold Ring', price: 100, quantity: 2, filepath: 'image.jpg' }]
    });

    const res = await request(app)
      .delete('/api/cart')
      .send({
        userId,
        productId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Product removed');
    expect(res.body.data.products.find(p => p.productId === String(productId))).toBeUndefined();
  });

  it('should clear the entire cart', async () => {
    await Cart.create({
      userId,
      products: [{ productId, name: 'Gold Ring', price: 100, quantity: 2, filepath: 'image.jpg' }]
    });

    const res = await request(app).delete(`/api/cart/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Cart cleared');

    const cart = await Cart.findOne({ userId });
    expect(cart).toBeNull();
  });

  it('should get all cart items from all users', async () => {
    await Cart.create({
      userId,
      products: [{ productId, name: 'Gold Ring', price: 100, quantity: 2, filepath: 'image.jpg' }]
    });

    const res = await request(app).get('/api/cart');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
