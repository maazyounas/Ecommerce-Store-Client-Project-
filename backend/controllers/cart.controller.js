import db from '../config/db.js';
import jwt from 'jsonwebtoken';

// 🛒 Add to Cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, productId]
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity]
      );
    }

    res.status(201).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 🧾 Get Cart Items (with user token)
export const getCartItems = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug log
    console.log("Decoded token:", decoded);

    const userId = decoded.id;
    if (!userId) return res.status(400).json({ message: 'User ID not found in token' });

    const [rows] = await db.execute(
      `SELECT c.product_id, c.quantity,
              p.thumbnail, p.title, p.brand, p.current_price, p.original_price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    const cartItems = rows.map(item => ({
      userId,
      productId: item.product_id,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
      title: item.title,
      brand: item.brand,
      currentPrice: item.current_price * item.quantity,
      originalPrice: item.original_price,
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ❌ Delete Item from Cart
export const deleteCartItem = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { productId } = req.params;

    const [result] = await db.execute(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    // Return success even if item wasn't found (already deleted)
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
