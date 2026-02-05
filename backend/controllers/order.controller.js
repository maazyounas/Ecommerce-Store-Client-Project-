import db from '../config/db.js';
export const getOrdersByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  console.log("Getting orders for user:", userId);

  try {
    const [orders] = await db.query(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

    if (!orders) {
      console.log("No orders found or query failed.");
    }

    for (const order of orders) {
      const [items] = await db.query(`
        SELECT 
          oi.*, 
          p.title AS name, 
          p.thumbnail AS image,
          p.brand
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // <- You will see full error in terminal
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};



// PUT /api/orders/:orderId/cancel
export const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const [[order]] = await db.query(`SELECT status FROM orders WHERE id = ?`, [id]);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ error: 'Cannot cancel shipped or delivered orders' });
    }

    await db.query(`UPDATE orders SET status = 'cancelled' WHERE id = ?`, [id]);
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// GET /api/orders/returns/:userId
export const getReturnsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [orders] = await db.query(`
      SELECT * FROM orders 
      WHERE user_id = ? AND status = 'cancelled'
      ORDER BY created_at DESC
    `, [userId]);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ error: "Failed to fetch return orders" });
  }
};



export const getAllOrders = async (req, res) => {
  try {
const [rows] = await db.query("SELECT * FROM orders WHERE status != 'cancelled' ORDER BY created_at DESC");
    res.json({ orders: rows });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createOrder = async (req, res) => {
  try {
    const { user_id, total_amount, payment_method, status } = req.body;

    // ✅ Validate required fields
    if (!user_id || !total_amount || !payment_method) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ Prepare SQL query
    const insertOrderQuery = `
      INSERT INTO orders (user_id, total_amount, payment_method, status)
      VALUES (?, ?, ?, ?)
    `;

    // ✅ Execute query
    const [result] = await db.query(insertOrderQuery, [
      user_id,
      total_amount,
      payment_method,
      status || 'pending', // use 'pending' as default if not provided
    ]);

    // ✅ Build inserted order object
    const insertedOrder = {
      id: result.insertId, // <-- This is your order ID
      user_id,
      total_amount,
      payment_method,
      status: status || 'pending',
      created_at: new Date().toISOString(), // Client-side friendly format
    };

    // ✅ Respond with success
    res.status(201).json({
      message: 'Order created successfully',
      order: insertedOrder,
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};