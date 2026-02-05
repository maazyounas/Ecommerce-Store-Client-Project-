import db from '../config/db.js';

// Create Inquiry
export const createInquiry = (req, res) => {
  const { name, email, subject, message } = req.body;
  const sql = 'INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error submitting inquiry', error: err });
    res.status(201).json({ message: 'Inquiry submitted successfully', id: result.insertId });
  });
};

// Get All Inquiries
export const getAllInquiries = (req, res) => {
  const sql = 'SELECT * FROM inquiries ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching inquiries', error: err });
    res.json(results);
  });
};

// Get Inquiry by ID
export const getInquiryById = (req, res) => {
  const sql = 'SELECT * FROM inquiries WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching inquiry', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(results[0]);
  });
};

// Delete Inquiry
export const deleteInquiry = (req, res) => {
  const sql = 'DELETE FROM inquiries WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting inquiry', error: err });
    res.json({ message: 'Inquiry deleted successfully' });
  });
};
