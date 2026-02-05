import db from '../config/db.js';

// Create Coupon
export const createCoupon = (req, res) => {
  const { code, discount, expiry_date } = req.body;
  const sql = 'INSERT INTO coupons (code, discount, expiry_date) VALUES (?, ?, ?)';
  db.query(sql, [code, discount, expiry_date], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating coupon', error: err });
    res.status(201).json({ message: 'Coupon created successfully', id: result.insertId });
  });
};

// Get All Coupons
export const getAllCoupons = (req, res) => {
  const sql = 'SELECT * FROM coupons';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching coupons', error: err });
    res.json(results);
  });
};

// Get Single Coupon by ID
export const getCouponById = (req, res) => {
  const sql = 'SELECT * FROM coupons WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching coupon', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Coupon not found' });
    res.json(results[0]);
  });
};

// Update Coupon
export const updateCoupon = (req, res) => {
  const { code, discount, expiry_date } = req.body;
  const sql = 'UPDATE coupons SET code = ?, discount = ?, expiry_date = ? WHERE id = ?';
  db.query(sql, [code, discount, expiry_date, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating coupon', error: err });
    res.json({ message: 'Coupon updated successfully' });
  });
};

// Delete Coupon
export const deleteCoupon = (req, res) => {
  const sql = 'DELETE FROM coupons WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting coupon', error: err });
    res.json({ message: 'Coupon deleted successfully' });
  });
};

// Apply Coupon (Validate it)
export const applyCoupon = (req, res) => {
  const { code } = req.body;
  const sql = 'SELECT * FROM coupons WHERE code = ? AND expiry_date >= CURDATE()';
  db.query(sql, [code], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error applying coupon', error: err });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired coupon' });
    res.json({ message: 'Coupon applied', coupon: results[0] });
  });
};
