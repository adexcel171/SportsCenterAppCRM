import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUserdataDetailsQuery,
  useDeleteUserdataMutation,
  useUpdateUserdataMutation,
} from "../../redux/api/userdataApiSlice";

const Userdetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Fetch user data using RTK Query
  const { data: userdata, error } = useGetUserdataDetailsQuery(params.id);

  // Define the update user data mutation
  const [updateUserdata] = useUpdateUserdataMutation();

  // Define the delete user data mutation
  const [deleteUserdata] = useDeleteUserdataMutation();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [credit, setCredit] = useState("");
  const [debit, setDebit] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [subscription, setSubscription] = useState("");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState("");

  // Populate fields when userdata is fetched
  useEffect(() => {
    if (userdata && userdata._id) {
      setName(userdata.name || "");
      setNumber(userdata.number || "");
      setEmail(userdata.email || "");
      setCredit(userdata.credit || "");
      setDebit(userdata.debit || "");
      setNote(userdata.note || "");
      setDate(userdata.date ? userdata.date.split("T")[0] : "");
      setSubscription(userdata.subscription || "");
      setSubscriptionEndDate(
        userdata.subscriptionEndDate
          ? userdata.subscriptionEndDate.split("T")[0]
          : ""
      );
    }
  }, [userdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        number,
        email,
        credit,
        debit,
        note,
        date,
        subscription,
        subscriptionEndDate,
      };

      console.log("Updating user data:", userData);

      const { data } = await updateUserdata({
        userdataId: params.id,
        ...userData,
      });

      console.log("Response data:", data);

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success("User data successfully updated", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/");
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error("Failed to update user data", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const result = await deleteUserdata(params.id);
      console.log(result);

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { data } = result;
      if (data && data.name) {
        toast.success(`"${data.name}" is deleted`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/");
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user data", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container xl:mx-[] sm:mx-[2px] mt-10">
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="md:w-3/4 p-3">
          <div className="h-12 mt-6 text-center font-bold text-2xl">
            Update and Delete Product
          </div>
          <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
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
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                placeholder="Enter phone number"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>

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
                name="email"
                placeholder="Enter email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="credit"
                name="credit"
                placeholder="Enter credit amount"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
              />
            </div>

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
                name="debit"
                placeholder="Enter debit amount"
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
                Notes
              </label>
              <textarea
                id="note"
                name="note"
                placeholder="Enter notes"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
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
                id="date"
                name="date"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="subscription"
                className="block text-sm font-medium text-gray-700"
              >
                Subscription Type
              </label>
              <select
                id="subscription"
                name="subscription"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
              >
                <option value="">Select Subscription</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

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
                name="subscriptionEndDate"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={subscriptionEndDate}
                onChange={(e) => setSubscriptionEndDate(e.target.value)}
              />
            </div>

            <div className="mb-10">
              <button
                type="submit"
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-blue-600"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Userdetails;
