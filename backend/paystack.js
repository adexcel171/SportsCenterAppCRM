import axios from "axios";

const PAYSTACK_SECRET_KEY =
  process.env.PAYSTACK_SECRET_KEY ||
  "sk_test_43acd6346cad8eb4b764fe521e4fcac1964aa790"; // Your provided key

export async function verifyPayment(paymentReference) {
  // Validate secret key presence and format
  if (!PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not defined.");
    return {
      status: false,
      message: "Server error: Paystack secret key missing",
    };
  }

  if (
    !PAYSTACK_SECRET_KEY.startsWith("sk_test_") &&
    !PAYSTACK_SECRET_KEY.startsWith("sk_live_")
  ) {
    console.error("PAYSTACK_SECRET_KEY format invalid:", PAYSTACK_SECRET_KEY);
    return {
      status: false,
      message: "Server error: Invalid Paystack secret key format",
    };
  }

  console.log("Using PAYSTACK_SECRET_KEY:", PAYSTACK_SECRET_KEY); // Log the exact key being used

  if (!paymentReference || typeof paymentReference !== "string") {
    console.error("Invalid paymentReference provided:", paymentReference);
    return { status: false, message: "Invalid payment reference" };
  }

  try {
    const headers = {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    };
    console.log("Request headers:", headers); // Log the headers being sent

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${paymentReference}`,
      { headers }
    );

    console.log("Paystack verification response:", response.data);
    return response.data; // { status: true, message: "Verification successful", data: { status: "success", ... } }
  } catch (error) {
    console.error(
      "Error verifying payment:",
      error.response?.data || error.message
    );
    return {
      status: false,
      message: error.response?.data?.message || "Payment verification failed",
    };
  }
}
