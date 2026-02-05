<template>
  <div class="questions-container">
    <h2 class="section-title">Product Questions</h2>

    <div v-for="q in questions" :key="q.id" class="question-card">
      <div class="product-info">
        <img :src="q.product_thumbnail" alt="Product Image" class="thumbnail" />
        <div class="text">
          <h3>{{ q.product_title }}</h3>
          <p><strong>User Question:</strong> {{ q.user_comment }}</p>
        </div>
      </div>

      <div class="reply-section">
        <label>Admin Reply:</label>
        <textarea
          v-model="q.admin_reply"
          rows="3"
          placeholder="Write your reply..."
        ></textarea>
        <button @click="submitReply(q)">Submit Reply</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../axios/Axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'AdminQuestions',
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    async fetchQuestions() {
      try {
        const res = await api.get('/products/questions/users');
        this.questions = res.data;
      } catch (err) {
        toast.error('Failed to fetch questions');
        console.error(err);
      }
    },
    async submitReply(question) {
      try {
        await api.put(`/products/questions/${question.id}`, {
          admin_reply: question.admin_reply,
        });
        toast.success('Reply submitted successfully!');
        this.fetchQuestions();
      } catch (err) {
        toast.error('Failed to submit reply');
        console.error(err);
      }
    },
  },
  created() {
    this.fetchQuestions();
  },
};
</script>

<style scoped>
.questions-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.section-title {
  font-size: 26px;
  margin-bottom: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.question-card {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  transition: transform 0.2s ease-in-out;
}

.question-card:hover {
  transform: translateY(-4px);
}

.product-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

.text h3 {
  margin: 0;
  font-size: 18px;
  color: #222;
}

.text p {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.reply-section label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.reply-section textarea {
  width: 100%;
  padding: 10px 12px;
  margin-top: 6px;
  margin-bottom: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: vertical;
}

.reply-section button {
  padding: 10px 20px;
  font-weight: 600;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.reply-section button:hover {
  opacity: 0.9;
}
</style>
