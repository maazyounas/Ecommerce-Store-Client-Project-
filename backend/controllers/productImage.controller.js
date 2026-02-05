import db from '../config/db.js';

// ✅ Get all images for a product
export const getImagesByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product images' });
  }
};

// ✅ Add an image for a product
export const addProductImage = async (req, res) => {
  const { product_id, image_url } = req.body;
  try {
    await db.query(
      'INSERT INTO product_images (product_id, image_url, created_at) VALUES (?, ?, NOW())',
      [product_id, image_url]
    );
    res.status(201).json({ message: 'Image added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product image' });
  }
};

// ✅ Delete a specific image by ID
export const deleteProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM product_images WHERE id = ?', [id]);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product image' });
  }
};
