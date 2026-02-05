<template>
  <div class="main-container">
    <div class="question-container">
      <div class="icon">
        <i class="fas fa-question-circle"></i>
      </div>
      <div class="text-content">
        <p class="comment">{{ question.user_comment }}</p>
        <p class="meta">{{ question.username }} - {{ formatDate(question.created_at) }}</p>
      </div>
    </div>

    <div class="answer-container">
      <div class="icon">
        <i class="fas fa-comment-dots"></i>
      </div>
      <div class="text-content">
        <p class="reply">{{ question.admin_reply }}</p>
        <p class="meta">Admin Reply - {{ formatDate(question.updated_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductQuestionCard',
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.main-container {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  padding: 16px;
  box-sizing: border-box;
}

.question-container,
.answer-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.icon {
  flex-shrink: 0;
}

.icon i {
  font-size: 20px;
  color: #ff6b00; /* Accent color */
}

.text-content {
  display: flex;
  flex-direction: column;
}

.comment,
.reply {
  font-weight: 600;
  font-size: 15px;
  color: #212121;
  margin: 0;
}

.meta {
  font-size: 13px;
  color: #757575;
  margin-top: 4px;
}

/* Responsive */
@media screen and (max-width: 600px) {
  .comment,
  .reply {
    font-size: 13px;
  }

  .meta {
    font-size: 11px;
  }

  .icon i {
    font-size: 16px;
  }
}
</style>
