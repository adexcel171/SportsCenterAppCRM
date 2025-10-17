import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { useCreateSubscriptionMutation } from "../redux/api/subscriptionApiSlice";
import { useAddUserDataMutation } from "../redux/api/userdataApiSlice";

const Programs = () => {
  const subscriptions = [
    {
      title: "Daily Walking",
      price: "₦3,000",
      duration: "day",
      features: ["Basic gym access", "Walking track access", "Locker access"],
      popular: false,
      color: "from-gray-100 to-gray-200",
    },
    {
      title: "Weekly Plan",
      price: "₦10,000",
      duration: "week",
      features: [
        "Unlimited gym access",
        "1 group class/week",
        "Court booking (2hrs/week)",
        "Locker access",
      ],
      popular: false,
      color: "from-blue-100 to-blue-200",
    },
    {
      title: "Couple Monthly",
      price: "₦50,000",
      duration: "month",
      features: [
        "Unlimited gym access for two",
        "2 group classes/week",
        "Court priority booking",
        "Sauna access",
        "Locker access for two",
      ],
      popular: true,
      color: "from-red-100 to-red-200",
    },
    {
      title: "Monthly Plan",
      price: "₦30,000",
      duration: "month",
      features: [
        "Unlimited gym access",
        "1 personal training session",
        "2 group classes/week",
        "Court booking (4hrs/week)",
        "Sauna access",
      ],
      popular: false,
      color: "from-gray-100 to-gray-200",
    },
  ];

  const { userInfo } = useSelector((state) => state.auth);
  const [createSubscription] = useCreateSubscriptionMutation();
  const [addUserData] = useAddUserDataMutation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

  const generateTicket = (subscriptionData, reference) => {
    const ticketId = uuidv4().slice(0, 8);
    const expirationDate = new Date();
    if (subscriptionData.duration === "day") {
      expirationDate.setDate(expirationDate.getDate() + 1);
    } else if (subscriptionData.duration === "week") {
      expirationDate.setDate(expirationDate.getDate() + 7);
    } else {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    }

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
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(255, 69, 58);
    doc.rect(0, 0, 210, 40, "F");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Gym Subscription Ticket", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(255, 69, 58);
    doc.setLineWidth(1);
    doc.roundedRect(10, 50, 190, 200, 5, 5, "D");

    const contentX = 20;
    let contentY = 65;
    const lineHeight = 10;

    doc.text("Ticket Details", contentX, contentY);
    doc.setFont("helvetica", "normal");
    contentY += lineHeight;

    doc.text(`Ticket ID: ${ticket.ticketId}`, contentX, contentY);
    contentY += lineHeight;
    doc.text(`Name: ${ticket.userName}`, contentX, contentY);
    contentY += lineHeight;
    doc.text(`Email: ${ticket.userEmail}`, contentX, contentY);
    contentY += lineHeight;
    doc.text(`Plan: ${ticket.plan}`, contentX, contentY);
    contentY += lineHeight;
    doc.text(`Amount: ₦${ticket.amount.toLocaleString()}`, contentX, contentY);
    contentY += lineHeight;
    doc.text(
      `Payment Reference: ${ticket.paymentReference}`,
      contentX,
      contentY
    );
    contentY += lineHeight;
    doc.text(`Purchased: ${ticket.purchaseDate}`, contentX, contentY);
    contentY += lineHeight;
    doc.text(`Expires: ${ticket.expirationDate}`, contentX, contentY);

    QRCode.toDataURL(
      ticket.ticketId,
      { errorCorrectionLevel: "H", width: 100 },
      (err, url) => {
        if (!err) {
          doc.addImage(url, "PNG", 140, 180, 50, 50);
          doc.save(`ticket_${ticket.ticketId}.pdf`);
        } else {
          console.error("QR Code generation failed:", err);
          doc.save(`ticket_${ticket.ticketId}.pdf`);
        }
      }
    );
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

      const startDate = new Date();
      const endDate = new Date();
      if (paymentConfig.metadata.duration === "day") {
        endDate.setDate(endDate.getDate() + 1);
      } else if (paymentConfig.metadata.duration === "week") {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const subscriptionData = {
        plan: paymentConfig.metadata.plan,
        amount: paymentConfig.amount / 100,
        duration: paymentConfig.metadata.duration,
        paymentReference: reference.reference,
        paymentType: "Paystack",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      console.log("Creating subscription with data:", subscriptionData);
      const subscriptionResult = await createSubscription(
        subscriptionData
      ).unwrap();
      console.log("Subscription created successfully:", subscriptionResult);

      // Update or create UserData entry for Couple Monthly or Monthly Plan
      if (
        paymentConfig.metadata.plan === "Couple Monthly" ||
        paymentConfig.metadata.plan === "Monthly Plan"
      ) {
        const userDataPayload = {
          userId: userInfo._id,
          name: userInfo.username || "Unknown User",
          number: userInfo.number || "N/A",
          email: userInfo.email || "N/A",
          credit: 0,
          debit: 0,
          note: `Subscribed to ${paymentConfig.metadata.plan}`,
          dateOfBirth: userInfo.dateOfBirth || new Date().toISOString(),
          subscription: paymentConfig.metadata.plan,
          subscriptionEndDate: endDate.toISOString(),
          height: 170,
          bodyType: "Average",
          fitnessGoals: "General Fitness",
          activityLevel: "Moderate",
          dietaryPreferences: "Nigerian Traditional",
          preferredSports: "None",
          gender: userInfo.gender || "Not Specified",
        };

        console.log("Creating/Updating UserData with:", userDataPayload);
        await addUserData(userDataPayload).unwrap();
      }

      const newTicket = generateTicket(subscriptionData, reference.reference);
      setTicket(newTicket);
      setPaymentSuccess(true);
      setActiveSubscription({
        plan: subscriptionData.plan,
        expirationDate: endDate.toLocaleDateString(),
      });
      downloadTicket(newTicket);
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
    navigate("/landing");
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
