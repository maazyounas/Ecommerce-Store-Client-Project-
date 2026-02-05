<template>
  <div class="summary-container">
    <div class="promo">
      <input type="text" placeholder="Enter Store/Daraz Code" />
      <button>APPLY</button>
    </div>
    <div class="summary">
      <h4>Order Summary</h4>
      <div class="row"><span>Items Total ({{ quantity }} items)</span><span>Rs. {{ price }}</span></div>
      <div class="row"><span>Delivery Fee</span><span>Rs. 135</span></div>
      <div class="total-row"><span>Total:</span><span class="total">Rs. {{ price + 135 }}</span></div>
      <p class="vat-note">VAT included, where applicable</p>
<button
  class="pay-btn"
  @click="proceedToPay"
>
  Proceed to Pay
</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSummary",
  props: {
    quantity: Number,
    price: Number,
    productId: Number,
  },
  methods: {
    proceedToPay() {
      const total = this.price + 135;
      const items = JSON.stringify([
        {
          product_id: this.productId,
          quantity: this.quantity,
          price: this.price,
        },
      ]);

      this.$router.push({
        path: "/Payment",
        query: {
          total,
          totalQuantity: this.quantity,
          items,
        },
      });
    },
  },
};
</script>

<style scoped>
.summary-container {
  background-color: #fff;
  padding: 16px;
  font-size: 14px;
  border: 1px solid #ddd;
}
.promo {
    padding: 16px 0;
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}
.promo input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
}
.promo button {
  background-color: #2196f3;
  color: white;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
}
.summary h4 {
  margin: 10px 0;
}
.row,
.total-row {
    padding: 5px 0;
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}
.total {
  font-weight: bold;
  color: #f85606;
}
.vat-note {
    padding: 15px 0;
  font-size: 12px;
  color: #666;
  margin: 10px 0;
}
.pay-btn {
  background-color: #f85606;
  color: white;
  width: 100%;
  padding: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style>
