import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateUserdataMutation } from "../redux/api/userdataApiSlice";

const Form = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [subscription, setSubscription] = useState("");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("");

  const navigate = useNavigate();
  const [createUserdata] = useCreateUserdataMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      userData.append("name", name);
      userData.append("number", number);
      userData.append("email", email);
      userData.append("credit", credit);
      userData.append("debit", debit);
      userData.append("note", note);
      userData.append("date", date);

      userData.append("subscription", subscription);
      userData.append("subscriptionEndDate", subscriptionEndDate);

      const { data } = await createUserdata(userData);

      if (data?.name) {
        toast.success(`${data.name} has been successfully created!`);
        navigate("/");
      } else {
        toast.warning(
          "No data returned. Please check your input or try again."
        );
      }
    } catch (error) {}
  };

  return (
    <div className="mx-auto h-full p-8 mt-8 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl text-center mb-8 text-gray-800">
        Customer Details Form
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md h-auto mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter phone number"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Credit Field */}
        <div className="mb-4">
          <label
            htmlFor="credit"
            className="block text-sm font-medium text-gray-700"
          >
            Credit
          </label>
          <input
            type="number"
            id="credit"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            placeholder="Enter credit amount"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Debit Field */}
        <div className="mb-4">
          <label
            htmlFor="debit"
            className="block text-sm font-medium text-gray-700"
          >
            Debit
          </label>
          <input
            type="number"
            id="debit"
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
            placeholder="Enter debit amount"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter notes"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          ></textarea>
        </div>

        <div className="mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Subscription Type Field */}
        <div className="mb-4">
          <label
            htmlFor="subscription"
            className="block text-sm font-medium text-gray-700"
          >
            Subscription Type
          </label>
          <select
            id="subscription"
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select Subscription</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {/* Subscription End Date Field */}
        <div className="mb-4">
          <label
            htmlFor="subscriptionEndDate"
            className="block text-sm font-medium text-gray-700"
          >
            Subscription End Date
          </label>
          <input
            type="date"
            id="subscriptionEndDate"
            value={subscriptionEndDate}
            onChange={(e) => setSubscriptionEndDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Notes Field */}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
