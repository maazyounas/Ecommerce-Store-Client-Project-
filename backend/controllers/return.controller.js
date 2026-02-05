import db from '../config/db.js';

// Create a return request
export const createReturn = async (req, res) => {
  const { orderId, userId, reason, status = "pending" } = req.body;

  console.log("Creating return for:", orderId, userId, reason, status);

  if (!orderId || !userId || !reason) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO returns (order_id, user_id, reason, status) VALUES (?, ?, ?, ?)`,
      [orderId, userId, reason, status]
    );

    res.status(201).json({
      message: "Return request created",
      returnId: result.insertId,
    });
  } catch (err) {
    console.error("Return DB error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get all returns
export const getAllReturns = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT * FROM returns ORDER BY created_at DESC`);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Get return by user ID
export const getReturnByUserId = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching returns for user_id:", id);

  try {
    const [results] = await db.query("SELECT * FROM returns WHERE user_id = ? ORDER BY created_at DESC", [id]);
    console.log("Return records:", results);
    res.status(200).json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Update return status
export const updateReturnStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(`UPDATE returns SET status = ? WHERE id = ?`, [status, id]);
    res.status(200).json({ message: "Return status updated" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete a return
export const deleteReturn = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM returns WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Return not found" });
    }

    res.status(200).json({ message: "Return deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};
