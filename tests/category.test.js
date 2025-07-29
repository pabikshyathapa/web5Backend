const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const categoryController = require('../controllers/admin/categorymanagement'); // adjust path
const Category = require('../models/Category'); // adjust path

const app = express();
app.use(express.json());

// Define minimal routes for testing
app.post('/api/categories', categoryController.createCategory);
app.get('/api/categories', categoryController.getAllCategories);
app.get('/api/categories/:id', categoryController.getCategoryById);
app.put('/api/categories/:id', categoryController.updateCategory);
app.delete('/api/categories/:id', categoryController.deleteCategory);

describe('Category API', () => {
  let createdCategoryId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb-category', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({
        name: 'Rings',
        filepath: 'uploads/fake-image.jpg' // simulate multer file path
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Created');
    expect(res.body.data.name).toBe('Rings');
    expect(res.body.data.filepath).toBe('uploads/fake-image.jpg');

    createdCategoryId = res.body.data._id;
  });

  it('should get all categories', async () => {
    // create a category manually
    await Category.create({ name: 'Bracelets', filepath: 'uploads/fake-bracelet.jpg' });

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get category by id', async () => {
    // create category to fetch
    const category = await Category.create({ name: 'Necklaces', filepath: 'uploads/fake-necklace.jpg' });

    const res = await request(app).get(`/api/categories/${category._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(String(category._id));
    expect(res.body.data.name).toBe('Necklaces');
  });

  it('should return 404 for non-existing category', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/categories/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Category not found');
  });

  it('should update a category with new name and filepath', async () => {
    const category = await Category.create({ name: 'Earrings', filepath: 'uploads/old-file.jpg' });

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .send({
        name: 'Updated Earrings',
        filepath: 'uploads/updated-file.jpg' // simulate new file path
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated Earrings');
    expect(res.body.data.filepath).toBe('uploads/updated-file.jpg');
  });

  it('should return 404 when updating non-existing category', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/categories/${fakeId}`)
      .send({
        name: 'No Category',
        filepath: 'uploads/no-file.jpg'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Category not found');
  });

  it('should delete a category', async () => {
    const category = await Category.create({ name: 'Watches', filepath: 'uploads/fake-watch.jpg' });

    const res = await request(app).delete(`/api/categories/${category._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Category deleted');
  });

  it('should return 404 when deleting non-existing category', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).delete(`/api/categories/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Category not found');
  });
});
