import db from '../config/db.js';

// ✅ Get all order items
export const getAllOrderItems = async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM order_items');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

// ✅ Get items for a specific order
export const getOrderItemsByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items for the order' });
  }
};

// ✅ Add order items (during checkout)
export const addOrderItems = async (req, res) => {
  const { order_id, items } = req.body;
  
  console.log("========== ADD ORDER ITEMS ==========");
  console.log("Order ID:", order_id);
  console.log("Items received:", items);
  console.log("Items count:", items?.length);

  if (!order_id || !items || !Array.isArray(items) || items.length === 0) {
    console.error("Invalid request data:", { order_id, items });
    return res.status(400).json({ error: 'Invalid order_id or items array' });
  }

  try {
    for (const item of items) {
      const { product_id, quantity, price } = item;
      console.log(`Inserting item: product_id=${product_id}, quantity=${quantity}, price=${price}`);
      
      if (!product_id || !quantity || !price) {
        console.error("Missing required fields in item:", item);
        continue;
      }
      
      const [result] = await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, product_id, quantity, price]
      );
      console.log(`Inserted order item with ID: ${result.insertId}`);
    }
    console.log("All order items added successfully");
    res.status(201).json({ message: 'Order items added successfully' });
  } catch (error) {
    console.error('Failed to add order items:', error);
    res.status(500).json({ error: 'Failed to add order items', details: error.message });
  }
};

// ✅ Delete item from an order (optional)
export const deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM order_items WHERE id = ?', [id]);
    res.json({ message: 'Order item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order item' });
  }
};
