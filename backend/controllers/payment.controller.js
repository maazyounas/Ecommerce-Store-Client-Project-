// controllers/payment.controller.js
export const processPayment = async (req, res) => {
    try {
      const { method, amount, orderId } = req.body;
  
      if (!method || !amount || !orderId) {
        return res.status(400).json({ message: "Required fields missing" });
      }
  
      let status = "pending";
  
      switch (method) {
        case 'easypaisa':
          // Simulated Easypaisa payment flow
          status = "paid";
          return res.status(200).json({
            message: "Easypaisa payment successful",
            method,
            status,
            orderId,
          });
  
        case 'cash':
          status = "pending";
          return res.status(200).json({
            message: "Cash on delivery selected",
            method,
            status,
            orderId,
          });
  
        case 'stripe':
          // Stripe integration goes here
          status = "paid";
          return res.status(200).json({
            message: "Stripe payment successful",
            method,
            status,
            orderId,
          });
  
        default:
          return res.status(400).json({ message: "Invalid payment method" });
      }
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ message: "Payment processing failed", error });
    }
  };
  