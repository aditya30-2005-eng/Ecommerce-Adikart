// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js'; 

const router = express.Router();

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products); 
  } catch (error) {
    console.error("Mongoose Error fetching products:", error);
    return res.status(500).json([]);
  }
});

// POST /api/products - Add a new product
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl, category, stock } = req.body;

  if (!name || !price || !description || !imageUrl || !category) {
    return res.status(400).json({ message: 'Missing required product fields.' });
  }

  try {
    const newProduct = new Product({ name, description, price, imageUrl, category, stock });
    const createdProduct = await newProduct.save();
    
    const productToReturn = { ...createdProduct.toObject(), id: createdProduct._id };
    return res.status(201).json(productToReturn);

  } catch (error) {
    console.error("FAILED TO ADD PRODUCT:", error); 
    return res.status(500).json({ message: 'Failed to add product to database.' });
  }
});

// PUT /api/products/:id - Edit an existing product
router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        
        const productToReturn = { ...updatedProduct.toObject(), id: updatedProduct._id };
        return res.json(productToReturn);

    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        console.error("FAILED TO EDIT PRODUCT:", error);
        return res.status(400).json({ message: 'Failed to update product.' });
    }
});

// DELETE /api/products/:id - Delete a product (CRITICAL FIX FOR DELETION)
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Mongoose will try to delete the document
        const result = await Product.findByIdAndDelete(productId); 

        if (!result) {
            // ID was valid but product wasn't found
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Success response
        return res.status(200).json({ message: 'Product deleted successfully.' });

    } catch (error) {
        // CRITICAL FIX: Handle CastError (invalid ID format)
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid product ID format.' });
        }
        
        console.error("FAILED TO DELETE PRODUCT (Server Error):", error);
        return res.status(500).json({ message: 'Failed to delete product due to server error.' });
    }
});

export default router;