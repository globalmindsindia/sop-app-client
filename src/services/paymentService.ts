import axios from "axios";

const BASE_URL = "https://services.globalmindsindia.in/api/payment";
// const BASE_URL = "http://127.0.0.1:5000/api/payment";

export const paymentService = {
  createOrder: async (data: {
    name: string;
    email: string;
    phone: string;
    amount: number;
    description: string;
  }) => {
    try {
      const response = await axios.post(`${BASE_URL}/create_order`, data);
      return response.data;
    } catch (error: any) {
      console.error("Create order error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    internal_receipt_id: string;
  }) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify`, data);
      return response.data;
    } catch (error: any) {
      console.error("Verify payment error:", error);
      throw new Error(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  },
};
