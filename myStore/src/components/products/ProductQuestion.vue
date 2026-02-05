<template>
  <div class="container">
    <div class="header">
      <!-- Auth Prompt -->
      <div class="ask-question">
        <p v-if="!isLoggedIn">
          Ask a question? <a href="/login">Login</a> or
          <a href="/signup">Signup</a>
        </p>
        <p v-else>Ask a question about this product:</p>
      </div>

      <!-- Input Section -->
      <div v-if="isLoggedIn" class="ask-question-input">
        <input
          type="text"
          v-model="questionText"
          placeholder="Enter your question(s) here"
        />
        <button @click="askQuestion">Ask Question</button>
      </div>

      <p class="question-count">
        Other questions answered by ReliableStore ({{ questions.length }})
      </p>
    </div>

    <!-- Questions Display -->
    <ProductQuestionCard
      v-for="(q, index) in questions"
      :key="index"
      :question="q"
    />

    <!-- Recommended Section -->
    <div class="my-container">
      <div class="suggestion-header">
        <p>You may also like</p>
      </div>
    </div>

    <div class="recommend-container">
      <RecommendProductCard
        v-for="(product, index) in recommendedProducts"
        :key="index"
        :product="product"
        class="recommend-card"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import RecommendProductCard from '../home/RecommendProductCard.vue';
import ProductQuestionCard from './ProductQuestionCard.vue';
import api from '../axios/Axios';

axios.defaults.withCredentials = true;

export default {
  name: 'ProductQuestion',
  components: {
    ProductQuestionCard,
    RecommendProductCard,
  },
  setup() {
    const questions = ref([]);
    const questionText = ref('');
    const isLoggedIn = ref(false);
    const recommendedProducts = ref([]);
    const route = useRoute();
    const productId = Number(route.params.id);

    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/reviews/questionByReviewId/${productId}`);
        questions.value = res.data;
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const res = await api.get(`/products/recommend/${productId}`);
        recommendedProducts.value = res.data;
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    };

    const checkAuth = async () => {
      try {
        await api.get('/auth/me');
        isLoggedIn.value = true;
      } catch (error) {
        isLoggedIn.value = false;
        if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
          console.error('Unexpected error:', error.message);
        }
      }
    };

    const askQuestion = async () => {
      if (!questionText.value.trim()) {
        alert("Please enter a question before submitting.");
        return;
      }

      try {
        await api.post('/reviews/add-question', {
          product_id: productId,
          user_comment: questionText.value.trim(),
        });
        questionText.value = '';
        fetchQuestions();
      } catch (err) {
        if (err.response?.status === 401) {
          alert("You must be logged in to ask a question.");
        } else {
          console.error("Failed to post question:", err);
          alert("An error occurred while posting the question.");
        }
      }
    };

    onMounted(() => {
      checkAuth();
      fetchQuestions();
      fetchRecommendedProducts();
    });

    watch(() => route.fullPath, () => {
      checkAuth();
    });

    return {
      questions,
      questionText,
      askQuestion,
      isLoggedIn,
      recommendedProducts,
    };
  },
};
</script>

<style scoped>
.container {
  width: 90%;
  max-width: 1400px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.header {
  margin-bottom: 20px;
}

.ask-question {
  margin-bottom: 10px;
}

.ask-question p {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.ask-question a {
  text-decoration: none;
  color: #ff6b00;
  font-weight: bold;
}

.ask-question-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.ask-question-input input {
  flex: 1;
  min-width: 200px;
  height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 15px;
}

.ask-question-input button {
  height: 44px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #ff6b00, #ff2a00);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.ask-question-input button:hover {
  background: linear-gradient(90deg, #ff5a00, #e02a00);
}

.question-count {
  margin-top: 15px;
  font-size: 15px;
  color: #555;
  font-weight: 500;
}

/* Recommended section */
.suggestion-header {
  padding: 16px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.suggestion-header p {
  font-size: 17px;
  font-weight: bold;
  color: #212121;
  margin: 0;
}

.my-container {
  margin-top: 20px;
  border-bottom: 1px solid #e0e0e0;
}

/* Horizontal scroll */
.recommend-container {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 15px;
  padding: 20px 0;
}

.recommend-card {
  width: 220px;
  flex-shrink: 0;
}

@media screen and (max-width: 600px) {
  .recommend-container > * {
    flex: 0 0 calc(70% - 2px);
    max-width: calc(70% - 2px);
  }

  .ask-question-input {
    flex-direction: column;
    align-items: stretch;
  }

  .ask-question-input input,
  .ask-question-input button {
    width: 100%;
  }
}
</style>
