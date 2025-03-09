import axios from "axios";

const PAYSTACK_SECRET_KEY = "your_paystack_secret_key"; // Replace with your actual secret key

export async function verifyPayment(paymentReference) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${paymentReference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { status: false, message: "Payment verification failed" };
  }
}
