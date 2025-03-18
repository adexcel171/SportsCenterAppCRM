import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";
import { useCreateSubscriptionMutation } from "../redux/api/subscriptionApiSlice";

const Programs = () => {
  const subscriptions = [
    {
      title: "Starter Pass",
      price: "₦25,000",
      duration: "month",
      features: [
        "Basic gym access",
        "1 group class/week",
        "Court booking (2hrs/week)",
        "Locker access",
      ],
      popular: false,
      color: "from-gray-100 to-gray-200",
    },
    {
      title: "Pro Athlete",
      price: "₦65,000",
      duration: "month",
      features: [
        "Unlimited gym access",
        "3 personal training sessions",
        "Unlimited group classes",
        "Court priority booking",
        "Sauna access",
      ],
      popular: true,
      color: "from-red-100 to-red-200",
    },
    {
      title: "Elite Membership",
      price: "₦120,000",
      duration: "month",
      features: [
        "24/7 facility access",
        "5 personal training sessions",
        "Nutrition planning",
        "VIP locker room",
        "Guest passes",
        "Sports massage",
      ],
      popular: false,
      color: "from-gray-100 to-gray-200",
    },
  ];

  const { userInfo } = useSelector((state) => state.auth);
  const [createSubscription] = useCreateSubscriptionMutation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

  const generateTicket = (subscriptionData, reference) => {
    const ticketId = uuidv4().slice(0, 8);
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    return {
      ticketId,
      userName: userInfo?.username || "Unknown User",
      userEmail: userInfo?.email || "N/A",
      plan: subscriptionData.plan,
      amount: subscriptionData.amount,
      paymentReference: reference,
      purchaseDate: new Date().toLocaleString(),
      expirationDate: expirationDate.toLocaleString(),
    };
  };

  const downloadTicket = (ticket) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Gym Subscription Ticket", 20, 20);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticket.ticketId}`, 20, 40);
    doc.text(`Name: ${ticket.userName}`, 20, 50);
    doc.text(`Email: ${ticket.userEmail}`, 20, 60);
    doc.text(`Plan: ${ticket.plan}`, 20, 70);
    doc.text(`Amount: ₦${ticket.amount.toLocaleString()}`, 20, 80);
    doc.text(`Payment Reference: ${ticket.paymentReference}`, 20, 90);
    doc.text(`Purchased: ${ticket.purchaseDate}`, 20, 100);
    doc.text(`Expires: ${ticket.expirationDate}`, 20, 110);
    doc.save(`ticket_${ticket.ticketId}.pdf`);
  };

  const handlePaymentSuccess = async (reference, paymentConfig) => {
    try {
      console.log("Paystack callback response:", reference);
      if (!reference || typeof reference.reference !== "string") {
        throw new Error(
          "Invalid payment response from Paystack: " + JSON.stringify(reference)
        );
      }

      if (!userInfo) {
        throw new Error("User not authenticated. Please log in.");
      }

      console.log("UserInfo before subscription:", userInfo);
      const token = userInfo.token || userInfo.jwt;
      if (!token) {
        console.error("No token found in userInfo:", userInfo);
        throw new Error("No token found in userInfo. Please log in again.");
      }

      const subscriptionData = {
        plan: paymentConfig.metadata.plan,
        amount: paymentConfig.amount / 100,
        duration: paymentConfig.metadata.duration,
        paymentReference: reference.reference,
        paymentType: "Paystack",
      };

      console.log("Creating subscription with data:", subscriptionData);
      const result = await createSubscription(subscriptionData).unwrap();
      console.log("Subscription created successfully:", result);

      const newTicket = generateTicket(subscriptionData, reference.reference);
      setTicket(newTicket);
      setPaymentSuccess(true);
      setActiveSubscription({
        plan: subscriptionData.plan,
        expirationDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toLocaleDateString(),
      });
      downloadTicket(newTicket); // Initial download happens here
      // Removed navigation timeout to keep the success UI visible
    } catch (err) {
      console.error("Subscription creation failed:", err);
      setErrorMessage(
        err.data?.message ||
          err.message ||
          "Failed to create subscription. Please try again."
      );
      if (
        err.status === 401 ||
        err.message?.includes("Unauthorized") ||
        err.message?.includes("No token")
      ) {
        console.warn("Auth issue detected - Redirecting to login");
        navigate("/login");
      }
    }
  };

  const handlePayment = (plan) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    if (!publicKey) {
      setErrorMessage("Payment system is unavailable. Contact support.");
      return;
    }

    const amountInKobo = parseInt(plan.price.replace(/\D/g, "")) * 100;
    if (isNaN(amountInKobo) || amountInKobo <= 0) {
      setErrorMessage("Invalid plan price. Please contact support.");
      return;
    }

    const paymentConfig = {
      reference: uuidv4(),
      email: userInfo.email,
      amount: amountInKobo,
      key: publicKey,
      metadata: {
        plan: plan.title,
        duration: plan.duration,
        userId: userInfo._id,
      },
    };

    console.log("Payment config:", paymentConfig);

    const loadPaystackScript = () => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => {
        const handler = window.PaystackPop.setup({
          ...paymentConfig,
          callback: (response) => handlePaymentSuccess(response, paymentConfig),
          onClose: () => setErrorMessage("Payment was closed by user."),
        });
        handler.openIframe();
      };
      script.onerror = () =>
        setErrorMessage("Failed to load payment system. Please try again.");
      document.body.appendChild(script);
    };

    loadPaystackScript();
  };

  const dismissSuccessMessage = () => {
    setPaymentSuccess(false);
    setActiveSubscription(null);
    setTicket(null);
    navigate("/landing"); // Navigate only when user dismisses the success message
  };

  return (
    <div className="py-20">
      {paymentSuccess && activeSubscription && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
            <p>
              Welcome back, <strong>{userInfo?.username}</strong>! Your{" "}
              <strong>{activeSubscription.plan}</strong> subscription is active
              until <strong>{activeSubscription.expirationDate}</strong>.
            </p>
            {ticket && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-bold">Your Subscription Ticket</h3>
                <p>
                  Ticket ID: <strong>{ticket.ticketId}</strong>
                </p>
                <p>Name: {ticket.userName}</p>
                <p>Email: {ticket.userEmail}</p>
                <p>Plan: {ticket.plan}</p>
                <p>Amount: ₦{ticket.amount.toLocaleString()}</p>
                <p>Payment Reference: {ticket.paymentReference}</p>
                <p>Purchased: {ticket.purchaseDate}</p>
                <p>Expires: {ticket.expirationDate}</p>
                <button
                  onClick={() => downloadTicket(ticket)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
                >
                  Download Ticket Again
                </button>
                <button
                  onClick={dismissSuccessMessage}
                  className="mt-4 ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Membership Plans
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Flexible options for every athlete's needs and goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptions.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${plan.color} rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <div className="text-4xl font-black mb-4">
                    {plan.price}
                    <span className="text-lg text-gray-600">
                      /{plan.duration}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center text-gray-700"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePayment(plan)}
                    className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold text-white transition-all"
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
