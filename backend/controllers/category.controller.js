import db from '../config/db.js';

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
};

// Get all categories with their subcategories (for public/frontend)
export const getAllCategories = async (req, res) => {
  try {
    // Fetch only active parent categories (where parent_id is NULL)
    const [categories] = await db.query(
      `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
       FROM categories 
       WHERE parent_id IS NULL AND is_active = 1 
       ORDER BY created_at DESC`
    );

    // For each parent category, fetch its active subcategories
    for (let category of categories) {
      const [subcategories] = await db.query(
        `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
         FROM categories 
         WHERE parent_id = ? AND is_active = 1 
         ORDER BY created_at DESC`,
        [category.id]
      );
      category.subcategories = subcategories;
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error('Database error in getAllCategories:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Get all categories including inactive (for admin)
export const getAllCategoriesAdmin = async (req, res) => {
  try {
    // Fetch all parent categories
    const [categories] = await db.query(
      `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
       FROM categories 
       WHERE parent_id IS NULL 
       ORDER BY created_at DESC`
    );

    // For each parent category, fetch all its subcategories
    for (let category of categories) {
      const [subcategories] = await db.query(
        `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
         FROM categories 
         WHERE parent_id = ? 
         ORDER BY created_at DESC`,
        [category.id]
      );
      category.subcategories = subcategories;
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error('Database error in getAllCategoriesAdmin:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [categories] = await db.query(
      `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
       FROM categories 
       WHERE id = ?`,
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const category = categories[0];

    // If it's a parent category, fetch subcategories
    if (!category.parent_id) {
      const [subcategories] = await db.query(
        `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
         FROM categories 
         WHERE parent_id = ? 
         ORDER BY created_at DESC`,
        [id]
      );
      category.subcategories = subcategories;
    }

    res.status(200).json(category);
  } catch (err) {
    console.error('Database error in getCategoryById:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [categories] = await db.query(
      `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
       FROM categories 
       WHERE slug = ? AND is_active = 1`,
      [slug]
    );

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const category = categories[0];

    // If it's a parent category, fetch subcategories
    if (!category.parent_id) {
      const [subcategories] = await db.query(
        `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
         FROM categories 
         WHERE parent_id = ? AND is_active = 1 
         ORDER BY created_at DESC`,
        [category.id]
      );
      category.subcategories = subcategories;
    }

    res.status(200).json(category);
  } catch (err) {
    console.error('Database error in getCategoryBySlug:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Get subcategories by parent category ID
export const getSubcategories = async (req, res) => {
  const { parentId } = req.params;
  try {
    const [subcategories] = await db.query(
      `SELECT id, name, slug, parent_id, image_url, is_active, created_at, updated_at 
       FROM categories 
       WHERE parent_id = ? AND is_active = 1 
       ORDER BY created_at DESC`,
      [parentId]
    );
    res.status(200).json(subcategories);
  } catch (err) {
    console.error('Database error in getSubcategories:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Create new category (parent or subcategory)
export const createCategory = async (req, res) => {
  const { name, image_url, parent_id, is_active = 1 } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    // Generate slug from name
    let slug = generateSlug(name);

    // Check if slug already exists and make it unique
    const [existingSlugs] = await db.query(
      "SELECT slug FROM categories WHERE slug LIKE ?",
      [`${slug}%`]
    );

    if (existingSlugs.length > 0) {
      const slugSet = new Set(existingSlugs.map(s => s.slug));
      let counter = 1;
      let newSlug = slug;
      while (slugSet.has(newSlug)) {
        newSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = newSlug;
    }

    const [result] = await db.query(
      `INSERT INTO categories (name, slug, parent_id, image_url, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, slug, parent_id || null, image_url || null, is_active]
    );

    res.status(201).json({
      message: "Category created successfully",
      id: result.insertId,
      slug: slug
    });
  } catch (err) {
    console.error('Database error in createCategory:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image_url, parent_id, is_active } = req.body;

  try {
    // Check if category exists
    const [existing] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);

      // Update slug if name changes
      let slug = generateSlug(name);
      const [existingSlugs] = await db.query(
        "SELECT slug FROM categories WHERE slug LIKE ? AND id != ?",
        [`${slug}%`, id]
      );

      if (existingSlugs.length > 0) {
        const slugSet = new Set(existingSlugs.map(s => s.slug));
        let counter = 1;
        let newSlug = slug;
        while (slugSet.has(newSlug)) {
          newSlug = `${slug}-${counter}`;
          counter++;
        }
        slug = newSlug;
      }

      updates.push("slug = ?");
      values.push(slug);
    }

    if (image_url !== undefined) {
      updates.push("image_url = ?");
      values.push(image_url);
    }

    if (parent_id !== undefined) {
      updates.push("parent_id = ?");
      values.push(parent_id || null);
    }

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await db.query(
      `UPDATE categories SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    console.error('Database error in updateCategory:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Toggle category active status
export const toggleCategoryStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT is_active FROM categories WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newStatus = existing[0].is_active === 1 ? 0 : 1;
    await db.query("UPDATE categories SET is_active = ? WHERE id = ?", [newStatus, id]);

    res.status(200).json({
      message: `Category ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      is_active: newStatus
    });
  } catch (err) {
    console.error('Database error in toggleCategoryStatus:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

// Delete category (cascades to subcategories due to FK constraint)
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has products
    const [productsInCategory] = await db.query(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [id]
    );

    if (productsInCategory[0].count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${productsInCategory[0].count} product(s). Please delete or reassign the products first.` 
      });
    }

    // Check if category has subcategories
    const [subcategories] = await db.query(
      "SELECT COUNT(*) as count FROM categories WHERE parent_id = ?",
      [id]
    );

    if (subcategories[0].count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${subcategories[0].count} subcategory(ies). Please delete the subcategories first.` 
      });
    }

    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error('Database error in deleteCategory:', err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
