import db from '../config/db.js';

// ✅ Get all hero images
export const getAllHeroImages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_sections ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero images' });
  }
};

// ✅ Add new hero image
export const addHeroImage = async (req, res) => {
  const { image_url, title, link } = req.body;
  try {
    await db.query(
      'INSERT INTO hero_sections (image_url, title, link, created_at) VALUES (?, ?, ?, NOW())',
      [image_url, title, link]
    );
    res.status(201).json({ message: 'Hero image added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add hero image' });
  }
};

// ✅ Delete hero image
export const deleteHeroImage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM hero_sections WHERE id = ?', [id]);
    res.json({ message: 'Hero image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hero image' });
  }
};
