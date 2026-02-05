<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-section">
        <h3>Customer Service</h3>
        <ul>
          <li><i class="fas fa-info-circle"></i> Help Center</li>
          <li><i class="fas fa-shipping-fast"></i> Shipping</li>
          <li><i class="fas fa-undo-alt"></i> Returns</li>
          <li><i class="fas fa-lock"></i> Privacy Policy</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>About Us</h3>
        <ul>
          <li><i class="fas fa-users"></i> About Company</li>
          <li><i class="fas fa-briefcase"></i> Careers</li>
          <li><i class="fas fa-bullhorn"></i> Press & Media</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <i class="fab fa-facebook-f"></i>
          <i class="fab fa-instagram"></i>
          <i class="fab fa-twitter"></i>
          <i class="fab fa-youtube"></i>
        </div>
      </div>

      <div class="footer-section">
        <h3>Download App</h3>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" class="app-icon" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Available_on_the_App_Store_(black)_SVG.svg" alt="App Store" class="app-icon" />
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Daraz Replica. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background-color: #111; 
  color: #fff;
  padding: 40px 20px 20px;
  font-family: 'Segoe UI', sans-serif;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 20px;
}

.footer-section {
  flex: 1 1 220px;
  min-width: 220px;
}

.footer-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #f85606; 
  text-transform: uppercase;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.footer-section li i {
  margin-right: 8px;
  color: #999;
  min-width: 20px;
}

.footer-section li:hover {
  color: #f85606;
}

.social-icons i {
  font-size: 20px;
  margin-right: 15px;
  color: #aaa;
  cursor: pointer;
  transition: color 0.3s ease;
}

.social-icons i:hover {
  color: #f85606;
}

.app-icon {
  width: 140px;
  margin: 10px 0;
  background-color: white;
  border-radius: 6px;
  padding: 5px;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 15px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .footer-section {
    flex: 1 1 45%;
    min-width: 45%;
  }

  .app-icon {
    width: 120px;
  }

  .footer-bottom {
    font-size: 12px;
  }
}
</style>
