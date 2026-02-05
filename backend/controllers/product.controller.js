import db from '../config/db.js';

// ✅ Get all products
// backend/controller/product.controller.js
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.title, p.thumbnail, p.current_price,p.original_price, c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


// ✅ Get single product
export const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};
//add new product
// backend/controllers/product.controller.js
export const createProduct = async (req, res) => {
  const { title, brand, category_id, stock, thumbnail, gallery, description, current_price,original_price } = req.body;

  if (!title || !brand || !category_id || !stock || !thumbnail || !description || !current_price) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO products (title, brand, category_id, stock, thumbnail, description, current_price, original_price)
       VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
      [title, brand, category_id, stock, thumbnail, description, current_price,original_price]
    );

    const productId = result.insertId;

    if (Array.isArray(gallery)) {
      for (const imgUrl of gallery) {
        await db.execute(
          `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
          [productId, imgUrl]
        );
      }
    }

    res.status(201).json({ message: '✅ Product added successfully' });
  } catch (err) {
    console.error('❌ Error inserting product:', err.message);
    res.status(500).json({ error: '❌ Server error' });
  }
};




// ✅ Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log("update product controller",req.body);
  const {
    title,
    brand,
    category_id,
    stock,
    thumbnail,
    description,
    current_price,
    original_price,
    gallery,
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE products
       SET title = ?, brand = ?, category_id = ?, stock = ?, thumbnail = ?, description = ?, current_price = ?, original_price = ?
       WHERE id = ?`,
      [title, brand, category_id, stock, thumbnail, description, current_price, original_price, id]
    );

    if (gallery?.length) {
      await db.execute(`DELETE FROM product_images WHERE product_id = ?`, [id]);

      for (const imageUrl of gallery) {
        await db.execute(`INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`, [id, imageUrl]);
      }
    }

    res.json({ message: "✅ Product updated successfully" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "❌ Server error" });
  }
};


// ✅ Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if product exists
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is in any orders
    const [ordersWithProduct] = await db.query(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
      [id]
    );

    if (ordersWithProduct[0].count > 0) {
      return res.status(400).json({ 
        error: `Cannot delete product. It exists in ${ordersWithProduct[0].count} order(s). You can deactivate it instead.` 
      });
    }

    // Delete related records (these can be safely deleted)
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    await db.query('DELETE FROM cart WHERE product_id = ?', [id]);
    await db.query('DELETE FROM reviews WHERE product_id = ?', [id]);
    await db.query('DELETE FROM questions WHERE product_id = ?', [id]);

    // Finally delete the product
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("❌ Product deletion error:", error);
    res.status(500).json({ 
      error: 'Product deletion failed', 
      details: error.message 
    });
  }
};




 export const getProductDetails = async (req, res) => {
  console.log("Received request for product details shahzaib");
  const { productId } = req.params;

  try {
    // Fetch product details
    const [productRows] = await db.execute(
      `SELECT title, brand, thumbnail, current_price, original_price, stock 
       FROM products 
       WHERE id = ?`,
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productRows[0];

    // Fetch product images
    const [images] = await db.execute(
      `SELECT image_url 
       FROM product_images 
       WHERE product_id = ?`,
      [productId]
    );

    // Fetch reviews data (average rating + count)
    const [[reviewStats]] = await db.execute(
      `SELECT AVG(rating) AS avgRating, COUNT(*) AS totalReviews 
       FROM reviews 
       WHERE product_id = ?`,
      [productId]
    );

    // Fetch total questions count
    const [[questionStats]] = await db.execute(
      `SELECT COUNT(*) AS totalQuestions 
       FROM questions 
       WHERE product_id = ?`,
      [productId]
    );

    // Send combined data
    return res.status(200).json({
      product,
      images,
      averageRating: parseFloat(reviewStats.avgRating || 0).toFixed(1),
      totalReviews: reviewStats.totalReviews,
      totalQuestions: questionStats.totalQuestions,
    });

  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getProductDescription = async (req, res) => {
  const { productId } = req.params;

  try {
    const [result] = await db.query(
      'SELECT description FROM products WHERE id = ?',
      [productId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ description: result[0].description });
  } catch (error) {
    console.error('Error fetching product description:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/recommend/:productId
export const getRecommendedProducts = async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    // Step 1: Get the current product to find its category_id
    const [productRows] = await db.execute(
      'SELECT category_id FROM products WHERE id = ?',
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentCategoryId = productRows[0].category_id;

    // Step 2: Get recommended products in same category (excluding current product)
    const [recommendedRows] = await db.execute(
      `SELECT * FROM products 
       WHERE category_id = ? AND id != ?
       LIMIT 4`,
      [currentCategoryId, productId]
    );

    res.status(200).json(recommendedRows);
  } catch (err) {
    console.error('Error fetching recommended products:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getAllProductQuestions = async (req, res) => {
  console.log("Request received for /questions/users");
  try {
    const sql = `
      SELECT 
        q.id, q.user_comment, q.admin_reply, q.created_at,
        p.title AS product_title, p.thumbnail AS product_thumbnail
      FROM questions q
      JOIN products p ON q.product_id = p.id
      WHERE q.admin_reply IS NULL OR q.admin_reply = ''
      ORDER BY q.created_at DESC
    `;
    const [results] = await db.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ message: 'Database error', error: err });
  }
};



// Reply to a specific question
export const replyToQuestion = async (req, res) => {
  console.log("Request received for /questions/:id/reply", req.params, req.body);
  const { id } = req.params;
  const { admin_reply } = req.body;

  try {
    const sql = `UPDATE questions SET admin_reply = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.query(sql, [admin_reply, id]);
    res.status(200).json({ message: 'Reply sent' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

export const getProductsByCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE category_id = ?',
      [categoryId]
    );

    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products by category:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getAllFlashProducts = async (req, res) => {
  console.log("Request received for /products/flash");
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.title, p.thumbnail, p.current_price, p.original_price, c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.original_price > 0
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const searchProducts = async (req, res) => {
  const { q } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT p.id, p.title, p.thumbnail, p.current_price, p.original_price, c.name AS category
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.title LIKE ?`,
      [`%${q}%`] // fuzzy search
    );

    res.json(rows);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

