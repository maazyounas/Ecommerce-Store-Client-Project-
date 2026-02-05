<template>
  <div class="container">
    <!-- ✅ Selection Checkbox -->
    <div class="checkbox-container">
      <input
        type="checkbox"
        :checked="selected"
        @change="$emit('toggle-selection', item.productId)"
      />
    </div>

    <!-- 🟧 Row 1: Image + Text -->
    <div class="top-row">
      <div class="image-container">
        <img :src="item.thumbnail" :alt="item.title" />
      </div>
      <div class="text-container">
        <p>{{ item.title }}</p>
        <p>Brand: {{ item.brand }}</p>
        <p>Only few item(s) in stock</p>
      </div>
    </div>

    <!-- 🟧 Row 2: Price + Quantity -->
    <div class="bottom-row">
      <div class="price-container">
        <p>Rs. {{ item.currentPrice }}</p>
        <p>Rs. {{ item.originalPrice }}</p>
        <p>
          <i class="fas fa-heart"></i>
          <i class="fas fa-trash" @click="deleteItem"></i>
        </p>
      </div>
      <div class="quantity-container">
        <button class="decrease" @click="updateQuantity(-1)">-</button>
        <input type="number" :value="item.quantity" readonly />
        <button class="increase" @click="updateQuantity(1)">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasketCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async deleteItem() {
      try {
        const res = await fetch(`http://localhost:5000/api/carts/${this.item.productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          this.$emit("item-removed", this.item.productId);
        } else {
          console.error("Failed to delete item");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    },
    async updateQuantity(change) {
      const newQuantity = this.item.quantity + change;
      if (newQuantity < 1) return;

      try {
        await fetch("http://localhost:5000/api/carts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            productId: this.item.productId,
            quantity: change,
          }),
        });

        this.$emit("quantity-updated", {
          productId: this.item.productId,
          newQuantity,
        });
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    },
  },
};
</script>


<style scoped>
.fa-trash, .fa-heart {
  cursor: pointer;
  
}
.container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
  gap: 10px;
}

/* Checkbox */
.checkbox-container input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #f85606;
  margin-left: 10px;
  cursor: pointer;
  transform: scale(1.2);
}

/* 🟧 Row 1: Image + Text Side by Side */
.top-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

/* Image */
.image-container img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

/* Text Info */
.text-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.text-container p:nth-child(2) {
  color: grey;
}

.text-container p:nth-child(3) {
  color: #d1611e;
}

/* 🟧 Row 2: Price + Quantity */
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* Price Info */
.price-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #333;
}

.price-container p:nth-child(1) {
  color: #f85606;
}

.price-container p:nth-child(2) {
  color: gray;
  text-decoration: line-through;
}

.price-container p:nth-child(3) {
  display: flex;
  gap: 15px;
  color: grey;
}

/* Quantity Controls */
.quantity-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quantity-container input {
  width: 40px;
  text-align: center;
}

.quantity-container input::-webkit-outer-spin-button,
.quantity-container input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-container button {
  width: 25px;
  height: 25px;
  background-color: #f85606;
  color: #ffffff;
  border: none;
  cursor: pointer;
}

/* ✅ Desktop layout */
@media screen and (min-width: 768px) {
  .container {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .top-row,
  .bottom-row {
    flex: 1 1 100%;
    display: flex;
    flex-direction: row;
  }

  .text-container {
    width: 40%;
  }

  .price-container,
  .quantity-container {
    width: auto;
  }
}
</style>