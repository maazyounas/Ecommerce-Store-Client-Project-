import db from '../config/db.js';

// ✅ Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(`
      SELECT r.*, u.name AS user_name, p.title AS product_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
    `);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// ✅ Get reviews for a specific product
export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.name AS user_name FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?`, [productId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product reviews' });
  }
};

// ✅ Add a review


// ✅ Delete a review
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};



export const getProductReviewsSummary = async (req, res) => {
  const { productId } = req.params;
  console.log(productId, "getProductReviewsSummary is working");
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const [reviews] = await db.execute(
      `SELECT rating FROM reviews WHERE product_id = ?`,
      [productId]
    );

    const totalReviews = reviews.length;
    console.log(totalReviews, "totalReviews");

    if (totalReviews === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0,
        starCounts: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    }

    const starCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    let ratingSum = 0;

    for (const review of reviews) {
      const r = review.rating;
      if (starCounts[r] !== undefined) {
        starCounts[r]++;
        ratingSum += r;
      }
    }

    const averageRating = (ratingSum / totalReviews).toFixed(1);
    console.log(averageRating, totalReviews,starCounts, "averageRating");
    res.status(200).json({
      averageRating: parseFloat(averageRating),
      totalReviews,
      starCounts,
    });
  } catch (error) {
    console.error("Error fetching review summary:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// GET /api/reviews/:productId
export const getProductReviewsDetails = async (req, res) => {
  const { productId } = req.params;

  try {
    // Step 1: Fetch all reviews for the product
    const [reviews] = await db.query(
      `SELECT r.id AS review_id, r.user_id, r.rating, r.comment, r.created_at, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?`,
      [productId]
    );

    // Step 2: For each review, fetch associated image URLs
    const reviewsWithImages = await Promise.all(
      reviews.map(async (review) => {
        const [images] = await db.query(
          `SELECT image_url FROM review_images WHERE review_id = ?`,
          [review.review_id]
        );

        const image_urls = images.map((img) => img.image_url);
        console.log(image_urls, "image_urls");
        return {
          review_id: review.review_id,
          user_id: review.user_id,
          user_name: review.user_name,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          image_urls,
        };
      })
    );

    res.json(reviewsWithImages);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





// Controller to get questions and username per record

export const getQuestionsByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    // Step 1: Fetch all questions for the given product_id
    const [questions] = await db.query(
      `SELECT * FROM questions WHERE product_id = ? ORDER BY created_at DESC`,
      [productId]
    );

    // Step 2: For each question, fetch the username based on user_id
    const questionsWithUsername = await Promise.all(
      questions.map(async (q) => {
        let username = null;

        if (q.user_id) {
          const [userResult] = await db.query(
            `SELECT name FROM users WHERE id = ?`,
            [q.user_id]
          );

          if (userResult.length > 0) {
            username = userResult[0].name;
          }
        }

        return {
          ...q,
          username,
        };
      })
    );

    // Step 3: Send the array
    res.json(questionsWithUsername);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/reviews/add-question
export const addQuestion = (req, res) => {
  const { product_id, user_comment } = req.body;
  const user_id = req.user.id; // ✅ from token, not user input
  console.log("addquestion is working", user_id,product_id,user_comment);

  if (!product_id || !user_comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO questions (user_id, product_id, user_comment)
    VALUES (?, ?, ?)
  `;

  db.query(query, [user_id, product_id, user_comment], (err, result) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ error: 'Failed to add question' });
    }

    res.status(201).json({ message: 'Question added successfully', questionId: result.insertId });
  });
};


export const createReview = async (req, res) => {
  const { user_id, product_id, rating, comment, images } = req.body;
  console.log("createReview is working", user_id,product_id,rating,comment,images);
  try {
    const [result] = await db.query(`
      INSERT INTO reviews (user_id, product_id, rating, comment) 
      VALUES (?, ?, ?, ?)
    `, [user_id, product_id, rating, comment]);

    const reviewId = result.insertId;

    // Save image URLs into review_images
    if (images && images.length) {
      for (const imageUrl of images) {
        await db.query(`
          INSERT INTO review_images (review_id, image_url)
          VALUES (?, ?)
        `, [reviewId, imageUrl]);
      }
    }

    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    console.error("❌ Error in createReview:", err);
    res.status(500).json({ error: 'Failed to add review', details: err.message });
  }
};



export const getUserReviews = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [reviews] = await db.query(`
      SELECT r.*, p.title AS product_title 
      FROM reviews r 
      JOIN products p ON r.product_id = p.id 
      WHERE r.user_id = ?
      ORDER BY r.id DESC
    `, [userId]);

    const [images] = await db.query(`
      SELECT * FROM review_images
    `);

    const reviewsWithImages = reviews.map((review) => {
      review.images = images.filter(img => img.review_id === review.id);
      return review;
    });

    res.json(reviewsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};





