import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useCreateUserdataMutation } from "../redux/api/userdataApiSlice";

const Form = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [credit, setCredit] = useState("");
  const [debit, setDebit] = useState("0");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("");

  const navigate = useNavigate();

  const [createuserdata] = useCreateUserdataMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object and append form values
      const userData = new FormData();
      userData.append("name", name);
      userData.append("number", number);
      userData.append("credit", credit);
      userData.append("debit", debit);
      userData.append("note", note);
      userData.append("date", date);
      userData.append("currency", currency);

      // Call API to create or update user data
      const { data } = await createuserdata(userData);

      // Handle the response
      if (data?.name) {
        toast.success(`${data.name} has been successfully created!`);
        navigate("/"); // Redirect to the homepage
      } else if (data) {
        toast.info("User data has been successfully updated.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.warning(
          "No data returned. Please check your input or try again.",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      // Log the error for debugging
      console.error("Error occurred while processing user data:", error);

      // Provide user-friendly feedback for errors
      toast.error("An error occurred. Please try again later.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className=" mx-auto h-full p-8 mt-8 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl text-center mb-8 text-gray-800">
        Customer Details Form
      </h1>

      <form className="max-w-md h-auto mx-auto bg-white p-6 rounded-lg shadow-lg">
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
            name="name"
            placeholder="Enter name"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700"
          >
            Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            placeholder="Enter number..."
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="credit"
            className="block text-sm font-medium text-gray-700"
          >
            Credit
          </label>
          <input
            type="number"
            name="credit"
            placeholder="Enter credit amount"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Debit
          </label>
          <input
            type="text"
            placeholder="Enter debit amount"
            id="amount"
            name="amount"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700"
          >
            Note
          </label>
          <textarea
            placeholder="Enter note"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700"
          >
            Subscription
          </label>
          <select
            className="mt-1 p-2 text-black w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => setCurrency(e.target.value)}
            value={currency}
          >
            <option className="text-black" value="">
              Choose Subscription
            </option>
            <option> Weekly</option>
            <option> Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white mb-8 p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
