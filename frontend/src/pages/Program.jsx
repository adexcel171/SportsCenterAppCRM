import { usePaystackPayment } from "react-paystack";
import { useSelector } from "react-redux";
import { useCreateSubscriptionMutation } from "../redux/api/subscriptionApiSlice";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add for navigation

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

  const workoutPlans = [
    {
      title: "8-Week Transformation",
      focus: "Fat Loss",
      duration: "8 Weeks",
      equipment: "Full Gym",
      intensity: "High",
    },
    {
      title: "Strength Foundation",
      focus: "Muscle Building",
      duration: "12 Weeks",
      equipment: "Free Weights",
      intensity: "Medium",
    },
    {
      title: "Sport-Specific Training",
      focus: "Performance",
      duration: "Custom",
      equipment: "Sport-Specific",
      intensity: "High",
    },
    {
      title: "Mobility Mastery",
      focus: "Flexibility",
      duration: "6 Weeks",
      equipment: "Bodyweight",
      intensity: "Low",
    },
  ];

  const { userInfo } = useSelector((state) => state.auth);
  const [createSubscription] = useCreateSubscriptionMutation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const navigate = useNavigate(); // Add navigation hook

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  console.log("Paystack Public Key:", publicKey);

  if (!publicKey) {
    console.error("Paystack public key is missing.");
  }

  const handlePaymentSuccess = async (reference) => {
    try {
      const subscriptionData = {
        plan: reference.metadata.plan,
        amount: reference.amount / 100,
        duration: reference.metadata.duration,
        paymentReference: reference.reference,
        paymentType: "Paystack",
        email: userInfo.email,
        name: userInfo.name,
      };

      console.log("Creating subscription with data:", subscriptionData);

      const result = await createSubscription(subscriptionData).unwrap();
      console.log("Subscription created successfully:", result);

      setPaymentSuccess(true);
      setActiveSubscription({
        plan: reference.metadata.plan,
        expirationDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toLocaleDateString(),
      });

      alert("Payment successful! Your subscription has been activated.");
      navigate("/home"); // Navigate to Home after success
    } catch (err) {
      console.error("Failed to save subscription:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const handlePayment = (plan) => {
    if (!userInfo) {
      navigate("/login"); // Use navigate instead of window.location
      return;
    }

    if (!userInfo?.email || !userInfo.email.includes("@")) {
      console.error("Invalid email:", userInfo?.email);
      alert("Invalid email address. Please update your profile.");
      return;
    }

    const amountInKobo = parseInt(plan.price.replace(/\D/g, "")) * 100;

    if (isNaN(amountInKobo) || amountInKobo <= 0) {
      console.error("Invalid amount:", plan.price);
      alert("Invalid plan price. Please contact support.");
      return;
    }

    const paymentConfig = {
      reference: uuidv4(),
      email: userInfo.email,
      amount: amountInKobo,
      publicKey: publicKey,
      metadata: {
        plan: plan.title,
        duration: plan.duration,
        userId: userInfo._id,
      },
    };

    console.log("Payment Config:", paymentConfig);

    if (
      !paymentConfig.email ||
      !paymentConfig.amount ||
      !paymentConfig.publicKey
    ) {
      console.error("Invalid payment configuration:", paymentConfig);
      alert("Payment configuration error. Please contact support.");
      return;
    }

    const initializePayment = usePaystackPayment(paymentConfig);
    initializePayment(
      (reference) => handlePaymentSuccess(reference),
      () => console.log("Payment closed")
    );
  };

  return (
    <div className="py-20">
      {paymentSuccess && activeSubscription && (
        <div className="container mx-auto px-4 mb-8">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
            <p>
              Welcome back, <strong>{userInfo?.name}</strong>! Your{" "}
              <strong>{activeSubscription.plan}</strong> subscription is active
              until <strong>{activeSubscription.expirationDate}</strong>.
            </p>
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

      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Training Programs
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Expert-designed regimens for all fitness levels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workoutPlans.map((plan, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <div className="space-y-2 text-gray-400">
                    <div className="flex justify-between">
                      <span>Focus:</span>
                      <span className="text-white">{plan.focus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="text-white">{plan.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span className="text-white">{plan.equipment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intensity:</span>
                      <span className="text-white">{plan.intensity}</span>
                    </div>
                  </div>
                  <button className="mt-6 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold text-white transition-all">
                    View Program
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
